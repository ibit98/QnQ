import React from "react";

import { Button } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../../screens/HomeScreen";
import LocationScreen from "../../screens/LocationScreen";

const Stack = createStackNavigator();

export default function HomeStack({ navigation }) {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={() => ({
        headerShown: false
      })}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <Icon
              name="three-bars"
              size={28}
              style={{ padding: 10, paddingLeft: 18 }}
              onPress={() => navigation.openDrawer()}
            />
          )
        }}
      />
      <Stack.Screen name="Location" component={LocationScreen} />
    </Stack.Navigator>
  );
}
