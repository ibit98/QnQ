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

export default function HarmfulRater({ count, onPressHandler, active }) {
  return (
    <Rater
      count={count}
      iconName="chevron-down"
      size={25}
      color={active ? "#db1f1f" : "gray"}
      onPressHandler={onPressHandler}
    />
  );
}
