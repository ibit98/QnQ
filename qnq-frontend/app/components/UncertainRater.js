import React from "react";

import {
  // Button,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";

import Rater from "./Rater";

export default function UncertainRater({ count, onPressHandler, active }) {
  return (
    <Rater
      count={count}
      iconName="dash"
      size={25}
      color={active ? "#f5cb0f" : "gray"}
      onPressHandler={onPressHandler}
    />
  );
}
