import React, { useEffect } from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("drawerOpen", e => {
      setStatusBarStyle("light");
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("drawerClose", e => {
      setStatusBarStyle("dark");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <StatusBar style="dark" />
      <Text>Home Page</Text>
      <Button
        onPress={() => navigation.navigate("Profile")}
        title="Go to profile"
      />
    </SafeAreaView>
  );
}
