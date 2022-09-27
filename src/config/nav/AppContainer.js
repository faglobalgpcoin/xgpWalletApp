import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import SplashPage from '../../splash/SplashPage';
import MainBottomTabNavigator from './MainBottomTabNavigator';
import MemberInfoFormPage from '../../member/MemberInfoFormPage';
import {IntroStackNavigator} from './IntroStackNavigator';

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      SplashPage: SplashPage,
      IntroStackNavigator: IntroStackNavigator,
      MainBottomTabNavigator: MainBottomTabNavigator,
      MemberInfoInitPage: MemberInfoFormPage,
    },
    {
      initialRouteName: 'SplashPage',
      headerLayoutPreset: 'center',
    },
  ),
);

export default AppContainer;
