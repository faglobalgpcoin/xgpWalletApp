import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { inject, observer } from "mobx-react";
import Icon from "react-native-vector-icons/Fontisto";

import ThinIcon from "react-native-vector-icons/SimpleLineIcons";

import Toast from "react-native-simple-toast";

import { withNavigationFocus } from "react-navigation";
import styled from "styled-components";
import I18n from "i18n-js";

import openBrowser from "../common/function/LinkUtil";
import DefaultColors from "../common/style/DefaultColors";
import LineSeparator from "../common/component/LineSeparator";
import SettingCategoryComponent from "./component/SettingTitleComponent";
import TouchableSettingRowComponent from "./component/TouchableSettingRowComponent";
import ContextSettingRowComponent from "./component/ContextSettingRowComponent";
import APP_PROPERTIES from "../config/appProperties";

const SettingPage = ({ settingStore, memberStore, navigation }) => {
	const APP_VERSION = APP_PROPERTIES.APP_VERSION;

	useEffect(() => {
		return () => {};
	}, [settingStore]);

	const handleShowReadyMessage = () => {
		Toast.show(I18n.t("gp.coming_soon"));
	};

	const handleLogout = () => {
		memberStore.resetMemberInfo();
		navigation.navigate("IntroPage");
	};

	return (
		<Container>
			<ScrollView>
				{/* <LineSeparator /> */}
				<SettingCategoryComponent title={I18n.t("gp.app_config")} />
				<LineSeparator />
				<TouchableSettingRowComponent
					icon={<ThinIcon name={"user-following"} size={20} color={DefaultColors.secondColorToneDown} />}
					title="My Page"
					onPress={() => navigation.navigate("MyPages")}
				/>
				<LineSeparator />
				<TouchableSettingRowComponent
					icon={<ThinIcon name={"globe"} size={20} color={DefaultColors.secondColorToneDown} />}
					title={I18n.t("gp.change_language")}
					onPress={() => navigation.navigate("ChangeLanguagePage")}
				/>
				<LineSeparator />
				<TouchableSettingRowComponent
					icon={<Icon name={"calculator"} size={20} color={DefaultColors.secondColorToneDown} />}
					// iconName="currency-sign"
					title={I18n.t("gp.change_currency")}
					onPress={() => navigation.navigate("ChangeCurrencyPage")}
				/>
				<LineSeparator />
				<SettingCategoryComponent title={I18n.t("gp.etc")} />
				<LineSeparator />
				<TouchableSettingRowComponent iconName="message-text-outline" title={I18n.t("setting.notice")} onPress={() => navigation.navigate({ routeName: "NoticePage" })} />
				<LineSeparator />
				<TouchableSettingRowComponent iconName="file-document-edit-outline" title={I18n.t("gp.policy")} onPress={() => navigation.navigate({ routeName: "PolicyPage" })} />
				<LineSeparator />
				<ContextSettingRowComponent iconName="server" title={I18n.t("gp.version")} value={APP_VERSION} />
				<LineSeparator />

				{/* <SettingCategoryComponent title={""} height={35} /> */}
				{/* <LineSeparator /> */}
				<LogoutContainer onPress={handleLogout}>
					<Logout>{I18n.t("gp.logout")}</Logout>
				</LogoutContainer>
				{/* <LineSeparator /> */}
				{/* <BottomPadding /> */}
			</ScrollView>
		</Container>
	);
};

SettingPage.navigationOptions = ({ screenProps }) => {
	return {
		title: screenProps.i18Nav.t("gp.setting"),
		headerTitleStyle: {
			color: "black",
			fontWeight: "bold",
		},
		headerStyle: {
			backgroundColor: "white",
		},
	};
};

const Container = styled.View`
	flex: 1;
	background-color: #f4f4f4; // ${DefaultColors.mainColor};
`;

const BottomPadding = styled.View`
	height: 20px;
`;

const LogoutContainer = styled.TouchableOpacity.attrs({
	activeOpacity: 0.6,
})`
	width: 100%;
	padding: 20px 20px;
	height: 55px;
	align-items: center;
	justify-content: center;
	flex-direction: row;
	background-color: white;

	height: auto;
	justify-content: flex-end;
	background-color: transparent;
`;

const Logout = styled.Text`
	font-size: 16px;
	font-weight: bold;

	background-color: ${DefaultColors.secondColor};

	color: ${DefaultColors.lightGray};
	width: 35%;
	height: 40px;
	text-align: center;
	line-height: 40px;
	border-radius: 20px;
	overflow: hidden;
`;

export default inject("settingStore", "memberStore")(observer(withNavigationFocus(SettingPage)));
