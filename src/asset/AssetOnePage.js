import React, { useEffect, useState } from "react";
import { Alert, Clipboard, Dimensions, Image, Share, TouchableOpacity, View, ScrollView } from "react-native";
import BigNumber from "bignumber.js";
import LinearGradient from "react-native-linear-gradient";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import I18n from "i18n-js";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/AntDesign";
import SIcon from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { withNavigationFocus } from "react-navigation";

import TransactionModalComponent from "./component/TransactionModalComponent";
import { hideAddress } from "../common/function/StringUtil";
import { NumberWithCommas } from "../common/function/NumberUtil";
import TransactionListComponent from "./component/TransactionListComponent";
import DefaultColors from "../common/style/DefaultColors";
import APP_PROPERTIES from "../config/appProperties";

const { width } = Dimensions.get("window");

const AssetOnePage = ({ tokenStore, assetStore, memberStore, navigation }) => {
	const bnBalance = new BigNumber(tokenStore.token.balance);
	const assetUSD = bnBalance.multipliedBy(tokenStore.token.tokenPriceByCurrency);
	const [nowBalance, setNowBalance] = useState(tokenStore.token.balance);

	useEffect(() => {
		async function fetchData() {
			await tokenStore.updateBalance(memberStore.accessToken, tokenStore.token);
			await setNowBalance(tokenStore.token.balance);
		}
		fetchData();
	}, []);

	const addressToClipboard = () => {
		Clipboard.setString(tokenStore.token.type === "luniverse" ? memberStore.address : tokenStore.token.type === "ethereum" ? memberStore.ethAddress : memberStore.btcAddress);
		Toast.show(
			I18n.t("gp.address_copy_complete", {
				name: I18n.t("gp.address"),
			})
		);
	};

	const handleShowReadyMessage = () => {
		Toast.show(I18n.t("gp.coming_soon"));
	};

	const onShare = async () => {
		try {
			const result = await Share.share({
				message: tokenStore.token.type === "luniverse" ? memberStore.address : tokenStore.token.type === "luniverse" ? memberStore.ethAddress : memberStore.btcAddress,
			});

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			Alert.alert(error.message);
		}
	};

	const refreshBalance = async () => {
		await tokenStore.updateBalance(memberStore.accessToken, tokenStore.token);
		setNowBalance(tokenStore.token.balance);
	};

	return (
		<Container>
			<HeaderContainer />
			<BalanceBackground
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				// colors={[DefaultColors.mainColorToneDown, DefaultColors.mainColor]}
				// colors={[DefaultColors.lightGray, DefaultColors.lightGray]}
				colors={["#fefefe", "#fefefe"]}
			>
				<BalanceContainer>
					<TouchableOpacity
						onPressOut={addressToClipboard}
						style={{
							padding: 7,
							paddingLeft: 0,
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							marginLeft: 3,
						}}
					>
						<Image
							source={{ uri: tokenStore.token.imageUrl }}
							blurRadius={1}
							style={{
								position: "absolute",
								// bottom: 0,
								// right: 0,
								bottom: -170,
								right: -250,
								// width: 65,
								// height: 65,
								width: 300,
								height: 300,
								resizeMode: "contain",
								zIndex: -1,
								opacity: 0.3,
							}}
						/>
						{/* <SIcon name={"wallet"} size={25} color={DefaultColors.mainColor} /> */}
						<FontAwesome5 name={"copy"} size={25} color={DefaultColors.mainColor} />

						<HeaderDesc style={{ color: DefaultColors.mainColor, fontSize: 18 }}>
							{hideAddress(tokenStore.token.type === "luniverse" ? memberStore.address : tokenStore.token.type === "ethereum" ? memberStore.ethAddress : memberStore.btcAddress)}
						</HeaderDesc>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={refreshBalance}
						style={{
							marginTop: -5,
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<HeaderBalance
							style={{
								color: DefaultColors.fontColor,
								fontSize: 23,
								fontWeight: "bold",
							}}
						>
							{NumberWithCommas(isNaN(nowBalance) ? 0 : nowBalance, 0)} {tokenStore.token.symbol}
						</HeaderBalance>
					</TouchableOpacity>

					<View
						style={{
							flexDirection: "row",
							width: "100%",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<CurrencyWrapper>
							<HeaderCurrency>{`${NumberWithCommas(assetUSD)} ${tokenStore.tokenCurrency}`}</HeaderCurrency>
							<HeaderCurrency
								style={{
									fontSize: 14,
								}}
							>
								{`1 ${tokenStore.token.symbol} = ` + NumberWithCommas(tokenStore.token.tokenPriceByCurrency) + " " + tokenStore.tokenCurrency}
							</HeaderCurrency>
						</CurrencyWrapper>
						{/* <Image
              source={{ uri: tokenStore.token.imageUrl }}
              blurRadius={2}
              style={{
                position: "absolute",
                // bottom: 0,
                // right: 0,
                bottom: -150,
                right: -150,
                // width: 65,
                // height: 65,
                width: 400,
                height: 400,
                resizeMode: "contain",
                zIndex: -1,
              }}
            /> */}
					</View>
				</BalanceContainer>
			</BalanceBackground>
			<ButtonContainer>
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("AssetSendPage", {
							symbol: tokenStore.token.symbol,
						})
					}
					activeOpacity={0.6}
				>
					<ButtonWrapper>
						<IconWrapper>
							{/* <Icon name={"upload"} size={18} color={"white"} /> */}
							<Icon name={"logout"} size={30} color={DefaultColors.lightToneDownGray} />
						</IconWrapper>
						<ButtonText>{I18n.t("gp.send")}</ButtonText>
					</ButtonWrapper>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() =>
						navigation.navigate("AssetReceivePage", {
							symbol: tokenStore.token.symbol,
							type: tokenStore.token.type,
						})
					}
					activeOpacity={0.6}
				>
					<ButtonWrapper>
						<IconWrapper>
							{/* <Icon name={"download"} size={18} color={"white"} /> */}
							<Icon name={"login"} size={30} color={DefaultColors.lightToneDownGray} />
						</IconWrapper>
						<ButtonText>{I18n.t("gp.receive")}</ButtonText>
					</ButtonWrapper>
				</TouchableOpacity>
				<TouchableOpacity onPress={onShare} activeOpacity={0.6}>
					<ButtonWrapper>
						<IconWrapper>
							{/* <Icon name={"sharealt"} size={18} color={"white"} /> */}
							<Icon name={"sharealt"} size={30} color={DefaultColors.lightToneDownGray} />
						</IconWrapper>
						<ButtonText>{I18n.t("gp.share")}</ButtonText>
					</ButtonWrapper>
				</TouchableOpacity>

				{tokenStore.token.symbol === APP_PROPERTIES.TOKEN_SYMBOL.WFCA && (
					<TouchableOpacity onPress={handleShowReadyMessage} activeOpacity={0.6}>
						<ButtonWrapper>
							<IconWrapper>
								{/* <Icon name={"retweet"} size={18} color={"white"} /> */}
								<Icon name={"retweet"} size={30} color={DefaultColors.lightToneDownGray} />
							</IconWrapper>
							<ButtonText>{I18n.t("gp.card_charging")}</ButtonText>
						</ButtonWrapper>
					</TouchableOpacity>
				)}
			</ButtonContainer>
			<TransactionWrapper>
				<TransactionHeader>
					<TransactionTitle>{I18n.t("gp.transaction_history")}</TransactionTitle>
					<TransactionPageButton onPress={() => navigation.navigate("TransactionHistoryPage")}>
						<TransactionButtonText>{I18n.t("gp.all")}</TransactionButtonText>
					</TransactionPageButton>
				</TransactionHeader>
				<View style={{ paddingLeft: 10, paddingRight: 10 }}>
					<TransactionListScroll>
						<TransactionListComponent
							key={tokenStore.token.symbol}
							type={tokenStore.token.type}
							assetStore={assetStore}
							tokenStore={tokenStore}
							memberStore={memberStore}
							refreshBalance={() => refreshBalance()}
							dataLength={6}
						/>
					</TransactionListScroll>
				</View>
			</TransactionWrapper>
			<TransactionModalComponent />
		</Container>
	);
};

AssetOnePage.navigationOptions = ({ navigation, screenProps }) => {
	return {
		title: I18n.t("gp.gp_wallet", { name: navigation.state.params.symbol }),
		headerTitleStyle: {
			color: "black",
			fontWeight: "bold",
		},
		headerStyle: {
			backgroundColor: "white",
		},
	};
};

const Container = styled.SafeAreaView`
	flex: 1;
	background-color: #f4f4f4;
`;

const BalanceBackground = styled(LinearGradient)`
	height: ${240 + parseInt(ifIphoneX("10", "0"))}px;
	background-color: ${DefaultColors.mainColor};
`;

const BalanceContainer = styled.View`
	height: ${240 + parseInt(ifIphoneX("10", "0"))}}px;
	padding: 30px 25px;
	padding-bottom: 70px;
	align-items: flex-start;
	justify-content: center;
	padding-bottom: 25px;
`;

const HeaderContainer = styled.View`
	margin-horizontal: 15px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

const HeaderDesc = styled.Text`
	color: ${DefaultColors.lightGray}; /*#898989;*/
	margin-left: 8px;
`;

const HeaderBalance = styled.Text`
	margin-top: 10px;
	margin-bottom: 10px;
	font-size: 20px;
	color: white;
	width: 100%;
	padding: 7px 10px;
`;

const CurrencyWrapper = styled.View`
	margin-left: 2px;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	background-color: ${DefaultColors.secondColor};
	opacity: 1;
	padding: 6px 14px;
	padding: 7px 10px;
	border-radius: 5px;
	width: 100%;
`;

const HeaderCurrency = styled.Text`
	color: ${DefaultColors.lightGray};
	font-size: 14px;
`;

const ButtonContainer = styled.View`
	left: 15px;
	width: ${width - 30}px;
	height: 90px;
	position: absolute;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	padding-left: 15px;
	padding-right: 15px;
	border-radius: 7px;
	background-color: white;
	shadow-color: #000000;
	shadow-radius: 5px;
	shadow-offset: 2px 5px;
	shadow-opacity: 0.3;
	elevation: 5;
	background-color: ${DefaultColors.mainColor};
	z-index: 10;

	bottom: 10px;
	height: auto;
	padding: 10px 15px;
	width: ${width - 10}px;
	left: 5px;
`;

const ButtonWrapper = styled.View`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const IconWrapper = styled.View`
	height: 50px;
	width: 50px;
	border-radius: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${DefaultColors.secondColorToneDown};
	margin-bottom: 5px;

	margin-bottom: 0;
	background-color: transparent;
	width: 30px;
	height: 30px;
`;

const ButtonText = styled.Text`
	font-size: 14px;
	color: #505050;
	margin-top: 3px;
	font-weight: bold;
	color: #fefefe;
`;

const TransactionWrapper = styled.View`
	padding: 55px 5px 0px 5px;
	padding: 5px 5px 140px 5px;
	flex: 1;
`;

const TransactionListScroll = styled.ScrollView`
	height: 100%;
`;

const TransactionHeader = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 10px 20px;
	align-items: flex-end;
`;

const TransactionPageButton = styled.TouchableOpacity`
	position: absolute;
	padding: 10px;
	right: 15px;
`;

const TransactionTitle = styled.Text`
	color: #202020;
	color: ${DefaultColors.fontColor};
	font-size: 18px;
`;

const TransactionButtonText = styled.Text`
	color: #909090;
	color: ${DefaultColors.mainColor};
	font-size: 14px;
	text-decoration: underline;
	font-weight: 500;
`;

export default inject("assetStore", "tokenStore", "memberStore", "assetDetailStore")(observer(withNavigationFocus(AssetOnePage)));
