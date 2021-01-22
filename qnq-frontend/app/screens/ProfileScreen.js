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
  Alert
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.Outer}>
      <View
        style={{
          marginTop: 30,
          flexDirection: "row"
        }}
      >
        <View
          style={[
            styles.userInfo,
            { width: "50%", flexDirection: "column", marginLeft: 16 }
          ]}
        >
          <Avatar.Image
            size={100}
            source={require("../assets/male_avatar.png")}
          />
          <View style={{ paddingTop: 10, justifyContent: "center" }}>
            <Title style={{ fontWeight: "800", fontSize: 25 }}>User Name</Title>
            <Caption style={{ fontWeight: "400", fontSize: 17 }}>
              @USer-ID
            </Caption>
          </View>
        </View>
        <View style={{ marginTop: 37, width: "50%", flexDirection: "column" }}>
          <View style={styles.row}>
            <Icon name="map-marker-radius" size={26} color="#bbbbbb" />
            <Text style={styles.rowText}>Location, Country</Text>
          </View>
          <View style={styles.row}>
            <Icon name="phone" size={26} color="#bbbbbb" />
            <Text style={styles.rowText}>+919614593044</Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" size={26} color="#bbbbbb" />
            <Text style={styles.rowText}>sougata@gmail.com</Text>
          </View>
        </View>
      </View>
      <View style={styles.ratingInfo}>
        <View
          style={[
            styles.ratingInfobox,
            { borderRightColor: "#dddddd", borderRightWidth: 0.7 }
          ]}
        >
          <Title>120</Title>
          <Caption>Trust Factor</Caption>
        </View>
        <View
          style={[
            styles.ratingInfobox,
            { borderRightColor: "#dddddd", borderRightWidth: 0.7 }
          ]}
        >
          <Title>65</Title>
          <Caption>Reviews</Caption>
        </View>
        <View style={styles.ratingInfobox}>
          <Title>8</Title>
          <Caption>Leaderboard</Caption>
        </View>
      </View>
      <View>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="heart-outline" color="#bababa" size={25} />
            <Text style={styles.rowText}>Favourite Places</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="chart-timeline-variant" color="#bababa" size={25} />
            <Text style={styles.rowText}>Recent Reviews</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => navigation.navigate("Edit")}>
          <View style={styles.menuItem}>
            <Icon name="account-edit" color="#bababa" size={25} />
            <Text style={styles.rowText}>Edit Profile</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="share" color="#bababa" size={25} />
            <Text style={styles.rowText}>Share with Friend!</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="power-settings" color="#bababa" size={25} />
            <Text style={styles.rowText}>Settings</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Outer: {
    flex: 1
  },
  userInfo: {
    marginTop: 20,
    paddingHorizontal: 20
  },
  ratingInfo: {
    marginBottom: 10,
    marginTop: 15,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    borderTopColor: "#cccccc",
    borderTopWidth: 1,
    height: 90,
    flexDirection: "row"
  },
  ratingInfobox: {
    alignItems: "center",
    justifyContent: "center",
    width: "33%"
  },
  row: {
    flexDirection: "row",
    marginBottom: 15
  },
  rowText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30
  }
});
