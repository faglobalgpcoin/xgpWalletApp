import React, {useState} from 'react';
import {Keyboard, View, TouchableWithoutFeedback, Image} from 'react-native';
import styled from 'styled-components';
import i18n from 'i18n-js';
import Icon from 'react-native-vector-icons/Feather';
import {inject, observer} from 'mobx-react';
import images from './image/images';
import DefaultColors from '../common/style/DefaultColors';
import RemoveHeaderShadow from '../common/style/RemoveHeaderShadow';

const SelectedLang = () => {
  return (
    <View>
      <Icon name={'check'} size={25} color={DefaultColors.mainColor} />
    </View>
  );
};

const ChangeCurrencyPage = ({tokenStore, memberStore}) => {
  const [currency, setCurrency] = useState(tokenStore.tokenCurrency || 'USD');

  const handleSetLocale = async current => {
    await tokenStore.setTokenCurrency(current);
    await tokenStore.updateTokenList(memberStore.accessToken);

    setCurrency(current);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <NavTitle>{i18n.t('gp.change_currency')}</NavTitle>
        <LanguageRow onPress={() => handleSetLocale('USD')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.enFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'USD'}>USD</LanguageText>
          </LanguageTitle>
          {currency === 'USD' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('KRW')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.koFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'KRW'}>KRW</LanguageText>
          </LanguageTitle>
          {currency === 'KRW' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('CNY')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.zhFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'CNY'}>CNY</LanguageText>
          </LanguageTitle>
          {currency === 'CNY' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('JPY')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.jpFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'JPY'}>JPY</LanguageText>
          </LanguageTitle>
          {currency === 'JPY' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('THB')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.thFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'THB'}>THB</LanguageText>
          </LanguageTitle>
          {currency === 'THB' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('BRL')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.brlFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'BRL'}>BRL</LanguageText>
          </LanguageTitle>
          {currency === 'BRL' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('CAD')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.cadFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'CAD'}>CAD</LanguageText>
          </LanguageTitle>
          {currency === 'CAD' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('EUR')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.eurFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'EUR'}>EUR</LanguageText>
          </LanguageTitle>
          {currency === 'EUR' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('GBP')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.gbpFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'GBP'}>GBP</LanguageText>
          </LanguageTitle>
          {currency === 'GBP' && <SelectedLang />}
        </LanguageRow>
        <LanguageRow onPress={() => handleSetLocale('HKD')}>
          <LanguageTitle>
            <IconContainer>
              <Image source={images.hkdFlag} style={{width: 20, height: 15}} />
            </IconContainer>
            <LanguageText isSelected={currency === 'HKD'}>HKD</LanguageText>
          </LanguageTitle>
          {currency === 'HKD' && <SelectedLang />}
        </LanguageRow>
      </Container>
    </TouchableWithoutFeedback>
  );
};

ChangeCurrencyPage.navigationOptions = ({screenProps}) => {
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

export default inject('tokenStore', 'memberStore')(
  observer(ChangeCurrencyPage),
);
