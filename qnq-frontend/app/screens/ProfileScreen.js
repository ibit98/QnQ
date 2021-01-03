import React from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";

export default function ProfileScreen({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("drawerOpen", (e) => {
      setStatusBarStyle("light");
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("drawerClose", (e) => {
      setStatusBarStyle("dark");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Page</Text>
    </View>
  );
}
