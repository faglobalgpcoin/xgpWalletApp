import React, {useState} from 'react';
import Toast from 'react-native-simple-toast';
import {
  Dimensions,
  Keyboard,
  Platform,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm} from 'react-hook-form';
import {inject, observer} from 'mobx-react';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'i18n-js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DotIndicator} from 'react-native-indicators';

import DefaultColors from '../common/style/DefaultColors';
import {
  changeUserPassword,
  checkIsExistUserAndEmail,
  checkVerifyCode,
  sendEmailCode,
} from '../api/Api';

const {width} = Dimensions.get('window');

const strings = {
  forgotPassword: {
    welcome: I18n.t('gp.forgot_password_title'),
    desc: I18n.t('gp.forgot_password_desc'),
  },
  resetPassword: {
    welcome: I18n.t('gp.reset_password_title'),
    desc: I18n.t('gp.reset_password_desc'),
  },
};

const NewPasswordComponent = ({register, setValue, errors}) => {
  return (
    <FormContainer>
      <InputTitle>{I18n.t('gp.new_password')}</InputTitle>
      <View style={{marginBottom: 10}}>
        <InputRow>
          <InfoInput
            defaultValue={''}
            autoFocus={true}
            secureTextEntry={true}
            isInvalid={!(errors.newPassword === undefined)}
            ref={register(
              {name: 'newPassword'},
              {required: true, minLength: 8},
            )}
            onChangeText={text => setValue('newPassword', text, true)}
          />
        </InputRow>
        {errors.newPassword && (
          <ErrorContainer>
            <ErrorText>
              {errors.newPassword &&
                errors.newPassword.type === 'required' &&
                I18n.t('gp.new_password_error_required')}
              {errors.newPassword &&
                errors.newPassword.type === 'minLength' &&
                I18n.t('gp.password_error_length')}
            </ErrorText>
            <Icon name="information" size={15} color="#c24a49" />
          </ErrorContainer>
        )}
      </View>
      <InputTitle>{I18n.t('gp.repeat_new_password')}</InputTitle>
      <View style={{marginBottom: 10}}>
        <InputRow>
          <InfoInput
            defaultValue={''}
            secureTextEntry={true}
            isInvalid={!(errors.repeatNewPassword === undefined)}
            ref={register(
              {name: 'repeatNewPassword'},
              {required: true, minLength: 8},
            )}
            onChangeText={text => setValue('repeatNewPassword', text, true)}
          />
        </InputRow>
        {errors.repeatNewPassword && (
          <ErrorContainer>
            <ErrorText>
              {errors.repeatNewPassword.message ||
                I18n.t('gp.enter_password_again')}
            </ErrorText>
            <Icon name="information" size={15} color="#c24a49" />
          </ErrorContainer>
        )}
      </View>
    </FormContainer>
  );
};

