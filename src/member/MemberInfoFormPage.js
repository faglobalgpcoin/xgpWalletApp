import React, {useEffect} from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import {MaterialIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'i18n-js';

import mockData from '../MockData';
import MnemonicBackupModal from '../common/component/MnemonicBackupModal';
import DefaultColors from '../common/style/DefaultColors';

const {width} = Dimensions.get('window');

const MemberInfoFormPage = ({navigation, memberInfoFormStore}) => {
  useEffect(() => {
    if (navigation.state.routeName === 'MemberInfoInitPage') {
      memberInfoFormStore.userInfo = mockData.member;
    }
    memberInfoFormStore.setFormInfo(memberInfoFormStore.userInfo);
    return () => {};
  }, [memberInfoFormStore, navigation.state.routeName]);

  const handlePressSubmit = () => {
    if (navigation.state.routeName === 'MemberInfoInitPage') {
      navigation.navigate('AssetOnePage');
    } else {

    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container contentInsetAdjustmentBehavior="automatic">
        <SafeAreaView>
          {navigation.state.routeName === 'MemberInfoInitPage' ? (
            <TitleContainer>
              <TouchableOpacity
                style={{marginBottom: 15}}
                onPress={() => navigation.navigate('IntroSlider')}>
                <Icon
                  name="arrowleft"
                  size={30}
                  color={DefaultColors.darkGray}
                />
              </TouchableOpacity>
              <Welcome>{I18n.t('member.welcome')}</Welcome>
              <WelcomeDesc>{I18n.t('member.welcome_fill_info')}</WelcomeDesc>
            </TitleContainer>
          ) : (
            <TitleContainer>
              <Title>{I18n.t('member.change_member_info')}</Title>
            </TitleContainer>
          )}
          <InformationContainer>
            <FormContainer>
              <InputTitle>{I18n.t('member.mobile')}</InputTitle>
              <InputRow>
                <InfoInput
                  style={{width: '15%', marginRight: 15, textAlign: 'center'}}
                  inputWidth={100}
                  placeholder={'+00'}
                />
                <InfoInput
                  style={{paddingLeft: 10}}
                  placeholder={'12345678'}
                  value={memberInfoFormStore.mobileInput}
                  onChangeText={memberInfoFormStore.handleChangeMobile}
                  onFocus={memberInfoFormStore.handleFocusMobile}
                  onBlur={memberInfoFormStore.handleBlurMobile}
                  isFocused={memberInfoFormStore.isMobileFocused}
                />
              </InputRow>
              <InputTitle>Code</InputTitle>
              <InputRow>
                <InfoInput
                  value={memberInfoFormStore.mobileInput}
                  onChangeText={memberInfoFormStore.handleChangeMobile}
                  onFocus={memberInfoFormStore.handleFocusMobile}
                  onBlur={memberInfoFormStore.handleBlurMobile}
                  isFocused={memberInfoFormStore.isMobileFocused}
                />
                <SendButton>
                  <SendText>Send</SendText>
                </SendButton>
              </InputRow>
              {/*<InputTitle>{I18n.t('member.email')}</InputTitle>*/}
              {/*<InputRow>*/}
              {/*  <InfoInput*/}
              {/*    value={memberInfoFormStore.emailInput}*/}
              {/*    onChangeText={memberInfoFormStore.handleChangeEmail}*/}
              {/*    onFocus={memberInfoFormStore.handleFocusEmail}*/}
              {/*    onBlur={memberInfoFormStore.handleBlurEmail}*/}
              {/*    isFocused={memberInfoFormStore.isEmailFocused}*/}
              {/*  />*/}
              {/*</InputRow>*/}
            </FormContainer>
            <SubmitContainer>
              <SubmitButtonBackground
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[
                  DefaultColors.mainColor,
                  DefaultColors.mainColorToneDown,
                ]}>
                <SubmitButton
                  activeOpacity={0.6}
                  disabled={!memberInfoFormStore.isChanged}
                  isChanged={memberInfoFormStore.isChanged}
                  onPress={handlePressSubmit}>
                  {memberInfoFormStore.isLoading ? (
                    <MaterialIndicator
                      style={{zIndex: 1}}
                      color={'white'}
                      size={30}
                    />
                  ) : (
                    <Text style={{color: 'white', fontSize: 18}}>
                      {navigation.state.routeName === 'MemberInfoInitPage'
                        ? 'Submit'
                        : I18n.t('member.adjust')}
                    </Text>
                  )}
                </SubmitButton>
              </SubmitButtonBackground>
            </SubmitContainer>
          </InformationContainer>
          <MnemonicBackupModal
            parentStore={memberInfoFormStore}
            isCreateModal={true}
          />
        </SafeAreaView>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  background-color: #f4f4f4;
`;

const TitleContainer = styled.View`
  padding-top: 20px;
  padding-bottom: 20px;
  padding-horizontal: 25px;
  background-color: white;
`;

const InformationContainer = styled.View`
  flex: 1;
  padding-horizontal: ${Platform.OS === 'ios' ? '20' : '20'}px;
  padding-vertical: 15px;
  background-color: #f4f4f4;
`;

const Title = styled.Text`
  font-size: 19px;
  color: black;
`;

const DividerText = styled.Text`
  font-size: 17px;
  color: #474747;
  margin-left: 7px;
`;

const DividerRow = styled.View`
  flex-direction: row;
`;

const FormContainer = styled.View`
  margin-top: 10px;
  padding: 20px;
  padding-bottom: 5px;
  background-color: white;
  border-radius: 8px;
  shadow-color: #000000;
  shadow-radius: 3px;
  shadow-offset: 1px 2px;
  shadow-opacity: 0.1;
  elevation: 5;
`;

const Welcome = styled.Text`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const WelcomeDesc = styled.Text`
  margin-bottom: 5px;
`;

const InputRow = styled.View`
  margin-top: 5px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
`;

const InputTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  margin-right: 3px;
  margin-top: 5px;
`;

const InfoInput = styled.TextInput`
  ${({inputWidth}) => (inputWidth > 0 ? `width: ${inputWidth}px;` : 'flex: 1;')}
  margin-top: 5px;
  padding-left: 0;
  padding-top: ${Platform.OS === 'ios' ? '10' : '0'}px;
  padding-bottom: ${Platform.OS === 'ios' ? '10' : '5'}px;
  font-size: 14px;
  border-color: #d6d6d6;
  border-bottom-width: 1px;
  ${({isFocused}) => isFocused && `border-color: ${DefaultColors.mainColor};`};
  color: black;
  font-size: 17px;
`;

const SendButton = styled.TouchableOpacity`
  height: 35px;
  width: 70px;
  border-radius: 25px;
  border: 1px solid ${DefaultColors.mainColorToneDown};
  align-items: center;
  justify-content: center;
  margin-left: 15px;
`;

const SendText = styled.Text`
  color: ${DefaultColors.mainColorToneDown};
`;

const SubmitContainer = styled.View`
  width: 100%;
  margin-top: 25px;
  align-items: center;
  bottom: 0px;
`;

const SubmitButtonBackground = styled(LinearGradient)`
  width: ${width - 50}px;
  height: 55px;
  margin-bottom: 15px;
  border-radius: 40px;
`;

const SubmitButton = styled.TouchableOpacity`
  width: ${width - 50}px;
  margin-bottom: 15px;
  height: 55px;
  background-color: ${({isChanged}) =>
    isChanged ? 'transparent' : DefaultColors.gray};
  border-radius: 40px;
  justify-content: center;
  align-items: center;
`;

export default inject(
  'memberInfoFormStore',
  'passwordSettingStore',
  'bannerStore',
  'settingStore',
)(observer(MemberInfoFormPage));
