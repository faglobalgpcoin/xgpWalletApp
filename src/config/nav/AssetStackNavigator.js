import React from "react";
import { createStackNavigator } from "react-navigation";

import AssetDetailPage from "../../asset/AssetDetailPage";
import RemoveHeaderShadow from "../../common/style/RemoveHeaderShadow";
import AssetReceivePage from "../../asset/AssetReceivePage";
import AssetSendPage from "../../asset/AssetSendPage";
import AssetQRCodeScanPage from "../../asset/AssetQRCodeScanPage";
import AssetOnePage from "../../asset/AssetOnePage";
import TransactionHistoryPage from "../../asset/TransactionPage";
import TapickExchangePage from "../../asset/TapickExchangePage";
import HomePage from "../../home/HomePage";
import AssetListPage from "../../asset/AssetListPage";
import ETHToWFCASwapPage from "../../home/ETHToWFCASwapPage";
import ETHToDGPSwapPage from "../../home/ETHToDGPSwapPage";

export const AssetStackNavigator = createStackNavigator(
  {
    HomePage: {
      screen: HomePage,
      navigationOptions: {
        header: null,
      },
    },
    AssetListPage: {
      screen: AssetListPage,
      navigationOptions: {
        headerStyle: {
          headerStyle: RemoveHeaderShadow,
        },
      },
    },
    AssetOnePage: {
      screen: AssetOnePage,
      navigationOptions: {
        headerStyle: RemoveHeaderShadow,
      },
    },
    AssetDetailPage: {
      screen: AssetDetailPage,
      navigationOptions: {
        headerStyle: RemoveHeaderShadow,
      },
    },
    AssetReceivePage: {
      screen: AssetReceivePage,
      // navigationOptions: {
      //   headerStyle: {
      //     backgroundColor: 'transparent',
      //   },
      //   headerTintColor: '#fff',
      // },
      navigationOptions: {
        headerStyle: RemoveHeaderShadow,
      },
    },
    AssetSendPage: {
      screen: AssetSendPage,
      navigationOptions: {
        headerStyle: RemoveHeaderShadow,
      },
    },
    AssetQRCodeScanPage: AssetQRCodeScanPage,
    TransactionHistoryPage: TransactionHistoryPage,
    TapickExchangePage: TapickExchangePage,
    ETHToWFCASwapPage: ETHToWFCASwapPage,
    ETHToDGPSwapPage: ETHToDGPSwapPage,
  },
  {
    // initialRouteName: 'AssetOnePage',
    initialRouteName: "HomePage",
    defaultNavigationOptions: {
      // headerBackTitle: null,
      headerTintColor: "black",
    },
    headerLayoutPreset: "center",
  }
);
