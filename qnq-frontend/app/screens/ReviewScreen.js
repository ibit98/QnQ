import React, { useEffect, useState } from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";

import styles from "../styles/review-styles";

export default function LocationScreen({ route, navigation }) {
  const { review } = route.params;

  return (
    <View style={styles.reviewContainer}>
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
