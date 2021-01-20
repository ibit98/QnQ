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
  View,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";

import { AuthContext } from "../../contexts/AuthContext";
import HomeScreen from "../../screens/HomeScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import EditProfileScreen from "../../screens/EditProfileScreen";
import styles from "../../styles/navigation-styles";

const CustomDrawer = (props) => {
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
          borderBottomWidth: 0.2,
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
        signOutHandler: signOut,
      }}
      drawerPosition="left"
      drawerStyle={styles.drawer}
      drawerType="front"
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Edit" component={EditProfileScreen} />
    </Drawer.Navigator>
  );
}
