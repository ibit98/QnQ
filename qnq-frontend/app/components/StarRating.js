import React, { useState } from "react";

import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";

const StarRating = (props) => {
  const starSize = props.size == undefined ? 30 : props.size;

  const initialRating =
    props.initialRating == undefined ? 0 : props.initialRating;
  const starCount = props.starCount == undefined ? 5 : props.starCount;
  const onRatingChange =
    props.onRatingChange == undefined
      ? (newRating) => {}
      : props.onRatingChange;
  const disabled = props.disabled;

  const [rating, setRating] = useState(initialRating);

  const stars = [];
  for (let index = 0; index < starCount; ++index) {
    stars.push(
      <View key={index + 1} style={styles.starView}>
        <Icon
          name="star"
          color="#dddddd"
          size={starSize}
          style={styles.starBackground}
          onPress={
            disabled
              ? () => {}
              : rating > index
              ? () => {}
              : () => {
                  setRating(index + 1);
                  onRatingChange(index + 1);
                }
          }
        />
        {rating > index && (
          <Icon
            name="star"
            color="gold"
            size={starSize}
            style={styles.starForeground}
            onPress={
              disabled
                ? () => {}
                : () => {
                    setRating(index + 1);
                    onRatingChange(index + 1);
                  }
            }
          />
        )}
      </View>
    );
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 30,
  },
  starView: {},
  starBackground: { position: "relative" },
  starForeground: { position: "absolute" },
});

export default StarRating;
