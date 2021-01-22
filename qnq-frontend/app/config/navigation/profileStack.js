import React from "react";

import Icon from "react-native-vector-icons/Octicons";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../../screens/ProfileScreen";
import EditProfileScreen from "../../screens/EditProfileScreen";

const Stack = createStackNavigator();

export default function ProfileStack({ navigation }) {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
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
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={({ route }) => ({
          headerShown: true,
          title: "Edit Profile"
        })}
      />
    </Stack.Navigator>
  );
}
