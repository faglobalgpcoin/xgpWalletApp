import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import { TabBarNavigationOptions } from "./TabBarNavigationOptions";
import { MemberStackNavigator } from "./MemberStackNavigator";
import DefaultColors from "../../common/style/DefaultColors";
import { AssetStackNavigator } from "./AssetStackNavigator";
import { DAppStackNavigator } from "./DAppStackNavigator";
import { SettingStackNavigator } from "./SettingStackNavigator";
import ConnectingPage from "../../scanner/ConnectingPage";
import ApprovalModal from "../../common/ApprovalModal";

DAppStackNavigator.navigationOptions = TabBarNavigationOptions("log-in");
AssetStackNavigator.navigationOptions = TabBarNavigationOptions("home-outline");
MemberStackNavigator.navigationOptions = TabBarNavigationOptions("person");
SettingStackNavigator.navigationOptions = TabBarNavigationOptions("settings-outline");

const screensWithoutTabBar = ["PasswordPage", "PasswordConfirmPage", "AssetQRCodeScanPage", "ConnectingPage"];

const handleTabPress = ({ navigation }) => {
	navigation.popToTop();
	navigation.navigate(navigation.state.routeName);
};

const MainStack = createBottomTabNavigator(
	{
		AssetStackNavigator: AssetStackNavigator,
		// DAppStackNavigator: DAppStackNavigator,
		// MemberStackNavigator: MemberStackNavigator,
		SettingStackNavigator: SettingStackNavigator,
	},
	{
		initialRouteName: "AssetStackNavigator",
		defaultNavigationOptions: ({ navigation }) => {
			return {
				tabBarOnPress: handleTabPress,
				tabBarVisible: !navigation.state || !screensWithoutTabBar.includes((navigation.state.routes[navigation.state.routes.length - 1] || {}).routeName),
				tabBarOptions: {
					showLabel: false,
					activeTintColor: DefaultColors.mainColorToneDown,
					keyboardHidesTabBar: true,
					style: {
						borderTopColor: DefaultColors.gray,
						...Platform.select({
							ios: {
								shadowColor: "black",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.1,
								shadowRadius: 5,
							},
							android: {
								elevation: 20,
							},
						}),
					},
				},
				headerStyle: {
					backgroundColor: DefaultColors.mainColor,
				},
				headerTintColor: "black",
			};
		},
	}
);

const MainBottomTabNavigator = createStackNavigator(
	{
		Main: {
			screen: MainStack,
		},
		ApprovalModal: {
			screen: ApprovalModal,
		},
	},
	{
		mode: "modal",
		headerMode: "none",
		transparentCard: true,
		cardStyle: {
			backgroundColor: "rgba(0,0,0,0.2)",
			opacity: 1,
		},
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: "white",
				borderBottomWidth: 0,
				elevation: 0,
			},
			headerTransparent: true,
		},
		headerLayoutPreset: "center",
	}
);

export default MainBottomTabNavigator;
