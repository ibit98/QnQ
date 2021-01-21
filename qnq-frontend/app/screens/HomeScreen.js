import React, { useEffect, useState } from "react";

import Constants from "expo-constants";
import * as Location from "expo-location";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import {
  Button,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import MapView from "react-native-maps";
import Icon from "react-native-vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(
    false
  );
  // For loading the mylocation button from the get go,
  // together with onMapReady function.
  const [mapHeight, setMapHeight] = useState("99%");

  const handlePoiClick = ({
    nativeEvent: { coordinate, position, placeId, name }
  }) => {
    navigation.navigate("Location", {
      place: { coordinate, id: placeId, name }
    });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg('Permission to access location was denied');
        return;
      }
      setLocationPermissionGranted(true);

      Location.getCurrentPositionAsync({}).then(
        ({ coords: { latitude, longitude } }) => {
          setRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          });
        }
      );
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {locationPermissionGranted ? (
        <MapView
          loadingEnabled={true}
          onPoiClick={handlePoiClick}
          onMapReady={() => setMapHeight("100%")}
          region={region}
          showsCompass={false}
          showsMyLocationButton={true}
          showsUserLocation={true}
          style={{
            height: mapHeight,
            width: "100%"
          }}
        />
      ) : (
        <>
          <Text style={styles.centeredText}>
            Please wait while we fetch permission to access your location.
          </Text>
          <Text style={styles.centeredText}>
            If you have not granted location permissions, then this page will
            not work.
          </Text>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // TODO (saha): remove this margin to have map underlay the status bar
    // But, the problem with this is that the mylocation button seems
    // to be unmovable and gets covered in this way. Find a way to fix
    // this issue
    marginTop: Constants.statusBarHeight || 0
  },
  centeredText: {
    textAlign: "center"
  }
});
