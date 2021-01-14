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
import styles from "../styles/login-styles";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={styles.logo}
        source={require("../assets/adaptive-icon.png")}
      />

      <View style={styles.inputView}>
        {/*<Image
          source={require("../icons/mobile.png")}
          style={styles.placeholderImage}
        ></Image>*/}
        <TextInput
          style={styles.textInput}
          placeholder="Email Id"
          placeholderTextColor="grey"
          onChangeText={setEmail}
        ></TextInput>
      </View>

      <View style={styles.inputView}>
        {/*<Image
          source={require("../icons/mobile.png")}
          style={styles.placeholderImage}
        ></Image>*/}
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="grey"
          secureTextEntry={true}
          onChangeText={setPassword}
        ></TextInput>
      </View>

      <View style={styles.buttonView}>
        <Button
          style={styles.loginButton}
          onPress={() => signIn({ email: email, password: password })}
          title="Sign In"
          color="#8f1106"
        />
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("SignUpScreen")}
        >
          <Text style={styles.registerText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
