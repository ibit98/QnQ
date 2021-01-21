import React, { useContext, useEffect } from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
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

import HomeStack from "./homeStack";
import { AuthContext } from "../../contexts/AuthContext";
import { UserContext } from "../../contexts/UserContext";
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
            <Text style={styles.drawerProfileName}>
              {props.user ? props.user.name : ""}
            </Text>
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

export default function QnQDrawer({ navigation }) {
  const { signOut } = useContext(AuthContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener("drawerOpen", (e) => {
      setStatusBarStyle("light");
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("drawerClose", (e) => {
      setStatusBarStyle("dark");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawer}
      drawerContentOptions={{
        activeTintColor: "#eb233a",
        inactiveTintColor: "#eb233a",
        signOutHandler: signOut,
        user: user,
      }}
      drawerPosition="left"
      drawerStyle={styles.drawer}
      drawerType="front"
      headerMode="screen"
      initialRouteName="HomeStack"
    >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Edit" component={EditProfileScreen} />
    </Drawer.Navigator>
  );
}
