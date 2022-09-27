import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Header} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import {ifIphoneX, getStatusBarHeight} from 'react-native-iphone-x-helper';
import styled from 'styled-components';
import {inject, observer} from 'mobx-react';
import I18n from 'i18n-js';

import DefaultColors from '../common/style/DefaultColors';
import TransactionListComponent from './component/TransactionListComponent';

const TransactionHistoryPage = ({assetStore, memberStore, tokenStore}) => {
  return (
    <>
      <HeaderWrapper
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={[DefaultColors.mainColorToneDown, DefaultColors.mainColor]}
      />
      <Container>
        <TransactionListComponent
          assetStore={assetStore}
          memberStore={memberStore}
          type={tokenStore.token.type}
        />
      </Container>
      <Footer>
        <TouchableOpacity
          onPress={() =>
            assetStore.navigateToScanList(tokenStore.token.type === "luniverse" ? memberStore.address : memberStore.ethAddress, tokenStore.token.type)
          }>
          <HyperlinkText>{I18n.t('gp.transfer_account')}</HyperlinkText>
        </TouchableOpacity>
      </Footer>
    </>
  );
};

TransactionHistoryPage.navigationOptions = ({navigation}) => {
  return {
    title: I18n.t('gp.transaction_history'),
    headerTransparent: true,
    headerTintColor: 'white',
    headerTitleStyle: {
      color: 'white',
      fontWeight: 'bold',
    },
  };
};

const HeaderWrapper = styled(LinearGradient)`
  height: ${Header.HEIGHT + ifIphoneX(getStatusBarHeight(), 0)}px;
`;

const Container = styled.View`
  display: flex;
  flex: 1;
  padding: 5px 0px;
`;

const Footer = styled.View`
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: ${DefaultColors.lightGray};
`;

const HyperlinkText = styled.Text`
  font-size: 11;
  color: #787878;
`;

export default inject('memberStore', 'assetStore', 'tokenStore')(
  observer(TransactionHistoryPage),
);
