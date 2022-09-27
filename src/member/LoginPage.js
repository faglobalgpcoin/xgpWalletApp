import React, {useState} from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm} from 'react-hook-form';
import {inject, observer} from 'mobx-react';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'i18n-js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BallIndicator} from 'react-native-indicators';
import Spinner from 'react-native-loading-spinner-overlay';

import DefaultColors from '../common/style/DefaultColors';
import {checkIsExistUser, loginUser} from '../api/Api';

const {width} = Dimensions.get('window');

const LoginPage = ({navigation, memberStore, tokenStore}) => {
  const {
    register,
    getValues,
    setValue,
    triggerValidation,
    errors,
    setError,
  } = useForm({
    submitFocusError: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   setValue('email', 'tnalsl1984@naver.com', true);
  //   setValue('password', 'Aaaaaaaa', true);
  // }, []);

  const handleSubmitForm = async () => {
    let result;
    let isExistUser;
    const data = getValues();
    await triggerValidation();

    if (!data.userId || !data.password) {
      return;
    }

    result = await checkIsExistUser({userId: data.userId});
    if (!result) {
      setError('userId', 'apiError', I18n.t('gp.apiError'));
      return;
    }

    if (result.status === 'fail') {
      isExistUser = true;
    }

    if (!isExistUser) {
      setError('userId', 'notSignup', I18n.t('gp.account_not_signup'));
      return;
    }

    result = await loginUser({
      userId: data.userId,
      password: data.password,
    });

    if (!result) {
      setError(
        'password',
        'wrongPassword',
        I18n.t('gp.account_password_not_matched'),
      );
      return;
    }

    if (result.status === 'fail') {
      setError(
        'password',
        'wrongPassword',
        I18n.t('gp.account_password_not_matched'),
      );
      return;
    }

    await memberStore.setAccessToken(result.data.accessToken);
    result = await memberStore.updateUserInfo();
    await tokenStore.updateTokenList(memberStore.accessToken);

    if (result.status === "fail") {
      navigation.navigate('IntroPage');
    } else {
      navigation.navigate('HomePage');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container contentInsetAdjustmentBehavior="automatic">
        <Spinner
          visible={isLoading}
          textStyle={styles.indicatorText}
          textContent={I18n.t('gp.loginProgress')}
          overlayColor={'rgba(0, 0, 0, 0.5)'}
          customIndicator={
            <BallIndicator
              style={{zIndex: 1}}
              color={DefaultColors.mainColorToneDown}
              size={30}
            />
          }
        />
        <KeyboardAwareScrollView extraScrollHeight={63}>
          <TitleContainer>
            <Welcome>{I18n.t('gp.login')}</Welcome>
            <WelcomeDesc>{I18n.t('gp.login_welcome')}</WelcomeDesc>
          </TitleContainer>
          <InformationContainer>
            <FormContainer>
              <InputTitle>{I18n.t('gp.userId')}</InputTitle>
              <View style={{marginBottom: 10}}>
                <InputRow>
                  <InfoInput
                    autoFocus={true}
                    isInvalid={!(errors.userId === undefined)}
                    ref={register({name: 'userId'}, {required: true})}
                    onChangeText={text => setValue('userId', text, true)}
                  />
                </InputRow>
                {errors.userId && (
                  <ErrorContainer>
                    <ErrorText>
                      {errors.userId.message ||
                        (errors.userId.type === 'required' &&
                          I18n.t('gp.userId_error_required'))}
                    </ErrorText>
                    <Icon name="information" size={15} color="#c24a49" />
                  </ErrorContainer>
                )}
              </View>
              <InputTitle>
                {I18n.t('gp.password')} &nbsp;
                <DescriptionTitle>
                  {I18n.t('gp.rule_password')}
                </DescriptionTitle>
              </InputTitle>
              <View style={{marginBottom: 10}}>
                <InputRow>
                  <InfoInput
                    isInvalid={!(errors.password === undefined)}
                    secureTextEntry={true}
                    ref={register({name: 'password'}, {required: true})}
                    onChangeText={text => setValue('password', text, true)}
                  />
                </InputRow>
                {errors.password && (
                  <ErrorContainer>
                    <ErrorText>
                      {errors.password.message ||
                        (errors.password.type === 'required' &&
                          I18n.t('gp.password_error_required'))}
                    </ErrorText>
                    <Icon name="information" size={15} color="#c24a49" />
                  </ErrorContainer>
                )}
              </View>
              <ForgotContainer
                onPress={() => navigation.replace('ForgotPasswordPage')}>
                <ForgotText>{I18n.t('gp.forgot_password')}</ForgotText>
              </ForgotContainer>
            </FormContainer>
            <SubmitContainer>
              <SubmitButtonBackground
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[
                  DefaultColors.mainColor,
                  DefaultColors.mainColorToneDown,
                ]}>
                <SubmitButton activeOpacity={0.6} onPress={handleSubmitForm}>
                  <Text style={{color: 'white', fontSize: 18}}>
                    {I18n.t('gp.submit')}
                  </Text>
                </SubmitButton>
              </SubmitButtonBackground>
            </SubmitContainer>
            <SignupContainer>
              <SignupText>{I18n.t('gp.need_account')}</SignupText>
              <TouchableOpacity
                style={{marginLeft: 7}}
                onPress={() => navigation.replace('SignupPage')}>
                <SignupText style={{fontWeight: 'bold'}}>
                  {I18n.t('gp.signup')}
                </SignupText>
              </TouchableOpacity>
            </SignupContainer>
          </InformationContainer>
        </KeyboardAwareScrollView>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f4f4f4;
`;

const TitleContainer = styled.View`
  padding-top: ${Platform.OS === 'ios' ? '10' : '0'}px;
  padding-bottom: 20px;
  padding-horizontal: 25px;
  background-color: white;
`;

const InformationContainer = styled.View`
  display: flex;
  flex: 1;
  padding-horizontal: ${Platform.OS === 'ios' ? '20' : '20'}px;
  padding-vertical: 15px;
  background-color: #f4f4f4;
`;

const FormContainer = styled.View`
  margin-top: 10px;
  padding: 15px 20px 5px 20px;
  background-color: white;
  border-radius: 8px;
  shadow-color: #000000;
  shadow-radius: 3px;
  shadow-offset: 1px 2px;
  shadow-opacity: 0.1;
  elevation: 5;
`;

const Welcome = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const WelcomeDesc = styled.Text`
  margin-bottom: 5px;
`;

const InputRow = styled.View`
  margin-top: 5px;
  margin-bottom: 5px;
  flex-direction: row;
  align-items: center;
`;

const InputTitle = styled.Text`
  font-size: 13px;
  margin-right: 3px;
  margin-top: 5px;
  color: #676767;
`;

const DescriptionTitle = styled.Text`
  font-size: 10px;
  margin-right: 3px;
  margin-top: 5px;
  color: gray;
`;

const InfoInput = styled.TextInput`
  ${({inputWidth}) => (inputWidth > 0 ? `width: ${inputWidth}px;` : 'flex: 1;')}
  margin-top: 3px;
  padding-left: 3px;
  padding-top: ${Platform.OS === 'ios' ? '5' : '0'}px;
  padding-bottom: ${Platform.OS === 'ios' ? '13' : '8'}px;
  font-size: 14px;
  border-color: #d6d6d6;
  border-bottom-width: 1px;
  ${({isInvalid}) => isInvalid && 'border-color: #c24a49;'};
  color: black;
  font-size: 18px;
`;

const ForgotContainer = styled.TouchableOpacity`
  margin-top: 2px;
  margin-right: 2px;
  margin-bottom: 17px;
  display: flex;
  flex: 1;
  align-items: flex-end;
`;

const ForgotText = styled.Text`
  color: #888888;
`;

const SignupContainer = styled.View`
  margin-top: 2px;
  margin-right: 2px;
  margin-bottom: 17px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SignupText = styled.Text`
  color: #888888;
`;

const SubmitContainer = styled.View`
  width: 100%;
  margin-top: 20px;
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
  border-radius: 40px;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding-left: 2px;
  align-items: center;
  justify-content: space-between;
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: #c24a49;
`;

export default inject('memberStore', 'tokenStore')(
  observer(LoginPage),
);

const styles = StyleSheet.create({
  indicatorText: {
    zIndex: -1,
    top: 20,
    height: 120,
    paddingHorizontal: 20,
    paddingTop: 80,
    fontSize: 14,
    fontWeight: '400',
    borderRadius: 4,
    backgroundColor: DefaultColors.indicatorBackground,
    color: '#474747',
    overflow: 'hidden',
  },
});
