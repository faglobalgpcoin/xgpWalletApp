import React from 'react';
import {createStackNavigator} from 'react-navigation';
import CustomHeaderTitle from '../../common/component/CustomHeaderTitle';
import MemberPage from '../../member/MemberPage';
import MemberInfoFormPage from '../../member/MemberInfoFormPage';
import RemoveHeaderShadow from '../../common/style/RemoveHeaderShadow';
import MemberAddressQRPage from '../../member/MemberAddressQRPage';

export const MemberStackNavigator = createStackNavigator(
  {
    MemberPage: {
      screen: MemberPage,
      navigationOptions: {
        headerTitle: <CustomHeaderTitle title={'회원'} />,
        header: null,
        headerMode: 'none',
      },
    },
    MemberInfoFormPage: MemberInfoFormPage,
    MemberAddressQRPage: {
      screen: MemberAddressQRPage,
      navigationOptions: {
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: '#fff',
      },
    },
  },
  {
    initialRouteName: 'MemberPage',
    defaultNavigationOptions: {
      headerBackTitle: null,
      headerStyle: RemoveHeaderShadow,
    },
  },
);
