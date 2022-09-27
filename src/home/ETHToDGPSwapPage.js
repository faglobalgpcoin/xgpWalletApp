import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  View,
  TouchableWithoutFeedback,
  Text,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components';
import I18n from 'i18n-js';
import {inject, observer} from 'mobx-react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import QRCode from 'react-native-qrcode-svg';

import DefaultColors from '../common/style/DefaultColors';
import RemoveHeaderShadow from '../common/style/RemoveHeaderShadow';
import {getEthAddress} from '../api/Api';

const ETHToDGPSwapPage = ({memberStore}) => {
  const [ethAddress, setEthAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const ethAddressRes = await getEthAddress({
        wfcAddr: memberStore.address,
        token: "dgp"
      });
      console.log('ethAddressRes > ', ethAddressRes);
      setEthAddress(ethAddressRes.data.ethAddr);
      setIsLoading(false);
    };

    setTimeout(() => {
      fetchData();
    }, 100);
  }, [memberStore.address, memberStore.address]);

  const writeToClipboard = () => {
    Clipboard.setString(ethAddress);
    Toast.show(
      I18n.t('gp.address_copy_complete', {
        name: I18n.t('gp.address'),
      }),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <NavTitle>DGP Buy</NavTitle>
        {!isLoading ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}>
            <Text style={{marginBottom: 10}}>
              {/*{I18n.t('gp.your_token_address', {name: 'ETH Swap'})}*/}
              ETH deposit address
            </Text>

            <AddressButton onPressOut={writeToClipboard}>
              {/*<Address>{props.address}</Address>*/}
              <Address>{ethAddress}</Address>
              <Icon
                size={15}
                name="content-copy"
                color="black"
                style={{marginRight: 10}}
              />
            </AddressButton>

            <QRCodeContainer>
              <QRCode
                size={250}
                value={ethAddress || '123'}
                color="black"
                backgroundColor="white"
              />
            </QRCodeContainer>

            {/*<ReferrerInput onPressOut={writeToClipboard}>
              <Referrer>{ethAddress}</Referrer>
            </ReferrerInput>*/}
          </View>
        ) : (
          <View
            style={{
              height: '100%',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
      </Container>
    </TouchableWithoutFeedback>
  );
};

ETHToDGPSwapPage.navigationOptions = ({screenProps}) => {
  return {
    title: '', // screenProps.i18Nav.t('gp.change_language'),
    headerStyle: RemoveHeaderShadow,
  };
};

const Container = styled.ScrollView`
  flex: 1;
`;

const NavTitle = styled.Text`
  padding: 5px 20px 20px 20px;
  font-size: 17px;
  font-weight: bold;
`;

const LanguageRow = styled.TouchableOpacity.attrs({
  activeOpacity: 0.6,
})`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 12px 20px;
  height: 55px;
  align-items: center;
  flex-direction: row;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
`;

const LanguageTitle = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LanguageText = styled.Text`
  color: ${({isSelected}) =>
    isSelected ? DefaultColors.mainColorToneDown : DefaultColors.darkGray};
  font-weight: ${({isSelected}) => (isSelected ? 'bold' : 'normal')};
`;

const IconContainer = styled.View`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  margin-right: 15px
  border: 1px solid #e5e5e5;
  align-items: center;
  justify-content: center;
`;

const AddressButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #cecece;
  border-radius: 5px;
`;

const ReferrerInput = styled.TextInput`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  border-radius: 5px;
  background-color: #efefef;
`;

const Referrer = styled.Text`
  width: 70%;
  font-size: 11px;
`;

const Address = styled.Text`
  width: 90%;
  padding-left: 10;
  padding-right: 7;
  font-size: 11;
`;

const QRCodeContainer = styled.View`
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 20px;
`;

export default inject('memberStore')(observer(ETHToDGPSwapPage));
