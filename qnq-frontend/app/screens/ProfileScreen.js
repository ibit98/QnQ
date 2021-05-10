import React, { useContext, useEffect, useState } from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  Button,
  PanResponder,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { UserContext } from "../contexts/UserContext";
import { API_URL, USER_TOKEN } from "../constants";

export default function ProfileScreen({ navigation }) {
  const [reviewCount, setReviewCount] = useState("-");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getReviewCount = async () => {
      fetch(API_URL + "reviews/me/count/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((jsonResponse) => jsonResponse.json())
        .then((response) => {
          if (response.error) {
            return;
          }

          setReviewCount(response);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getReviewCount();
  }, []);

  return (
    <SafeAreaView style={styles.Outer}>
      <View style={styles.userInfoView}>
        <View style={styles.userIdentityView}>
          <Avatar.Image
            size={90}
            source={require("../assets/male_avatar.png")}
            style={styles.userImage}
          />
          <View style={styles.userNameView}>
            <Title>{user.name}</Title>
          </View>
        </View>
        <View style={styles.userContactView}>
          {/*<View style={styles.row}>
            <Icon name="map-marker-radius" size={26} color="#bbbbbb" />
            <Text style={styles.rowText}>Location, Country</Text>
          </View>*/}
          <View style={styles.row}>
            <Icon name="phone" size={26} color="#bbbbbb" />
            <Text style={styles.rowText}>+918549707785</Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" size={26} color="#bbbbbb" />
            <Text style={styles.rowText}>{user.email}</Text>
          </View>
        </View>
      </View>
      <View style={styles.userMetaDataView}>
        <View style={styles.userMetaDataBox}>
          <Title>#</Title>
          <Caption>Trust Factor</Caption>
        </View>
        <View style={styles.userMetaDataBox}>
          <Title>{reviewCount}</Title>
          <Caption>Reviews</Caption>
        </View>
        <View style={[styles.userMetaDataBox, styles.userMetaDataBoxLast]}>
          <Title>#</Title>
          <Caption>Leaderboard</Caption>
        </View>
      </View>
      <View style={styles.optionsView}>
        {/*<TouchableRipple>
          <View style={styles.menuItem}>
            <Icon name="heart-outline" color="#bababa" size={25} />
            <Text style={styles.rowText}>Favourite Places</Text>
          </View>
        </TouchableRipple>*/}
        <TouchableRipple
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        >
          <View style={styles.menuItem}>
            <Icon name="account-edit" color="#bababa" size={25} />
            <Text style={styles.rowText}>Edit Profile</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="chart-timeline-variant" color="#bababa" size={25} />
            <Text style={styles.rowText}>My Reviews</Text>
          </View>
        </TouchableRipple>
        {/*<TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="share" color="#bababa" size={25} />
            <Text style={styles.rowText}>Share with Friend!</Text>
          </View>
        </TouchableRipple>*/}
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
    flex: 1,
  },
  userInfoView: {
    marginTop: 40,
    flexDirection: "row",
  },
  userIdentityView: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: "40%",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 16,
  },
  userImage: {},
  userNameView: {
    paddingTop: 10,
    justifyContent: "center",
  },
  userContactView: {
    marginTop: 37,
    width: "60%",
    flexDirection: "column",
  },
  userMetaDataView: {
    marginBottom: 10,
    marginTop: 15,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    borderTopColor: "#cccccc",
    borderTopWidth: 1,
    height: 90,
    flexDirection: "row",
  },
  userMetaDataBox: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRightColor: "#dddddd",
    borderRightWidth: 0.7,
  },
  userMetaDataBoxLast: {
    borderRightWidth: 0,
  },
  optionsView: {},
  row: {
    flexDirection: "row",
    marginBottom: 15,
  },
  rowText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
});
