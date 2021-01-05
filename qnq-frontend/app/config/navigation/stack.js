import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Drawer from "./drawer";
import SignInScreen from "../../screens/SignInScreen";
import SplashScreen from "../../screens/SplashScreen";

const Stack = createStackNavigator();

export default function QnQStack(props) {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={({ route, navigation }) => ({
        headerShown: false
      })}
    >
      {props.isLoading ? (
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
      ) : props.userToken == null ? (
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
      ) : (
        <Stack.Screen name="Drawer" component={Drawer} />
      )}
    </Stack.Navigator>
  );

  //   {/*            options={{
  //                 title: 'Sign in',
  //             // When logging out, a pop animation feels intuitive
  //                 animationTypeForReplace: state.isSignout ? 'pop' : 'push',
  //               }}
  // */}
}
