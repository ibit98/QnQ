import React from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { useIsDrawerOpen } from "@react-navigation/drawer";

import styles from "../styles/review-styles";

export default function LocationScreen({ route, navigation }) {
  const { review } = route.params;
  const isDrawerOpen = useIsDrawerOpen();

  return (
    <View style={styles.reviewContainer}>
      <StatusBar style={isDrawerOpen ? "light" : "dark"} />

      <ScrollView>
        <View style={styles.reviewerView}>
          <Image
            source={require("../assets/avatar-placeholder.jpg")}
            style={styles.reviewerImage}
          ></Image>
          <View style={styles.reviewerText}>
            <Text style={styles.reviewerName}>{review._creator.name}</Text>
            <Text style={styles.reviewerRating}>Rating</Text>
          </View>
        </View>
        <Text style={styles.reviewText}>{review.text}</Text>
      </ScrollView>
    </View>
  );
}
