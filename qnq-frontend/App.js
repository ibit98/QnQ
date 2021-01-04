import React from "react";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import Stack from "./app/config/navigation/stack";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack />
    </NavigationContainer>
  );
}
