import React, { useContext, useState } from "react";

import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Alert,
  TouchableOpacity
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

import { UserContext } from "../contexts/UserContext";

export default function EditProfileScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <SafeAreaView style={styles.outer}>
      <View style={styles.imagePicker}>
        <TouchableOpacity style={styles.touchImage}>
          <Avatar.Image
            size={100}
            source={require("../assets/male_avatar.png")}
          >
            <Icon name="camera-plus" size={50} color="#000011" />
          </Avatar.Image>
        </TouchableOpacity>
      </View>
      <View style={styles.formWrapper}>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#111111" size={20} />
          <TextInput
            placeholder="Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            defaultValue={name}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color="#111111" size={20} />
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" color="#111111" size={20} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCorrect={false}
            style={styles.textInput}
            defaultValue={email}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="globe" color="#111111" size={20} />
          <TextInput
            placeholder="Country"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <Icon name="map-marker-outline" color="#111111" size={20} />
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
          <Text style={styles.panelButtonTitle}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1
  },
  imagePicker: {
    marginTop: 10,
    alignItems: "center"
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
    marginBottom: 15
  },
  formWrapper: {
    marginTop: 10,
    alignItems: "center",
    paddingHorizontal: 20
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bbbbbb",
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a"
  }
});
