import React, { useState, useContext } from "react";

import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/signup-styles";

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const { signUp } = useContext(AuthContext);

  function submitSignUpForm() {
    if (isSigningUp) {
      return;
    }

    if (firstName.length < 1) {
      // TODO: show alert in input boxes itself or login form addition
      Alert.alert("Enter first name!");
      return;
    }
    if (email.length < 1) {
      // TODO: show alert in input boxes itself or login form addition
      Alert.alert("Enter Email!");
      return;
    }
    if (password.length < 6) {
      // TODO: show alert in input boxes itself or login form addition
      Alert.alert("Password too short! 6 characters minimum");
      return;
    }

    setIsSigningUp(true);
    signUp({
      name: firstName.trim() + " " + lastName.trim(),
      email: email,
      password: password
    }).then(hasSignedUp => {
      setIsSigningUp(false);
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={styles.logo}
        source={require("../assets/adaptive-icon.png")}
      />

      <View style={[styles.inputView, styles.dividedInputView]}>
        {/*<Image
          source={require("../icons/mobile.png")}
          style={styles.placeholderImage}
        ></Image>*/}
        <View style={styles.inputNameView}>
          <TextInput
            autoCompleteType="off"
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor="grey"
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputNameView}>
          <TextInput
            autoCompleteType="off"
            onChangeText={setLastName}
            placeholder="Last Name"
            placeholderTextColor="grey"
            style={styles.textInput}
          />
        </View>
      </View>

      <View style={styles.inputView}>
        {/*<Image
          source={require("../icons/mobile.png")}
          style={styles.placeholderImage}
        ></Image>*/}
        <TextInput
          autoCompleteType="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email Id"
          placeholderTextColor="grey"
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputView}>
        {/*<Image
          source={require("../icons/mobile.png")}
          style={styles.placeholderImage}
        ></Image>*/}
        <TextInput
          autoCompleteType="off"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="grey"
          secureTextEntry={true}
          style={styles.textInput}
        />
      </View>

      <View style={styles.buttonView}>
        <Button
          color="#8f1106"
          disabled={isSigningUp ? true : false}
          onPress={() => submitSignUpForm()}
          style={styles.loginButton}
          title="Sign Up"
        />
      </View>
    </View>
  );
}
