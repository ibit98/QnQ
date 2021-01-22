import React from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { useIsDrawerOpen } from "@react-navigation/drawer";

import styles from "../styles/review-styles";
import ReviewItem from "../components/ReviewItem";

export default function LocationScreen({ route, navigation }) {
  const { review } = route.params;
  const isDrawerOpen = useIsDrawerOpen();

  return (
    <View style={styles.reviewContainer}>
      <StatusBar style={isDrawerOpen ? "light" : "dark"} />

      <ScrollView>
        <ReviewItem review={review} standalone={true} />
      </ScrollView>
    </View>
  );
}
