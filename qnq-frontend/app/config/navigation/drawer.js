import React from "react";

import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator
} from "@react-navigation/drawer";

// import AboutScreen from '../content/AboutScreen';
import HomeScreen from "../../screens/HomeScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import styles from "../../styles/navigation-styles";

const CustomDrawer = props => (
  <DrawerContentScrollView {...props} style={styles.drawer}>
    <SafeAreaView style={styles.drawerProfileView}>
      <Image
        source={require("../../assets/avatar-placeholder.jpg")}
        style={styles.drawerProfileImage}
      ></Image>
      <View style={styles.drawerProfileText}>
        <Text style={styles.drawerProfileName}>User Name</Text>
        <Text style={styles.drawermobno}>rating</Text>
      </View>
    </SafeAreaView>
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

const Drawer = createDrawerNavigator();

class QnQDrawer extends React.Component {
  render() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerPosition="left"
        drawerType="front"
        drawerContent={CustomDrawer}
        drawerContentOptions={{
          activeTintColor: "#eb233a",
          inactiveTintColor: "#eb233a"
        }}
        drawerStyle={{ width: 300 }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    );
  }
}

// const MyDrawerNavigator = createDrawerNavigator({
//   Home: {
//     screen: MyHomeScreen,
//     navigationOptions: {
//       drawerLabel: 'Home',
//       drawerIcon: ({ tintColor }) => (
//         <Image
//           source={require('../icons/home.png')}
//           style={[styles.icon, {tintColor: tintColor}]}
//         />
//       ),
//     }
//   },
//   MyTrips: {
//     screen: MyTripsScreen,
//     navigationOptions: {
//       drawerLabel: 'Trips',
//       drawerIcon: ({ tintColor }) => (
//         <Image
//           source={require('../icons/trips.png')}
//           style={[styles.icon, {tintColor: tintColor}]}
//         />
//       ),
//     }
//   },
//   About: {
//     screen: AboutScreen,
//     navigationOptions: {
//       drawerLabel: 'About Us',
//       drawerIcon: ({ tintColor }) => (
//         <Image
//           source={require('../icons/about.png')}
//           style={[styles.icon, {tintColor: tintColor}]}
//         />
//       ),
//     }
//   },
//   Logout: {
//     screen: MyHomeScreen,
//     navigationOptions: {
//       drawerIcon: ({ tintColor }) => (
//         <Image
//           source={require('../icons/logout.png')}
//           style={[styles.icon, {tintColor: tintColor}]}
//         />
//       ),
//     }
//   },
// },
// {
//   contentOptions: {
//     activeBackgroundColor :'white'
//   },
// }
// );

export default QnQDrawer;
