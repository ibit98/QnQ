import React, { useEffect } from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import Constants from "expo-constants";
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";

// TODO: DATA, Item, renderItem, styles are placeholders for now till map integration is done
const DATA = [
  {
    id: "loc1",
    title: "Haldirams"
  },
  {
    id: "loc2",
    title: "Bhojohori Manna"
  },
  {
    id: "loc3",
    title: "6, Ballygunge Place"
  }
];
function Item({ title }) {
  const navigation = useNavigation();

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Button
        title={`Go to Some page`}
        onPress={() => navigation.navigate("Location")}
      />
    </View>
  );
}
const renderItem = ({ item }) => <Item title={item.title} />;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight || 0
  },
  item: {
    backgroundColor: "gray",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  },
  locationList: {
    marginTop: 50
  }
});

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.locationList}
      />
    </SafeAreaView>
  );
}
