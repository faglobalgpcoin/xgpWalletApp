import React from "react";
import * as RN from "react-native";
import { inject, observer } from "mobx-react";
import { Icon } from "react-native-elements";
import Toast from "react-native-simple-toast";
import I18n from "i18n-js";

import openBrowser from "../common/function/LinkUtil";
import { XGP_OFFICE, XGP_MARKET } from "../api/Constants";
import { autorun } from "mobx";

import DefaultColors from "../common/style/DefaultColors";

const wallet = require("./images/wallet.png");
const market = require("./images/market.png");
const office = require("./images/office.png");
const posmarket = require("./images/posmarket.png");
const homeImage = require("./images/homeImage.png");
const logo = require("./images/logo.png");
const coinlogo = require("./images/bee.png");

const HomePage = ({ tokenStore, memberStore, navigation }) => {
	const handleShowReadyMessage = () => {
		Toast.show(I18n.t("gp.coming_soon"));
	};

	const goAssetListPage = async () => {
		tokenStore.tokenList.map((token) => {
			tokenStore.updateBalance(memberStore.accessToken, token);
		});
		await navigation.navigate("AssetListPage");
	};

	const goLinkExternal = (url) => {
		openBrowser(url);
	};

	return (
		<RN.View style={styles.root}>
			<RN.View style={styles.bottomContainer}>
				<RN.Image source={logo} style={{ width: (180 * 3159) / 2296, height: 115 }} />
			</RN.View>
			<RN.View style={styles.topContainer}>
				<RN.View style={styles.rowContainer}>
					<RN.TouchableOpacity style={styles.buttonContainer} activeOpacity={0.9} onPress={() => goAssetListPage()}>
						<RN.Image source={wallet} style={{ width: 45, height: 45 }} />
						<RN.View style={styles.textContainer}>
							<RN.Text style={styles.textStyle}>
								{/* {I18n.t("home.dmwDapp")} */}
								GP Wallet
							</RN.Text>
						</RN.View>
					</RN.TouchableOpacity>
					{/* market */}
					<RN.TouchableOpacity style={styles.buttonContainer} activeOpacity={0.9} onPress={() => goLinkExternal(XGP_OFFICE() + memberStore.accessToken)}>
						<RN.Image source={office} style={{ width: 45, height: 45 }} />
						<RN.View style={styles.textContainer}>
							<RN.Text style={styles.textStyle}>
								{/* {I18n.t("home.dmwDapp")} */}
								Office
							</RN.Text>
						</RN.View>
					</RN.TouchableOpacity>
					{/* market end*/}
					{/* market */}
					<RN.TouchableOpacity style={styles.buttonContainer} activeOpacity={0.9} onPress={() => goLinkExternal(XGP_MARKET() + memberStore.accessToken)}>
						<RN.Image source={market} style={{ width: 45, height: 45 }} />
						<RN.View style={styles.textContainer}>
							<RN.Text style={styles.textStyle}>
								{/* {I18n.t("home.dmwDapp")} */}
								Market
							</RN.Text>
						</RN.View>
					</RN.TouchableOpacity>
					{/* market end*/}
				</RN.View>
			</RN.View>
			<RN.Image source={coinlogo} style={{ width: 200, height: 200, marginTop: 35 }} />
			<RN.View style={styles.rowContainer}>
				<RN.TouchableOpacity style={styles.buttonItems} activeOpacity={0.9} onPress={() => goLinkExternal("http://xgppos.com/storeposition/")}>
					<RN.Image source={posmarket} style={{ width: 35, height: 30 }} />
					<RN.View style={styles.textContainer}>
						<RN.Text style={styles.textRevStyle}>
							{/* {I18n.t("home.dmwDapp")} */}
							POS Market
						</RN.Text>
					</RN.View>
				</RN.TouchableOpacity>
			</RN.View>
		</RN.View>
	);
};

export default inject("tokenStore", "memberStore")(observer(HomePage));

const styles = RN.StyleSheet.create({
	root: {
		// flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	// backgroundImage: {
	//   width: '100%',
	//   height: '100%',
	//   position: 'absolute',
	//   top: 0,
	//   left: 0,
	// },
	topContainer: {
		// flex: 2,
		marginTop: RN.Platform.OS === "android" ? 30 : 30,
		alignItems: "center",
		justifyContent: "center",
	},
	rowContainer: {
		// flex: 1,
		flexDirection: "row",
	},
	buttonContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#efefef",
		borderRightWidth: 0,
		padding: 12,
	},
	buttonItems: {
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginTop: 30,
		backgroundColor: [DefaultColors.mainColor],
		borderRadius: 10,
	},
	textContainer: {
		// width: 120,
		// width: 35,
		// height: 35,
		width: 100,
		height: 35,
		// top: -10,
		borderRadius: 5,
		// backgroundColor: "#788bdd",
		// alignItems: "center",
		// justifyContent: "center",
		// zIndex: -1,
	},
	textStyle: {
		// color: "white",
		color: "#3A3A45",
		fontSize: 14,
		// fontWeight: "bold",
		marginTop: 13,
		textAlign: "center",
		width: 100,
	},
	textRevStyle: {
		color: "#fefefe",
		fontSize: 14,
		marginLeft: 13,
		fontWeight: "bold",
		textAlign: "center",
		// width: 100,
		height: 30,
		lineHeight: 34,
	},
	bottomContainer: {
		// flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 100,
	},
});