const ForgotPasswordPage = ({navigation}) => {
  const {
    register,
    getValues,
    setValue,
    triggerValidation,
    errors,
    setError,
    clearError
  } = useForm({
    submitFocusError: true,
  });

  const [emailCode, setEmailCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [userId, setUserId] = useState(false);
  const [isAfterSendEmail, setIsAfterSendEmail] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleEmailSend = async () => {
    let result;
    const {email, userId} = getValues();

    if (!email) {
      setError('email', 'required', I18n.t('gp.email_error_required'));
      return;
    }

    if (!userId) {
      setError('userId', 'required', I18n.t('gp.userId_error_required'));
    }

    result = await checkIsExistUserAndEmail({userId: userId, emailAddress: email});

    if (!result) {
      setError('email', 'apiError', I18n.t('gp.apiError'));
      return;
    }

    if (result.status === 'success') {
      setError('email', 'required', I18n.t('gp.email_error_find'));
      return;
    }

    setIsAfterSendEmail(true);

    result = await sendEmailCode({
      sendTypeKind: 'EMAIL_FOR_PASSWORD',
      emailAddress: email,
      phoneNumber: null,
    });

    if (!result) {
      setError('email', 'required', I18n.t('gp.apiError'));
      return;
    }

    if (result.status === 'fail') {
      setError('email', 'required', I18n.t('gp.apiError'));
      return;
    }

    setIsAfterSendEmail(false);
    setEmailCode(true);
    Toast.show(I18n.t('gp.send_code_message'));
  };

  const handleSubmitCheckAccount = async () => {
    let result;
    const {emailVerificationCode, email, userId} = getValues();

    result = await triggerValidation();
    if (!result) {
      return;
    }

    result = await checkVerifyCode({
      emailAddress: email,
      phoneNumber: null,
      code: emailVerificationCode,
    });

    if (!result) {
      setError('emailVerificationCode', 'apiError', I18n.t('gp.apiError'));
      return;
    }

    if (result.status === 'fail') {
      setError(
        'emailVerificationCode',
        'required',
        I18n.t('gp.please_check_code'),
      );
      return;
    }

    if (result.data !== true) {
      setError(
        'emailVerificationCode',
        'required',
        I18n.t('gp.please_check_code'),
      );
      return;
    }

    setVerifyCode(emailVerificationCode);
    setIsEmailVerified(true);
    clearError('emailVerificationCode');
  };

  const handleSubmitChangePassword = async () => {
    await triggerValidation();
    const {email, newPassword, repeatNewPassword, userId} = getValues();

    if (newPassword === undefined || repeatNewPassword === undefined) {
      return;
    }

    if (newPassword.length < 8) {
      setError(
        'repeatNewPassword',
        'minLength',
        I18n.t('gp.password_error_length'),
      );
      return;
    }

    if (newPassword !== repeatNewPassword) {
      setError(
        'repeatNewPassword',
        'notMatch',
        I18n.t('gp.password_error_notmatched'),
      );
      return;
    }

    const result = await changeUserPassword({
      userId: userId,
      code: verifyCode,
      emailAddress: email,
      newPassword: newPassword,
    });

    if (!result) {
      setError('repeatNewPassword', 'apiError', I18n.t('gp.apiError'));
      return;
    }

    if (result.status === 'fail') {
      setError(
        'repeatNewPassword',
        'notMatch',
        I18n.t('gp.password_change_error'),
      );
      return;
    }

    Toast.show(I18n.t('gp.find_password_complete'), Toast.LONG);

    setTimeout(() => {
      navigation.replace('LoginPage');
    }, 1000);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container contentInsetAdjustmentBehavior="automatic">
        <KeyboardAwareScrollView extraScrollHeight={63}>
          <TitleContainer>
            <Welcome>
              {isEmailVerified
                ? I18n.t('gp.reset_password_title')
                : I18n.t('gp.forgot_password_title')}
            </Welcome>
            <WelcomeDesc>
              {isEmailVerified
                ? I18n.t('gp.reset_password_desc')
                : I18n.t('gp.forgot_password_desc')}
            </WelcomeDesc>
          </TitleContainer>
          <InformationContainer>
            {!isEmailVerified ? (
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
                <InputTitle>{I18n.t('gp.email')}</InputTitle>
                <View style={{marginBottom: 10}}>
                  <InputRow>
                    <InfoInput
                      isInvalid={!(errors.email === undefined)}
                      keyboardType={'email-address'}
                      ref={register({name: 'email'}, {required: true})}
                      onChangeText={text => setValue('email', text, true)}
                    />
                  </InputRow>
                  {errors.email && (
                    <ErrorContainer>
                      <ErrorText>
                        {errors.email.message ||
                          (errors.email.type === 'required' &&
                            I18n.t('gp.email_error_required'))}
                      </ErrorText>
                      <Icon name="information" size={15} color="#c24a49" />
                    </ErrorContainer>
                  )}
                </View>
                <InputTitle>{I18n.t('gp.email_code')}</InputTitle>
                <View style={{marginBottom: 10}}>
                  <InputRow>
                    <InfoInput
                      isInvalid={!(errors.emailVerificationCode === undefined)}
                      ref={register(
                        {name: 'emailVerificationCode'},
                        {required: true},
                      )}
                      onChangeText={text =>
                        setValue('emailVerificationCode', text, true)
                      }
                    />
                    {emailCode === '' && (
                      <SendButton
                        onPress={() => handleEmailSend()}
                        disabled={isAfterSendEmail}>
                        {isAfterSendEmail ? (
                          <DotIndicator
                            color={DefaultColors.mainColor}
                            size={5}
                          />
                        ) : (
                          <SendText>{I18n.t('gp.send')}</SendText>
                        )}
                      </SendButton>
                    )}
                  </InputRow>
                  {errors.emailVerificationCode && (
                    <ErrorContainer hasButton={true}>
                      <ErrorText>
                        {errors.emailVerificationCode.message ||
                          I18n.t('gp.enter_verify')}
                      </ErrorText>
                      <Icon name="information" size={15} color="#c24a49" />
                    </ErrorContainer>
                  )}
                </View>
              </FormContainer>
            ) : (
              <NewPasswordComponent
                register={register}
                setValue={setValue}
                errors={errors}
              />
            )}
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
                  onPress={
                    isEmailVerified
                      ? handleSubmitChangePassword
                      : handleSubmitCheckAccount
                  }>
                  <Text style={{color: 'white', fontSize: 18}}>
                    {I18n.t('gp.submit')}
                  </Text>
                </SubmitButton>
              </SubmitButtonBackground>
            </SubmitContainer>
            <SignupContainer>
              <SignupText>{I18n.t('gp.need_an_account')}</SignupText>
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
  padding: 15px 20px;
  background-color: #f4f4f4;
`;

const FormContainer = styled.View`
  margin-top: 5px;
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
  margin-top: 23px;
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
  ${({hasButton}) => hasButton && 'padding-right: 85px;'};
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: #c24a49;
`;

export default inject()(observer(ForgotPasswordPage));
