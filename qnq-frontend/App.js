import React, { useEffect, useMemo, useReducer } from "react";

import { Alert } from "react-native";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";

import Stack from "./app/config/navigation/authStack";
import { AuthContext } from "./app/contexts/AuthContext";
import { UserContext } from "./app/contexts/UserContext";
import { API_URL, USER_TOKEN } from "./app/constants";

const initialState = {
  isLoading: true,
  isSignout: false,
  user: null,
  userToken: null,
};

function reducer(prevState, action) {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        isLoading: false,
        user: action.data.user,
        userToken: action.data.token,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignout: false,
        user: action.data.user,
        userToken: action.data.token,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignout: true,
        user: null,
        userToken: null,
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
      console.log("Bootstrap me!");
      let userToken;

      try {
        userToken = await AsyncStorage.getItem(USER_TOKEN);
      } catch (e) {
        // The token is not stored in Async storage, this is
        // a first time login for this user, so we restore the
        // token with null
        dispatch({ type: "RESTORE_TOKEN", data: { token: null, user: null } });
        return;
      }

      fetch(API_URL + "users/me", {
        method: "GET",
        headers: userToken
          ? {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken,
            }
          : {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
      })
        .then((jsonResponse) => jsonResponse.json())
        .then((response) => {
          if (response.error) {
            // jwt has expired or corrupt token
            AsyncStorage.removeItem(USER_TOKEN).then(() => {
              dispatch({
                type: "RESTORE_TOKEN",
                data: { token: null, user: null },
              });
            });
            return;
          }

          // Persist refreshed token in AsyncStorage and then dispatch SIGN_IN action
          AsyncStorage.setItem(USER_TOKEN, response.user.token).then(() => {
            dispatch({
              type: "RESTORE_TOKEN",
              data: { token: response.user.token, user: response.user },
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };

    bootstrapAsync();
  }, []);

  const authContextValue = useMemo(
    () => ({
      signIn: async (data) => {
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              email: data.email,
              password: data.password,
            },
          }),
        })
          .then((jsonResponse) => jsonResponse.json())
          .then((response) => {
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
              dispatch({
                type: "SIGN_IN",
                data: { token: response.user.token, user: response.user },
              });
            });
          })
          .catch((error) => {
            console.error(error);
          });
      },
      signOut: () => {
        // Remove token in AsyncStorage and then dispatch SIGN_OUT action
        AsyncStorage.removeItem(USER_TOKEN).then(() => {
          dispatch({ type: "SIGN_OUT" });
        });
      },
      signUp: async (data) => {
        fetch(API_URL + "users", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              name: data.name,
              email: data.email,
              password: data.password,
            },
          }),
        })
          .then((jsonResponse) => jsonResponse.json())
          .then((response) => {
            if (response.error) {
              //TODO: change this alert to reflect in UI
              Alert.alert(response.error);
              return false;
            }

            // Persist token in AsyncStorage and then dispatch SIGN_IN action
            AsyncStorage.setItem(USER_TOKEN, response.user.token).then(() => {
              dispatch({
                type: "SIGN_IN",
                data: { token: response.user.token, user: response.user },
              });
              return true;
            });
          })
          .catch((error) => {
            console.error(error);
          });
        return false;
      },
    }),
    []
  );
  const userContextValue = {
    user: state.user,
  };

  if (state.isLoading) {
    return <AppLoading />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <UserContext.Provider value={userContextValue}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack isSignout={state.isSignout} userToken={state.userToken} />
        </NavigationContainer>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}
