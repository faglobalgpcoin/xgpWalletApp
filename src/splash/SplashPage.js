import React, {useEffect} from 'react';
import {inject, observer} from 'mobx-react';
import styled from 'styled-components';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import I18n from 'i18n-js';

import DefaultColors from '../common/style/DefaultColors';

const SplashPage = ({navigation, memberStore, tokenStore}) => {
  const getLocale = async () => {
    try {
      const value = await AsyncStorage.getItem('locale');
      if (value !== null) {
        return value;
      } else {
        return 'en';
      }
    } catch (e) {
      return 'en';
    }
  };

  useEffect(() => {
    async function validateUserData() {
      const isValidUser = await memberStore.updateUserInfo();
      //console.log(isValidUser);
      if (isValidUser) {
        // await assetStore.updateBalance(memberStore.accessToken);
        // await assetStore.updateTransactions(memberStore.user.address);
        // await settingStore.updateAppProperty(memberStore.accessToken);
        await tokenStore.updateTokenList(memberStore.accessToken);
        //await setWeb3();
        SplashScreen.hide();
        // navigation.navigate('AssetOnePage');
        navigation.navigate('HomePage');
      } else {
        SplashScreen.hide();
        navigation.navigate('IntroPage');
      }
    }

    async function fetchLocaleData() {
      const result = await getLocale();
      I18n.locale = result;
    }

    setTimeout(async () => {
      await fetchLocaleData();
      await validateUserData();
    }, 1000);
  }, [memberStore, navigation, tokenStore]);

  return <Container />;
};

const Container = styled.View`
	flex: 1;
	background-color: white; // ${DefaultColors.mainColor};
	justify-content: center;
	align-items: center;
`;

export default inject('memberStore', 'tokenStore')(
  observer(SplashPage),
);
