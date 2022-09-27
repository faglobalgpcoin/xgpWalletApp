import React from "react";
import { createStackNavigator } from "react-navigation";
import SettingPage from "../../setting/SettingPage";
import PolicyPage from "../../setting/PolicyPage";
import TransferTokenPage from "../../setting/TransferTokenPage";
import ChangeLanguagePage from "../../setting/ChangeLanguagePage";
import ChangeCurrencyPage from "../../setting/ChangeCurrencyPage";
import NoticePage from "../../setting/NoticePage";
// Mypage
import MyPages from "../../setting/MyPages";

export const SettingStackNavigator = createStackNavigator(
	{
		SettingPage: {
			screen: SettingPage,
		},
		PolicyPage: {
			screen: PolicyPage,
			navigationOptions: {
				headerStyle: {
					backgroundColor: "transparent",
				},
				headerTransparent: true,
				headerTintColor: "white",
			},
		},
		TransferTokenPage: TransferTokenPage,
		ChangeLanguagePage: ChangeLanguagePage,
		ChangeCurrencyPage: ChangeCurrencyPage,
		MyPages: MyPages,
		NoticePage: {
			screen: NoticePage,
			navigationOptions: {
				title: "Notice",
				headerTitleStyle: {
					color: "black",
					fontWeight: "bold",
				},
			},
		},
	},
	{
		initialRouteName: "SettingPage",
		defaultNavigationOptions: {
			headerBackTitle: null,
			headerTintColor: "black",
		},
		headerLayoutPreset: "center",
	}
);
