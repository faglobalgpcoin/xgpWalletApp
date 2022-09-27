import React from 'react';
import {createStackNavigator} from 'react-navigation';

import IntroSlider from '../../splash/IntroSlider';
import SignupPage from '../../member/SignupPage';
import LoginPage from '../../member/LoginPage';
import ForgotPasswordPage from '../../member/ForgotPasswordPage';

export const IntroStackNavigator = createStackNavigator(
  {
    IntroPage: {
      screen: IntroSlider,
      navigationOptions: {
        header: null,
      },
    },
    LoginPage: LoginPage,
    SignupPage: SignupPage,
    ForgotPasswordPage: ForgotPasswordPage,
  },
  {
    initialRouteName: 'IntroPage',
    defaultNavigationOptions: {
      headerBackTitle: null,
      headerTintColor: 'black',
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
      },
    },
  },
);
