import React from "react";

import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function SplashScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <StatusBar style="dark" />
      <Text style={{ fontSize: 100 }}>Splash</Text>
    </View>
  );
}
