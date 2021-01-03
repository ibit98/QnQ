import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
  drawermenuimage: {
    height: 100,
    width: 100,
    marginLeft: 10,
    borderRadius: 50,
  },
  drawerProfileView: {
    paddingTop: 10,
    height: 110,
    flexDirection: "row",
    borderBottomWidth: 1,
    backgroundColor: "green",
  },
  drawer: {
    backgroundColor: "black",
  },
  drawername: {
    fontWeight: "bold",
    paddingLeft: 10,
  },
  drawermobno: {
    fontWeight: "bold",
    paddingLeft: 10,
  },
  drawermenutext: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
