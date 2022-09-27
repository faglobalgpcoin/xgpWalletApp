import React, { useState } from "react";
import { Dimensions, Keyboard, Platform, Text, View, TouchableWithoutFeedback } from "react-native";
import { DotIndicator } from "react-native-indicators";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm } from "react-hook-form";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import LinearGradient from "react-native-linear-gradient";
import I18n from "i18n-js";
import Toast from "react-native-simple-toast";
import ImagePicker from "react-native-image-picker";

import { checkIsExistPhoneNumber, checkIsExistUser, checkVerifyCode, sendCode, sendEmailCode, signupUser } from "../api/Api";
import { validateEmailFormat } from "../common/function/ValidateUtil";
import DefaultColors from "../common/style/DefaultColors";
import { trimBlankSpace } from "../common/function/StringUtil";

const { width } = Dimensions.get("window");

const SignupPage = ({ navigation }) => {
	const { register, getValues, setValue, triggerValidation, errors, setError, clearError } = useForm();
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [isAfterSendEmail, setIsAfterSendEmail] = useState(false);
	const [emailCode, setEmailCode] = useState("");
	const [isMobileVerified, setIsMobileVerified] = useState(false);
	const [isAfterSendMobile, setIsAfterSendMobile] = useState(false);
	const [mobileCode, setMobileCode] = useState("");
	const [idCard, setIdCard] = useState("");

	const handleChoosePhoto = () => {
    const options = {
      noData: true,
    }

    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        let path = response.uri;
        if (Platform.OS === "ios") {
          path = "~" + path.substring(path.indexOf("/Documents"));
        }
        if (!response.fileName) response.fileName = path.split("/").pop();
        setValue('idCard', response.fileName, true);
        setIdCard(response);
      }
    })
  }

	const sendEmail = async () => {
		console.log("=== sendEmail");
		let result;
		const { email } = getValues();

		if (!validateEmailFormat(email)) {
			setError("email", "format", I18n.t("gp.email_error_invalid"));
			return;
		}

		setIsAfterSendEmail(true);
		result = await sendEmailCode({
			sendTypeKind: "EMAIL_FOR_SIGNUP",
			emailAddress: email,
			phoneNumber: null,
		});
		setIsAfterSendEmail(false);

		if (!result) {
			setError("email", "apiError", I18n.t("gp.apiError"));
			return;
		}

		if (result.status === "fail") {
			setError("email", "format", I18n.t("gp.email_error_invalid"));
			return;
		}

		clearError("email");
		setEmailCode(true);
	};

	const validateEmail = async () => {
		console.log("=== validateEmail");
		const { emailVerificationCode, email } = getValues();
		let result;

		result = await checkVerifyCode({
			emailAddress: email,
			phoneNumber: null,
			code: emailVerificationCode,
		});

		if (!result) {
			setError("emailVerificationCode", "apiError", I18n.t("gp.apiError"));
			return;
		}

		if (result.status === "fail") {
			setError("emailVerificationCode", "invalid", I18n.t("gp.please_check_code"));
			return;
		}

		if (result.data !== true) {
			setError("emailVerificationCode", "invalid", I18n.t("gp.please_check_code"));
			return;
		}

		setIsEmailVerified(true);
		clearError("emailVerificationCode");
	};

	const sendSMS = async () => {
		console.log("=== sendSMS");
		let result;
		const { nationalCode, mobile } = getValues();

		let phoneNumber = nationalCode + mobile;
		let isHasZeroAtFront = phoneNumber.substring(0, 5) === "82010";
		// console.log(phoneNumber);

		if (isHasZeroAtFront) {
			phoneNumber = nationalCode + mobile.slice(1);
		}

		setIsAfterSendMobile(true);
		result = await sendCode({
			sendTypeKind: "SMS",
			phoneNumber: phoneNumber,
		});
		setIsAfterSendMobile(false);

		if (!result) {
			setError("nationalCode", "apiError", I18n.t("gp.apiError"));
			return;
		}

		if (result.status === "fail") {
			setError("nationalCode", "format", I18n.t("gp.email_error_invalid"));
			return;
		}

		setMobileCode(true);
		clearError("nationalCode");
	};

	const validateSMS = async () => {
		console.log("=== validateSMS");
		let result;
		const { nationalCode, mobile, mobileVerificationCode } = getValues();

		let phoneNumber = nationalCode + mobile;
		let isHasZeroAtFront = phoneNumber.substring(0, 5) === "82010";
		// console.log(phoneNumber);

		if (isHasZeroAtFront) {
			phoneNumber = nationalCode + mobile.slice(1);
		}

		result = await checkVerifyCode({
			emailAddress: null,
			phoneNumber: phoneNumber,
			code: mobileVerificationCode,
		});

		if (!result) {
			setError("mobileVerificationCode", "apiError", I18n.t("gp.apiError"));
			return;
		}

		if (result.status === "fail") {
			setError("mobileVerificationCode", "invalid", I18n.t("gp.please_check_code"));
			return;
		}

		if (result.data !== true) {
			setError("mobileVerificationCode", "invalid", I18n.t("gp.please_check_code"));
			return;
		}

		setIsMobileVerified(true);
		clearError("emailVerificationCode");
	};

	const handleSubmitForm = async () => {
		let result;
		const data = getValues();
		result = await triggerValidation();

		console.log(data);

		if (data.password.length < 8) {
			setError("password", "minLength", I18n.t("gp.password_error_length"));
			return;
		}

    if (data.securityPassword.length < 4) {
      setError("securityPassword", "minLength", t("gp.security_password_error_length"));
      return;
    }

		if (!result) {
			return;
		}

		if (!isEmailVerified) {
			setError("emailVerificationCode", "required", I18n.t("gp.verify_email"));
			return;
		}

		if (data.password !== data.passwordConfirm) {
			setError("passwordConfirm", "notMatch", I18n.t("gp.password_error_notmatched"));
			return;
		}

    if (data.securityPassword !== data.securityPasswordConfirm) {
      setError("passwordConfirm", "notMatch", I18n.t("gp.security_password_error_notmatched"));
      return;
    }

		let phoneNumber = data.nationalCode + data.mobile;
		let isHasZeroAtFront = phoneNumber.substring(0, 5) === "82010";

		if (isHasZeroAtFront) {
			phoneNumber = data.nationalCode + data.mobile.slice(1);
		}

		const imageData = {
      uri: Platform.OS === "android" ? idCard.uri : idCard.uri.replace("file://", ""),
      type: idCard.type,
      name: idCard.fileName,
    }

    const formData = new FormData();
    formData.append('userId', trimBlankSpace(data.userId));
    formData.append('emailAddress', trimBlankSpace(data.email));
    formData.append('password', trimBlankSpace(data.password));
    formData.append('pinCode', trimBlankSpace(data.securityPassword));
    formData.append('name', trimBlankSpace(data.name));
    formData.append('phoneNumber', trimBlankSpace(phoneNumber));
    formData.append('emailCode', trimBlankSpace(data.emailVerificationCode));
    //formData.append('mobileCode', trimBlankSpace(data.mobileVerificationCode));
    formData.append('userPic', imageData);

    result = await signupUser(formData);

		if (!result) {
			setError("email", "apiError", I18n.t("gp.apiError"));
			return;
		}

		if (result.status === "fail") {
			setError("email", "exist", I18n.t("gp.check_already_signedup"));
			return;
		}

		if (result.status === "success") {
			Toast.show(I18n.t("gp.signup_complete"), Toast.LONG);

			setTimeout(() => {
				navigation.replace("LoginPage");
			}, 1000);
			return;
		}
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Container contentInsetAdjustmentBehavior="automatic">
				<KeyboardAwareScrollView extraScrollHeight={63} enableOnAndroid={true}>
					<TitleContainer>
						<Welcome>{I18n.t("gp.signup")}</Welcome>
						<WelcomeDesc>{I18n.t("gp.welcome_fill_info")}</WelcomeDesc>
					</TitleContainer>
					<InformationContainer>
						<FormContainer>
              {/* id add */}
              <InputTitle>{I18n.t("gp.userId")}</InputTitle>
              <View style={{ marginBottom: 10 }}>
                <InputRow>
                  <InfoInput
                    isInvalid={!(errors.userId === undefined)}
                    autoFocus={true}
                    ref={register({ name: "userId" }, { required: true })}
                    onChangeText={(text) => setValue("userId", text, true)} />
                </InputRow>
                {errors.userId && (
                  <ErrorContainer>
                    <ErrorText>{I18n.t("gp.userId_error_required")}</ErrorText>
                    <Icon name="information" size={15} color="#c24a49" />
                  </ErrorContainer>
                )}
              </View>
              {/* id add end */}
							<InputTitle>{I18n.t("gp.email")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
										editable={!isEmailVerified}
										isInvalid={!(errors.email === undefined)}
										ref={register({ name: "email" }, { required: true })}
										onChangeText={(text) => setValue("email", text, true)}
									/>
									{!isEmailVerified && (
										<SendButton disabled={isAfterSendEmail} onPress={sendEmail} style={emailCode && { borderColor: "gray" }}>
											{isAfterSendEmail ? (
												<DotIndicator color={emailCode ? "gray" : DefaultColors.mainColor} size={5} />
											) : emailCode ? (
												<SendText style={{ color: "gray" }}>{I18n.t("gp.resend")}</SendText>
											) : (
												<SendText>{I18n.t("gp.send")}</SendText>
											)}
										</SendButton>
									)}
								</InputRow>
								{errors.email && (
									<ErrorContainer hasButton={true}>
										<ErrorText>{errors.email.message || I18n.t("gp.email_error_required")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							<InputTitle>{I18n.t("gp.email_code")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
										editable={!isEmailVerified}
										keyboardType={"number-pad"}
										maxLength={6}
										isInvalid={!(errors.emailVerificationCode === undefined)}
										ref={register({ name: "emailVerificationCode" }, { required: true })}
										onChangeText={(text) => setValue("emailVerificationCode", text, true)}
									/>
									{isEmailVerified ? (
										<SendText style={{ marginLeft: 15, marginRight: 10 }}>{I18n.t("gp.verified")}</SendText>
									) : emailCode ? (
										<SendButton onPress={() => validateEmail()}>
											<SendText>{I18n.t("gp.verify")}</SendText>
										</SendButton>
									) : null}
								</InputRow>
								{errors.emailVerificationCode && (
									<ErrorContainer>
										<ErrorText>{errors.emailVerificationCode.message || I18n.t("gp.field_error_required")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							<InputTitle>
								{I18n.t("gp.password")} &nbsp;
								<DescriptionTitle>{I18n.t("gp.rule_password")}</DescriptionTitle>
							</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
										isInvalid={!(errors.password === undefined)}
										secureTextEntry={true}
										ref={register(
											{ name: "password" },
											{
												required: true,
												minLength: 8,
												pattern: /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-=])(?=.{8,})/,
											}
										)}
										onChangeText={(text) => setValue("password", text, true)}
									/>
								</InputRow>
								{errors.password && (
									<ErrorContainer>
										<ErrorText>{I18n.t("gp.password_error_length")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							<InputTitle>{I18n.t("gp.repeat_password")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
										isInvalid={!(errors.passwordConfirm === undefined)}
										secureTextEntry={true}
										ref={register({ name: "passwordConfirm" })}
										onChangeText={(text) => setValue("passwordConfirm", text, true)}
									/>
								</InputRow>
								{errors.passwordConfirm && (
									<ErrorContainer>
										<ErrorText>{errors.passwordConfirm.message}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							{/* pin password */}
							<InputTitle>
                {I18n.t("gp.pinCode")}
								<DescriptionTitle> {I18n.t("gp.onlyNumbers")}</DescriptionTitle>
							</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
                    keyboardType={"number-pad"}
										isInvalid={!(errors.securityPassword === undefined)}
										secureTextEntry={true}
                    maxLength={4}
                    minLength={4}
										ref={register(
											{ name: "securityPassword" },
											{
												required: true,
												maxLength: 4,
                        minLength: 4
											}
										)}
										onChangeText={(text) => setValue("securityPassword", text, true)}
									/>
								</InputRow>
								{errors.securityPassword && (
									<ErrorContainer>
										<ErrorText>{I18n.t("gp.securityPassword_error_length")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							<InputTitle>{I18n.t("gp.repeatPinCode")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
                    keyboardType={"number-pad"}
										isInvalid={!(errors.passwordConfirm === undefined)}
										secureTextEntry={true}
                    maxLength={4}
										ref={register({ name: "securityPasswordConfirm" })}
										onChangeText={(text) => setValue("securityPasswordConfirm", text, true)}
									/>
								</InputRow>
								{errors.securityPasswordConfirm && (
									<ErrorContainer>
										<ErrorText>{errors.securityPasswordConfirm.message}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							{/* pin password end */}
							<InputTitle>{I18n.t("gp.name")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput isInvalid={!(errors.name === undefined)} ref={register({ name: "name" }, { required: true })} onChangeText={(text) => setValue("name", text, true)} />
								</InputRow>
								{errors.name && (
									<ErrorContainer>
										<ErrorText>{I18n.t("gp.name_error_required")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							{/* id card */}
              <InputTitle>{I18n.t("gp.idCard")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput editable={false} value={idCard.fileName}
                   ref={ register({ name: "idCard" }, { required: true })}/>
									<SendButton onPress={handleChoosePhoto} >
										<SendText>{I18n.t("gp.choose")}</SendText>
									</SendButton>
								</InputRow>
								{errors.idCard && (
									<ErrorContainer hasButton={true}>
										<ErrorText>{errors.idCard.message || I18n.t("gp.idCard_error_required")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							{/* id card end */}
							<InputTitle>{I18n.t("gp.mobile")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									{/*<CodeText>+</CodeText>*/}
									<InfoInput
										isInvalid={errors.nationalCode || errors.mobile}
										placeholder={"Country number"}
										inputWidth={70}
										maxLength={3}
										keyboardType={"number-pad"}
										style={{ marginRight: 15, fontSize: 12 }}
										ref={register({ name: "nationalCode" }, { required: true, maxLength: 3 })}
										onChangeText={(text) => setValue("nationalCode", text, true)}
									/>
									<InfoInput
										isInvalid={errors.nationalCode || errors.mobile}
										style={{ paddingLeft: 5, fontSize: 12 }}
										placeholder={"Phone number"}
										keyboardType={"number-pad"}
										ref={register({ name: "mobile" }, { required: true })}
										onChangeText={(text) => setValue("mobile", text, true)}
									/>
								</InputRow>
								{(errors.nationalCode || errors.mobile) && (
									<ErrorContainer hasButton={true}>
										<ErrorText>{(errors.nationalCode && errors.nationalCode.message) || (errors.mobile && errors.mobile.message) || I18n.t("gp.phonenumber_error_required")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
						</FormContainer>
						<SubmitContainer>
							<SubmitButtonBackground start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}>
								<SubmitButton
									activeOpacity={0.6}
									// disabled={isSubmitDisabled}
									// isChanged={memberInfoFormStore.isChanged}
									onPress={() => handleSubmitForm()}
								>
									{/*{memberInfoFormStore.isLoading ? (*/}
									{/*  <MaterialIndicator*/}
									{/*    style={{zIndex: 1}}*/}
									{/*    color={'white'}*/}
									{/*    size={30}*/}
									{/*  />*/}
									{/*) : (*/}
									<Text style={{ color: "white", fontSize: 18 }}>{I18n.t("gp.submit")}</Text>
									{/*)}*/}
								</SubmitButton>
							</SubmitButtonBackground>
						</SubmitContainer>
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
	padding-top: ${Platform.OS === "ios" ? "10" : "0"}px;
	padding-bottom: 20px;
	padding-horizontal: 25px;
	background-color: white;
`;

const InformationContainer = styled.View`
	display: flex;
	flex: 1;
	padding-horizontal: ${Platform.OS === "ios" ? "20" : "20"}px;
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

const CodeText = styled.Text`
	position: absolute;
	top: 6px;
	left: 10px;
	font-size: 17px;
`;

const InfoInput = styled.TextInput`
	${({ inputWidth }) => (inputWidth > 0 ? `width: ${inputWidth}px;` : "flex: 1;")}
	margin-top: 3px;
	padding-left: 3px;
	padding-top: ${Platform.OS === "ios" ? "5" : "0"}px;
	padding-bottom: ${Platform.OS === "ios" ? "13" : "8"}px;
	border-color: #d6d6d6;
	border-bottom-width: 1px;
	color: black;
	font-size: 17px;
	${({ isInvalid }) => isInvalid && "border-color: #c24a49;"};
`;

const SendButton = styled.TouchableOpacity`
	height: 35px;
	width: 70px;
	border-radius: 25px;
	border: 1px solid ${DefaultColors.mainColorToneDown};
	align-items: center;
	justify-content: center;
	margin-left: 10;
`;

const SendText = styled.Text`
	color: ${DefaultColors.mainColorToneDown};
`;

const SubmitContainer = styled.View`
	width: 100%;
	margin-top: 20px;
	align-items: center;
	bottom: 0px;
`;

const ErrorContainer = styled.View`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	${({ hasButton }) => hasButton && "padding-right: 85px;"};
`;

const ErrorText = styled.Text`
	font-size: 12px;
	color: #c24a49;
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

export default inject()(observer(SignupPage));
