import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Drawer from "./drawer";
// import ModalHelp from '../screens/ModalHelp';
// import ModalQRCode from '../screens/ModalQRCode';
// import ModalTutorialBike from '../screens/ModalTutorialBike';

const Stack = createStackNavigator();

class QnQStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Drawer"
        mode="modal"
        screenOptions={({ route, navigation }) => ({
          headerShown: false
        })}
      >
        <Stack.Screen name="Drawer" component={Drawer} />
      </Stack.Navigator>
    );
  }
}

export default QnQStack;
