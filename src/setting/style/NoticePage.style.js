import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  noticeContainer: {
    flex: 1,
    width: "100%",
    height: 60,
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  indicatorText: {
    zIndex: -1,
    top: 0,
    height: 80,
    width: 80,
    paddingTop: 80,
    fontSize: 14,
    fontWeight: "400",
    borderRadius: 4,
    backgroundColor: "rgba(187,187,187,0.2)",
    color: "#474747",
  },
  titleContainer: {
    flexDirection: "column",
    paddingRight: 10,
    flex: 1,
  },
  titleText: {
    color: "#3A3A45",
    fontSize: 16,
    fontWeight: "500",
  },
  dateText: {
    marginTop: 5,
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },

  div: {
    fontSize: 14,
  },
  h1: {
    fontSize: 18,
  },
  h2: {
    fontSize: 16,
  },
  h3: {
    fontSize: 14,
  },
  b: {
    fontWeight: "500",
  },
  /* html view style */
  /*
  div: {
    fontSize: 12
  },
  p: {
    fontSize: 12
  },
  a: {
    fontSize: 12
  },
  */
});
