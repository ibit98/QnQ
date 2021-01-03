import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: "black",
  },
  drawerProfileImage: {
    borderRadius: 50,
    height: 60,
    marginLeft: 18,
    marginTop: 30,
    width: 60,
  },
  drawerProfileText: {
    marginLeft: 8,
    justifyContent: "center",
  },
  drawerProfileView: {
    backgroundColor: "black",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 120,
  },
  drawerProfileName: {
    color: "white",
    fontSize: 20,
    height: 35,
    paddingLeft: 8,
  },
  drawermobno: {
    color: "gray",
    paddingLeft: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default styles;
