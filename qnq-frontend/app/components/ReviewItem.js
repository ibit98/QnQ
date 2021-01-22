import React from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ReviewItem({ review }) {
  const { title, text } = review;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="white"
        onPress={() => navigation.navigate("Review", { review: review })}
      >
        <View style={styles.reviewContentView}>
          <Text
            ellipsizeMode={"tail"}
            numberOfLines={1}
            style={styles.reviewTitle}
          >
            {title}
          </Text>
          <Text
            ellipsizeMode={"tail"}
            numberOfLines={3}
            style={styles.reviewText}
          >
            {text}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray"
  },
  reviewerImage: {
    borderRadius: 50,
    height: 35,
    width: 35
  },
  reviewerText: {
    marginLeft: 8,
    justifyContent: "center"
  },
  reviewerView: {
    flexDirection: "row",
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  reviewerName: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold"
  },
  reviewerRating: {
    color: "gray",
    fontSize: 13
  },
  reviewContentView: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15
  },
  reviewTitle: {
    fontWeight: "bold",
    fontSize: 15
  },
  reviewText: {
    color: "gray"
  }
});
