import React from 'react';
import {createStackNavigator} from 'react-navigation';
import DAppPage from '../../dapp/DAppPage';
import DefaultColors from '../../common/style/DefaultColors';
import ScannerPage from '../../scanner/ScannerPage';
import ConnectingPage from '../../scanner/ConnectingPage';
import I18n from '../../config/i18n';

export const DAppStackNavigator = createStackNavigator(
  {
    DAppPage: {
      screen: DAppPage,
      navigationOptions: {
        title: I18n.t('dapp.connecting_dapp'),
        // headerTransparent: true,
        headerTitleStyle: {
          color: 'black',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: 'white',
        },
      },
    },
    ConnectingPage: {
      screen: ConnectingPage,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: DefaultColors.mainColorToneDown,
      },
    },
    ScannerPage: {
      screen: ScannerPage,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: 'white',
      },
    },
  },
  {
    initialRouteName: 'DAppPage',
    defaultNavigationOptions: {
      headerBackTitle: null,
    },
  },
);
