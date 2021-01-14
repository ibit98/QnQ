import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "15%"
  },
  logo: {
    height: 120,
    width: 120,
    padding: 20
  },
  inputView: {
    borderRadius: 5,
    backgroundColor: "white",
    width: "70%",
    height: 45,
    marginBottom: 20,
    flexDirection: "row"
  },
  dividedInputView: {
    backgroundColor: null
  },
  inputNameView: {
    backgroundColor: "white",
    borderRadius: 5,
    flex: 1,
    borderWidth: 2
  },
  textInput: {
    height: 50,
    flex: 1,
    fontSize: 17,
    padding: 10
  }
});

export default styles;
