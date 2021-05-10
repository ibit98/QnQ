import React, { useContext, useEffect, useState, useCallback } from "react";

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
  SafeAreaView,
} from "react-native";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";

import StarRating from "../components/StarRating";
import ReviewItem from "../components/ReviewItem";
import styles from "../styles/location-styles";
import { API_URL } from "../constants";
import { UserContext } from "../contexts/UserContext";

export default function LocationScreen({ route, navigation }) {
  const [reviews, setReviews] = useState([]);
  const [locationScore, setLocationScore] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [myReview, setMyReview] = useState(null);
  const {
    place: { id },
  } = route.params;
  const isDrawerOpen = useIsDrawerOpen();
  const { user } = useContext(UserContext);

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
  const loadMyReview = async () => {
    try {
      const jsonResponse = await fetch(API_URL + `reviews/location/${id}/my`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const response = await jsonResponse.json();

      if (response) {
        setMyReview(response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const appendReviews = (newReviews) => {
    setReviews([...reviews, ...newReviews]);
  };
  const renderReview = ({ item }) => (
    <ReviewItem review={item} standalone={false} />
  );

  const loadLocationScore = async () => {
    fetch(API_URL + `location/${id}/score`, {
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

        setLocationScore(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      loadReviewsAsync();
      return () => {
        setReviews([]);
        setIsLoadingReviews(true);
      };
    }, [navigation])
  );

  useEffect(() => {
    loadLocationScore();
    loadMyReview();
  }, []);

  const MAX_SCORE = 5;

  return (
    <View style={styles.container}>
      <StatusBar style={isDrawerOpen ? "light" : "dark"} />
      <SafeAreaView style={styles.reviewsContainer}>
        <View style={styles.locationRatingView}>
          <Text>Location Score</Text>
          <Text style={styles.locationRating}>
            {Math.round(locationScore * 10) / 10} / 5
          </Text>
        </View>

        {isLoadingReviews ? (
          <ActivityIndicator size="large" color="lightgray" />
        ) : (
          <>
            <FlatList
              style={[
                styles.reviewList,
                reviews.length === 0
                  ? { marginBottom: 0 }
                  : { marginBottom: 138 },
              ]}
              data={reviews}
              renderItem={renderReview}
              keyExtractor={(item) => item._id}
              ListHeaderComponent={
                <>
                  {myReview ? (
                    <View style={styles.myReviewContainer}>
                      <Text style={styles.myReviewBannerPrimary}>
                        Your Review
                      </Text>
                      <ReviewItem review={myReview} standalone={false} />
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CreateReview", {
                            place: route.params.place,
                          })
                        }
                      >
                        <Text style={styles.myReviewBannerPrimary}>
                          Edit your review
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
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
                        <Text style={styles.myReviewBannerPrimary}>
                          Review this location
                        </Text>
                        <Text style={styles.myReviewBannerSecondary}>
                          Share your thoughts on this place's hygiene to help
                          others be safe
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  <Text style={styles.reviewsHeader}>Reviews</Text>
                </>
              }
            />
            {reviews.length == 0 && (
              <Text style={styles.noReviewsBanner}>No reviews yet</Text>
            )}
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
