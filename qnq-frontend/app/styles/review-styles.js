import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  reviewContainer: {
    backgroundColor: "white",
    padding: 10,
    flex: 1
  },
  reviewerImage: {
    borderRadius: 50,
    height: 50,
    width: 50
  },
  reviewerText: {
    marginLeft: 8,
    justifyContent: "center"
  },
  reviewerView: {
    flexDirection: "row",
    paddingBottom: 6
  },
  reviewerName: {
    color: "black",
    fontSize: 20
  },
  reviewerRating: {
    color: "gray",
    fontSize: 20
  },

  reviewText: {
    fontSize: 25
  }
});

export default styles;
