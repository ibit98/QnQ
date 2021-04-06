import React, { useEffect, useState, useCallback } from "react";

import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";

import ReviewItem from "../components/ReviewItem";
import styles from "../styles/location-styles";
import { API_URL } from "../constants";

export default function LocationScreen({ route, navigation }) {
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const {
    place: { id },
  } = route.params;
  const isDrawerOpen = useIsDrawerOpen();

  const loadReviewsAsync = async () => {
    fetch(API_URL + `reviews/location/${id}?offset=${reviews.length}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((jsonResponse) => jsonResponse.json())
      .then((response) => {
        if (response.error) {
          return;
        }

        appendReviews(response);
        setIsLoadingReviews(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const appendReviews = (newReviews) => {
    setReviews([...reviews, ...newReviews]);
  };
  const renderReview = ({ item }) => (
    <ReviewItem review={item} standalone={false} />
  );

  useFocusEffect(
    useCallback(() => {
      loadReviewsAsync();
      return () => {
        setReviews([]);
        setIsLoadingReviews(true);
      };
    }, [navigation])
  );

  return (
    <View>
      <StatusBar style={isDrawerOpen ? "light" : "dark"} />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CreateReview", {
            place: route.params.place,
          })
        }
      >
        <View style={styles.myReviewContainer}>
          <Image
            source={require("../assets/avatar-placeholder.jpg")}
            style={styles.myImage}
          ></Image>
          <Text style={styles.myReviewBannerPrimary}>Review this location</Text>
          <Text style={styles.myReviewBannerSecondary}>
            Share your thoughts on this place's hygiene to help others be safe
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsHeader}>Reviews</Text>
        {isLoadingReviews ? (
          <ActivityIndicator size="large" color="lightgray" />
        ) : reviews.length == 0 ? (
          <Text style={styles.noReviewsBanner}>No reviews yet</Text>
        ) : (
          <FlatList
            style={styles.reviewList}
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    </View>
  );
}
