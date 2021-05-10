import React from "react";

// import Icon from "react-native-vector-icons/Octicons";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

import LeaderboardScreen from "../../screens/LeaderboardScreen";

const Stack = createStackNavigator();

export default function ProfileStack({ navigation }) {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: (props) => (
            <>
              <Icon
                style={{
                  alignSelf: "center",
                  color: "gray",
                }}
                name="trophy"
                size={40}
              />
              <Icon
                style={{
                  color: "gold",
                  alignSelf: "center",
                  position: "absolute",
                  top: 8,
                }}
                name="star"
                size={13}
              />
            </>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
