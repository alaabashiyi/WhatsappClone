import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: windowWidth,
    justifyContent: "space-between",
    padding: 10,
  },
  leftContainer: {
    flexDirection: "row",
  },

  midContainer: {
    justifyContent: "space-around",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    color: "grey",
  },
});

export default styles;
