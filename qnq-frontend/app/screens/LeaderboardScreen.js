import React, { useContext, useEffect, useReducer } from "react";

import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  //   Button,
  //   Image,
  //   ImageBackground,
  FlatList,
  StyleSheet,
  Text,
  //   TextInput,
  //   TouchableOpacity,
  View,
} from "react-native";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "../constants";

// import { AuthContext } from "../contexts/AuthContext";
import RankListItem from "../components/RankListItem";

const initialState = {
  users: [],
  isLoading: false,
  hasMore: true,
};

function reducer(prevState, action) {
  switch (action.type) {
    case "LOAD_MORE":
      return {
        ...prevState,
        isLoading: false,
        users: [...prevState.users, ...action.data.additionalUsers],
        hasMore: action.data.additionalUsers.length !== 0,
      };
    case "WAIT_TO_LOAD":
      return {
        ...prevState,
        isLoading: true,
      };
    case "CLEAR_LIST":
      return { ...prevState, users: [], hasMore: true };
    default:
      throw new Error();
  }
}

export default function LeaderboardScreen() {
  const [{ users, isLoading, hasMore }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const isOpen = useIsDrawerOpen();

  const appendUsers = (additionalUsers) => {
    dispatch({
      type: "LOAD_MORE",
      data: { additionalUsers: additionalUsers },
    });
  };

  const loadUsers = async (offset = null) => {
    dispatch({
      type: "WAIT_TO_LOAD",
    });

    if (offset === null) offset = users.length;

    try {
      const jsonResponse = await fetch(
        API_URL + `leaderboard?offset=${offset}&limit=50`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const response = await jsonResponse.json();

      if (response.error) {
        console.log(response.error);
        return;
      }

      appendUsers(response);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = () => {
    dispatch({ type: "CLEAR_LIST" });
    // Here, offset is required as function is called while state has not
    // changed, so offset calculated would be stale unless passed explicitly.
    loadUsers(0);
  };

  const renderUser = ({ item, index }) => (
    <RankListItem user={item} rank={index + 1} />
  );

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style={isOpen ? "light" : "dark"} translucent={true} />
      <View style={styles.usersContainer}>
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(user) => user._id}
          onEndReached={() => {
            if (hasMore) {
              loadUsers();
            }
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => (
            <Text style={{ color: "black", fontFamily: "sans-serif-thin" }}>
              {users.length} user{users.length > 1 ? "s" : ""}
            </Text>
          )}
          ListFooterComponentStyle={{
            display: "flex",
            alignItems: "center",
          }}
          refreshing={isLoading}
          onRefresh={handleRefresh}
        />
        {isLoading && <ActivityIndicator size="large" color="blue" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightgray",
    flex: 1,
    paddingTop: 30,
  },
  usersContainer: {
    flex: 1,
    paddingTop: 60,
  },
  noUsersBanner: {
    textAlign: "center",
    color: "gray",
  },
  // horizontalSeparator: {
  //   borderBottomColor: "gray",
  //   borderWidth: 1,
  //   margin: 4,
  // },
});
