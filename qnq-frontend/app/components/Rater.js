import React from "react";

import {
  // Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";

export default function Rater({
  iconName,
  size,
  color,
  count,
  onPressHandler
}) {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row"
    },
    rateCount: {
      padding: 3,
      color: color
    }
  });

  return (
    <TouchableOpacity onPress={onPressHandler}>
      <View style={styles.container}>
        <Icon name={iconName} size={size} color={color} />
        <Text style={styles.rateCount}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}
