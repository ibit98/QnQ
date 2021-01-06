import React, { useEffect, useMemo, useReducer } from "react";

import { Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";

import Stack from "./app/config/navigation/stack";
import { AuthContext } from "./app/contexts/AuthContext";
import { API_URL, USER_TOKEN } from "./app/constants";

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null
};

function reducer(prevState, action) {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignout: true,
        userToken: null
      };
    default:
      throw new Error();
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem(USER_TOKEN);
      } catch (e) {
        // TODO: Restoring token failed
      }

      fetch(API_URL + "users/me", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken
        }
      })
        .then(jsonResponse => jsonResponse.json())
        .then(response => {
          if (response.error) {
            // jwt has expired or corrupt token
            AsyncStorage.removeItem(USER_TOKEN).then(() => {
              dispatch({ type: "RESTORE_TOKEN", token: null });
            });
            return;
          }

          // Persist refreshed token in AsyncStorage and then dispatch SIGN_IN action
          AsyncStorage.setItem(USER_TOKEN, response.user.token).then(() => {
            dispatch({ type: "RESTORE_TOKEN", token: response.user.token });
          });
        })
        .catch(error => {
          console.error(error);
        });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        if (data.email.length < 1) {
          // TODO: show alert in input boxes itself or login form addition
          Alert.alert("Enter email!");
          return;
        }
        if (data.password.length < 1) {
          // TODO: show alert in input boxes itself or login form addition
          Alert.alert("Enter password!");
          return;
        }

        fetch(API_URL + "users/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user: {
              email: data.email,
              password: data.password
            }
          })
        })
          .then(jsonResponse => jsonResponse.json())
          .then(response => {
            if (response.errors) {
              console.info(response.errors);
              for (let key in response.errors) {
                // TODO: show alert in input boxes itself or login form addition
                Alert.alert(key + " " + response.errors[key]);
              }
              return;
            }

            // Persist token in AsyncStorage and then dispatch SIGN_IN action
            AsyncStorage.setItem(USER_TOKEN, response.user.token).then(() => {
              dispatch({ type: "SIGN_IN", token: response.user.token });
            });
          })
          .catch(error => {
            console.error(error);
          });
      },
      signOut: () => {
        // Remove token in AsyncStorage and then dispatch SIGN_OUT action
        AsyncStorage.removeItem(USER_TOKEN).then(() => {
          dispatch({ type: "SIGN_OUT" });
        });
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      }
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack
          isLoading={state.isLoading}
          isSignout={state.isSignout}
          userToken={state.userToken}
        />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
