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

import { UserContext } from "../contexts/UserContext";
import RankListItem from "../components/RankListItem";

const initialState = {
  users: [],
  isLoading: false,
  hasMore: true,
  myRank: "-",
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
    case "UPDATE_MY_RANK":
      return { ...prevState, myRank: action.data.rank };
    default:
      throw new Error();
  }
}

export default function LeaderboardScreen() {
  const [{ users, isLoading, hasMore, myRank }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { user: currentUser } = useContext(UserContext);

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

  const loadMyRank = async () => {
    try {
      const jsonResponse = await fetch(API_URL + `leaderboard/my`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      if (jsonResponse.status >= 400) {
        console.error("Error wile fetching rank. Response was:");
        console.log(jsonResponse);
        return;
      }

      const rank = await jsonResponse.json();

      console.log(rank);

      dispatch({ type: "UPDATE_MY_RANK", data: { rank } });
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
    loadMyRank();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style={isOpen ? "light" : "dark"} translucent={true} />
      <View style={styles.usersContainer}>
        <View style={styles.myRankView}>
          <Text style={styles.myRankLabel}>My Rank: </Text>
          <Text style={styles.myRank}>{myRank}</Text>
        </View>
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
  myRankView: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  myRankLabel: { paddingHorizontal: 3, fontSize: 20 },
  myRank: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
