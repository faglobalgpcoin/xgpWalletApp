import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { AsyncStorage, Dimensions, Platform, View } from "react-native";

import LinearGradient from "react-native-linear-gradient";

import APP_PROPERTIES from "../config/appProperties";
import DefaultColors from "../common/style/DefaultColors";
import I18n from "i18n-js";

const { width } = Dimensions.get("window");

const IntroSlider = ({ navigation, memberStore }) => {
	useEffect(() => {
		memberStore.resetMemberInfo();
	});

	const [currentLang, setCurrentLang] = useState(I18n.currentLocale() || "en");

	const handleSetLocale = async (lang) => {
		console.log("hi");
		I18n.locale = lang;
		setCurrentLang(lang);
		await AsyncStorage.setItem("locale", lang);
	};

	return (
		<View style={{ flex: 1 }}>
			<ImageBackground source={require("./images/globalmap.png")} blurRadius={7} resizeMode="cover" />
			<HeaderContainer>
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						paddingTop: Platform.OS === "ios" ? "35%" : "25%",
					}}
				>
					{/* <HeaderText>FA GLOBAL AG</HeaderText> */}
					<HeaderComImage source={require("./images/logo.png")} />
					<HeaderImage source={require("./images/bee.png")} />
					<SubHeaderText>GP Wallet</SubHeaderText>
				</View>
			</HeaderContainer>
			<ButtonContainer>
				<ButtonBackground start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}>
					<Button onPress={() => navigation.navigate("LoginPage")}>
						<ButtonText>{I18n.t("gp.login_upper")}</ButtonText>
					</Button>
				</ButtonBackground>
				<HalfButton onPress={() => navigation.navigate("SignupPage")}>
					<HalfButtonText>{I18n.t("gp.signup_upper")}</HalfButtonText>
				</HalfButton>
				<LangButtonContainer>
					<LangButton onPress={() => handleSetLocale("en")}>
						<LangImage source={require("./images/en.png")} />
						<LangText>EN</LangText>
					</LangButton>
					<LangButton onPress={() => handleSetLocale("ko")}>
						<LangImage source={require("./images/ko.png")} />
						<LangText>KO</LangText>
					</LangButton>
					<LangButton onPress={() => handleSetLocale("jp")}>
						<LangImage source={require("./images/jp.png")} />
						<LangText>JP</LangText>
					</LangButton>
					<LangButton onPress={() => handleSetLocale("cn")}>
						<LangImage source={require("./images/cn.png")} />
						<LangText>CN</LangText>
					</LangButton>
					<LangButton onPress={() => handleSetLocale("th")}>
						<LangImage source={require("./images/th.png")} />
						<LangText>TH</LangText>
					</LangButton>
				</LangButtonContainer>
			</ButtonContainer>
			<FooterContainer>
				<FooterText>APP VERSION {APP_PROPERTIES.APP_VERSION}</FooterText>
			</FooterContainer>
		</View>
	);
};

const HeaderContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: space-evenly;
	margin-bottom: 15px;
`;

const HeaderComImage = styled.Image`
	width: ${width / 2}px;
	height: ${width / 4.2}px;
`;

const HeaderImage = styled.Image`
	width: ${width / 2.2}px;
	height: ${width / 2.2}px;
	margin: 10px 0;
`;

const HeaderTitleImage = styled.Image`
	margin-top: -30px;
	width: ${width / 2.2 + 50}px;
`;

const ButtonContainer = styled.View`
	height: ${Platform.OS === "ios" ? ifIphoneX("34%", "37%") : "220px"};
	align-items: center;
	justify-content: flex-start;
	padding-top: 15px;
`;

const ButtonBackground = styled(LinearGradient)`
	height: 55px;
	width: ${width - 50}px;
	border-radius: 30px;
	margin-vertical: 10px;
`;

const Button = styled.TouchableOpacity.attrs({
	activeOpacity: 0.4,
})`
	height: 55px;
	width: ${width - 50}px;
	border-radius: 30px;
	align-items: center;
	justify-content: center;
`;

const HalfButton = styled.TouchableOpacity.attrs({
	activeOpacity: 0.4,
})`
	margin-top: 10px;
	height: 55px;
	width: ${width - 50}px;
	border-radius: 30px;
	align-items: center;
	justify-content: center;
	border: 1px solid ${DefaultColors.mainColorToneDown};
`;

const ButtonText = styled.Text`
	color: white;
	font-size: 20px;
	font-weight: bold;
`;

const HalfButtonText = styled.Text`
	color: ${DefaultColors.mainColorToneDown};
	font-size: 20px;
	font-weight: bold;
`;

const FooterContainer = styled.View`
	display: flex;
	align-items: center;
	padding-bottom: 10px;
`;

const FooterText = styled.Text`
	color: gray;
	font-size: 12px;
`;

const HeaderText = styled.Text`
	color: ${DefaultColors.secondColor};
	font-size: 25px;
	margin-top: 20px;
	font-weight: bold;
`;

const SubHeaderText = styled.Text`
	color: ${DefaultColors.mainColor};
	font-size: 45px;
	font-weight: bold;
`;

const ImageBackground = styled.Image`
	position: absolute;
	right: -45%;
	opacity: 0.3;
`;

const LangButtonContainer = styled.View`
	margin-top: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;
const LangButton = styled.TouchableOpacity.attrs({
	activeOpacity: 0.4,
})`
	margin: 0 7px;
`;
const LangImage = styled.Image`
	width: 30px;
	height: 30px;
`;
const LangText = styled.Text`
	font-size: 15px;
	display: none;
`;

export default inject("memberStore")(observer(IntroSlider));
