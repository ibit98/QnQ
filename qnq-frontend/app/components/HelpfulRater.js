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

export default function HelpfulRater({ count, onPressHandler, active }) {
  return (
    <Rater
      count={count}
      iconName="chevron-up"
      size={25}
      color={active ? "#54d40f" : "gray"}
      onPressHandler={onPressHandler}
    />
  );
}
