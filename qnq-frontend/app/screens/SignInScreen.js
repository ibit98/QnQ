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

export default function SignInScreen() {
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
          onPress={() => signIn({ email, password })}
          title="Login"
          color="#8f1106"
        />
        {/*}<TouchableOpacity
          onPress={() => this.register()}
          style={{ marginTop: 20 }}
        >
          <Text>Sign Up</Text>
        </TouchableOpacity>*/}
      </View>
    </View>
  );
}

// class LoginScreen extends React.Component {
// submitLoginForm() {
//   const { email, pswd } = this.state;
//   if (email == "") {
//     Alert.alert("Error", "Email is mandatory");
//   } else if (pswd == "") {
//     Alert.alert("Error", "Please enter password");
//   } else if (email != "arijitbiley@gmail.com" || pswd != "abc") {
//     Alert.alert("Error", "Invalid credentials");
//   } else {
//     this.props.navigation.navigate("Drawer");
//   }
// }

// register() {
//   this.props.navigation.navigate("Signup");
// }

//   return (
//
//       <ImageBackground
//         source={require("../images/background.png")}
//         style={{ flex: 1, width: null, height: null }}
//       >
//         <Image
//           source={require("../images/logo.png")}
//           style={styles.logo}
//         ></Image>
//
//
//
//
//
//
//       </ImageBackground>
//
//   );
// }
