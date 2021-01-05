import React, { useContext } from "react";

import { StatusBar } from "expo-status-bar";
import {
  Alert,
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
  DrawerView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator
} from "@react-navigation/drawer";

import { AuthContext } from "../../contexts/AuthContext";
import HomeScreen from "../../screens/HomeScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import styles from "../../styles/navigation-styles";

const CustomDrawer = props => {
  return (
    <React.Fragment>
      <DrawerContentScrollView {...props}>
        <SafeAreaView style={styles.drawerProfileView}>
          <Image
            source={require("../../assets/avatar-placeholder.jpg")}
            style={styles.drawerProfileImage}
          ></Image>
          <View style={styles.drawerProfileText}>
            <Text style={styles.drawerProfileName}>User Name</Text>
            <Text style={styles.drawerProfileRating}>rating</Text>
          </View>
        </SafeAreaView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={{
          borderBottomColor: "gray",
          borderBottomWidth: 0.2
        }}
      />
      <DrawerItem
        label="Sign Out"
        inactiveTintColor="gray"
        onPress={props.signOutHandler}
      />
    </React.Fragment>
  );
};

const Drawer = createDrawerNavigator();

export default function QnQDrawer() {
  const { signOut } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawer}
      drawerContentOptions={{
        activeTintColor: "#eb233a",
        inactiveTintColor: "#eb233a",
        signOutHandler: signOut
      }}
      drawerPosition="left"
      drawerStyle={styles.drawer}
      drawerType="front"
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
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
