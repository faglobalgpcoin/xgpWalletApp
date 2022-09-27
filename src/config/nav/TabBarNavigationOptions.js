import React from "react";
import { Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DefaultColors from "../../common/style/DefaultColors";

// const CustomIcons = (name, focused) => {
//   return <Image source={images[name]} style={{width: 30, height: 30}} />;
// };

const VectorIcons = ({ name, focused }) => {
	return (
		<Ionicons
			name={name}
			size={34}
			style={{ marginBottom: -3 }}
			// color={focused ? "black" : "#b4b4b0"}
			color={focused ? DefaultColors.mainColor : DefaultColors.gray}
		/>
	);
};

export const TabBarNavigationOptions = (icon) => {
	return {
		tabBarLabel: "",
		tabBarIcon: ({ focused }) => <VectorIcons focused={focused} name={Platform.OS === "ios" ? `ios-${icon}` : `md-${icon}`} />,
	};
};
