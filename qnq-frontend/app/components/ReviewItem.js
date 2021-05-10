import React, { useContext, useEffect, useReducer } from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { API_URL } from "../constants";
import { UserContext } from "../contexts/UserContext";
import HelpfulRater from "./HelpfulRater";
import HarmfulRater from "./HarmfulRater";
import UncertainRater from "./UncertainRater";
import standaloneStyles from "../styles/review-styles";
import StarRating from "./StarRating";

export default function ReviewItem({ review, standalone }) {
  const MAX_SCORE = 5;

  const { user } = useContext(UserContext);
  const { title, text } = review;
  const initialState = {
    reviewId: review._id,
    meta: review.meta,
    rating: null,
  };

  function setHelpful(reviewId, dispatch) {
    postRating(reviewId, "helpful");
    dispatch({ type: "RATE_HELPFUL" });
  }

  function setHarmful(reviewId, dispatch) {
    postRating(reviewId, "harmful");
    dispatch({ type: "RATE_HARMFUL" });
  }

  function setUncertain(reviewId, dispatch) {
    postRating(reviewId, "uncertain");
    dispatch({ type: "RATE_UNCERTAIN" });
  }

  function setNoRating(reviewId, dispatch) {
    postRating(reviewId, "none");
    dispatch({ type: "SET_NO_RATING" });
  }

  function reducer(prevState, action) {
    switch (action.type) {
      case "RATE_HELPFUL":
        return {
          ...prevState,
          rating: "helpful",
          meta: {
            beliefCount:
              prevState.rating == "helpful"
                ? prevState.meta.beliefCount
                : prevState.meta.beliefCount + 1,
            uncertaintyCount:
              prevState.rating == "uncertain"
                ? prevState.meta.uncertaintyCount - 1
                : prevState.meta.uncertaintyCount,
            disbeliefCount:
              prevState.rating == "harmful"
                ? prevState.meta.disbeliefCount - 1
                : prevState.meta.disbeliefCount,
          },
        };
      case "RATE_HARMFUL":
        return {
          ...prevState,
          rating: "harmful",
          meta: {
            beliefCount:
              prevState.rating == "helpful"
                ? prevState.meta.beliefCount - 1
                : prevState.meta.beliefCount,
            uncertaintyCount:
              prevState.rating == "uncertain"
                ? prevState.meta.uncertaintyCount - 1
                : prevState.meta.uncertaintyCount,
            disbeliefCount:
              prevState.rating == "harmful"
                ? prevState.meta.disbeliefCount
                : prevState.meta.disbeliefCount + 1,
          },
        };
      case "RATE_UNCERTAIN":
        return {
          ...prevState,
          rating: "uncertain",
          meta: {
            beliefCount:
              prevState.rating == "helpful"
                ? prevState.meta.beliefCount - 1
                : prevState.meta.beliefCount,
            uncertaintyCount:
              prevState.rating == "uncertain"
                ? prevState.meta.uncertaintyCount
                : prevState.meta.uncertaintyCount + 1,
            disbeliefCount:
              prevState.rating == "harmful"
                ? prevState.meta.disbeliefCount - 1
                : prevState.meta.disbeliefCount,
          },
        };
      case "SET_NO_RATING":
        return {
          ...prevState,
          rating: null,
          meta: {
            beliefCount:
              prevState.rating == "helpful"
                ? prevState.meta.beliefCount - 1
                : prevState.meta.beliefCount,
            uncertaintyCount:
              prevState.rating == "uncertain"
                ? prevState.meta.uncertaintyCount - 1
                : prevState.meta.uncertaintyCount,
            disbeliefCount:
              prevState.rating == "harmful"
                ? prevState.meta.disbeliefCount - 1
                : prevState.meta.disbeliefCount,
          },
        };
      case "UPDATE_META":
        return {
          ...prevState,
          meta: action.data.meta,
        };
      case "UPDATE_MY_RATING":
        return {
          ...prevState,
          rating: action.data.rating,
        };
      default:
        throw new Error();
    }
  }

  async function postRating(reviewId, type) {
    fetch(API_URL + `reviews/${reviewId}/rate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        feedback: type,
        userId: user._id,
      }),
    })
      .then((jsonResponse) => jsonResponse.json())
      .then((response) => {
        if (response.error) {
          console.error(response.error);
          return;
        }

        // TODO: Update with received meta required? Gives way to errors.
        // Find a better way to do this
        // dispatch({
        //   type: "UPDATE_META",
        //   data: { meta: response.updatedMeta }
        // });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const [{ reviewId, meta, rating }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const navigation = useNavigation();

  useEffect(() => {
    async function checkIfCurrentUserHasRated() {
      fetch(API_URL + `reviews/${reviewId}/my-rating`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
      })
        .then((jsonResponse) => jsonResponse.json())
        .then((response) => {
          if (!response) {
            dispatch({ type: "UPDATE_MY_RATING", data: { rating: null } });
            return;
          }

          if (response.error) {
            console.error(response.error);
            return;
          }

          dispatch({
            type: "UPDATE_MY_RATING",
            data: { rating: response.feedback },
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }

    checkIfCurrentUserHasRated();
  }, []);

  if (!standalone) {
    return (
      <View style={styles.container}>
        <View style={styles.reviewerView}>
          <Image
            source={require("../assets/avatar-placeholder.jpg")}
            style={styles.reviewerImage}
          ></Image>
          <View style={styles.reviewerText}>
            <Text style={styles.reviewerName}>{review._creator.name}</Text>
            <View style={styles.reviewScore}>
              <StarRating
                size={18}
                disabled={true}
                initialRating={review.score}
                starCount={MAX_SCORE}
              />
            </View>
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
        <View style={styles.ratingView}>
          <HelpfulRater
            count={meta.beliefCount}
            active={rating == "helpful"}
            onPressHandler={
              rating == "helpful"
                ? () => setNoRating(review._id, dispatch)
                : () => setHelpful(review._id, dispatch)
            }
          />
          <UncertainRater
            count={meta.uncertaintyCount}
            active={rating == "uncertain"}
            onPressHandler={
              rating == "uncertain"
                ? () => setNoRating(review._id, dispatch)
                : () => setUncertain(review._id, dispatch)
            }
          />
          <HarmfulRater
            count={meta.disbeliefCount}
            active={rating == "harmful"}
            onPressHandler={
              rating == "harmful"
                ? () => setNoRating(review._id, dispatch)
                : () => setHarmful(review._id, dispatch)
            }
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={standaloneStyles.reviewerView}>
        <Image
          source={require("../assets/avatar-placeholder.jpg")}
          style={standaloneStyles.reviewerImage}
        ></Image>
        <View style={standaloneStyles.reviewerText}>
          <Text style={standaloneStyles.reviewerName}>
            {review._creator.name}
          </Text>
          <View style={styles.reviewScore}>
            <StarRating
              size={25}
              disabled={true}
              initialRating={review.score}
              starCount={MAX_SCORE}
            />
          </View>
        </View>
      </View>
      <Text style={standaloneStyles.reviewText}>{review.text}</Text>
      <View style={styles.ratingView}>
        <HelpfulRater
          count={meta.beliefCount}
          active={rating == "helpful"}
          onPressHandler={
            rating == "helpful"
              ? () => setNoRating(review._id, dispatch)
              : () => setHelpful(review._id, dispatch)
          }
        />
        <UncertainRater
          count={meta.uncertaintyCount}
          active={rating == "uncertain"}
          onPressHandler={
            rating == "uncertain"
              ? () => setNoRating(review._id, dispatch)
              : () => setUncertain(review._id, dispatch)
          }
        />
        <HarmfulRater
          count={meta.disbeliefCount}
          active={rating == "harmful"}
          onPressHandler={
            rating == "harmful"
              ? () => setNoRating(review._id, dispatch)
              : () => setHarmful(review._id, dispatch)
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  ratingView: {
    padding: 7,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  reviewerImage: {
    borderRadius: 50,
    height: 35,
    width: 35,
  },
  reviewerText: {
    marginLeft: 8,
    justifyContent: "center",
  },
  reviewerView: {
    flexDirection: "row",
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  reviewerName: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
  reviewScore: {},
  reviewContentView: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  reviewTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  reviewText: {
    color: "gray",
  },
});
