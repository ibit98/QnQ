import React from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  Button,
  PanResponder,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

export default function EditProfileScreen({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("drawerOpen", (e) => {
      setStatusBarStyle("light");
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("drawerClose", (e) => {
      setStatusBarStyle("dark");
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.topPanel}>
        <Icon.Button
          name="arrow-left"
          size={27}
          color="#000111"
          backgroundColor="#bbbbbb"
          onPress={() => navigation.navigate("Profile")}
          style={{ marginTop: 30 }}
        />
        <Text
          style={{
            marginLeft: "21%",
            marginTop: 35,
            color: "#ffffff",
            fontSize: 27,
          }}
        >
          Edit Profile
        </Text>
      </View>
      <View style={styles.imagePicker}>
        <TouchableOpacity style={styles.touchImage}>
          <Avatar.Image
            size={120}
            source={require("../assets/male_avatar.png")}
          >
            <Icon name="camera-plus" size={200} color="#000011" />
          </Avatar.Image>
        </TouchableOpacity>
        <Title>User Name</Title>
      </View>
      <View style={styles.formWrapper}>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="111111" size={20} />
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="111111" size={20} />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color="111111" size={20} />
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" color="111111" size={20} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="globe" color="111111" size={20} />
          <TextInput
            placeholder="Country"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <Icon name="map-marker-outline" color="111111" size={20} />
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Outer: {
    flex: 1,
  },
  topPanel: {
    height: 80,
    flexDirection: "row",
    backgroundColor: "#bbbbbb",
    marginBottom: 25,
  },
  imagePicker: {
    height: 160,
    alignItems: "center",
    marginBottom: 20,
  },
  touchImage: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 50,
    marginBottom: 15,
  },
  formWrapper: {
    marginTop: 10,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bbbbbb",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
});
