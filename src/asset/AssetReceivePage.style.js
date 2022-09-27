import { StyleSheet, Dimensions, Platform } from "react-native";
import DefaultColors from "../common/style/DefaultColors";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  indicatorText: {
    zIndex: -1,
    top: 0,
    height: 80,
    width: 80,
    paddingTop: 80,
    fontSize: 14,
    fontWeight: "400",
    borderRadius: 4,
    backgroundColor: DefaultColors.indicatorBackground,
    color: "#474747",
    overflow: "hidden",
  },
  addressButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  address: {
    width: "90%",
    paddingLeft: 10,
    paddingRight: 7,
    fontSize: 15,
    color: "#ff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  descContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  desc: {
    alignSelf: "center",
    color: "#474747",
    fontSize: 15,
  },
  QRCodeContainer: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonContainer: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopWidth: 0.8,
    borderColor: "#bbb",
    bottom: 0,
  },
  dialogInput: {
    borderBottomWidth: 1,
    borderColor: "#bbb",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: Platform.OS === "ios" ? 13 : 10,
  },
  notEditable: {
    backgroundColor: "#efefef",
  },
});
