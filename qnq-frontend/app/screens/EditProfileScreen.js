import React from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  Button,
  PanResponder,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../styles/navigation-styles";

export default function EditProfileScreen({ navigation }) {
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
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Edit profile screen</Text>
      </View>
    </SafeAreaView>
  );
}
