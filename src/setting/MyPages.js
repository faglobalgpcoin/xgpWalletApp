import React, {useEffect, useState} from "react";
// import { Keyboard, View, TouchableWithoutFeedback, Image, AsyncStorage } from "react-native";
import { Dimensions, Keyboard, Platform, Text, View, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components";
import I18n from "../config/i18n";
import i18n from "i18n-js";
import Icon from "react-native-vector-icons/Feather";
import { inject, observer } from "mobx-react";
import images from "./image/images";
import DefaultColors from "../common/style/DefaultColors";
import RemoveHeaderShadow from "../common/style/RemoveHeaderShadow";
import { DotIndicator } from "react-native-indicators";
import Toast from "react-native-simple-toast";

import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
const { width } = Dimensions.get("window");
import { validateEmailFormat } from "../common/function/ValidateUtil";
import { checkVerifyCode, sendEmailCode, modifyUser } from "../api/Api";
import { trimBlankSpace } from "../common/function/StringUtil";

const MyPages = ({ navigation, memberStore }) => {
	const { register, getValues, setValue, triggerValidation, errors, setError, clearError } = useForm();
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [isAfterSendEmail, setIsAfterSendEmail] = useState(false);
	const [emailCode, setEmailCode] = useState("");
	const [isMobileVerified, setIsMobileVerified] = useState(false);
	const [isAfterSendMobile, setIsAfterSendMobile] = useState(false);
	const [mobileCode, setMobileCode] = useState("");

	useEffect(() => {
	  setValue("email", memberStore.user.emailAddress);
	  setValue("mobile", memberStore.user.phoneNumber);
	  setValue("password", "");
	  setValue("passwordConfirm", "");
	  setValue("securityPassword", "");
	  setValue("securityPasswordConfirm", "");
	  setValue("userId", memberStore.user.userId);
	  setValue("name", memberStore.user.name);
  }, []);

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
			emailAddress: memberStore.user.emailAddress,
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

	const handleSubmitForm = async () => {
		let result;
		const data = getValues();
		result = await triggerValidation();

		if (!isEmailVerified) {
			setError("emailVerificationCode", "required", I18n.t("gp.verify_email"));
			return;
		}

    if (data.password !== "" && data.password.length < 8) {
      setError("password", "minLength", I18n.t("gp.password_error_length"));
      return;
    }

    if (data.password !== data.passwordConfirm) {
      setError("passwordConfirm", "notMatch", I18n.t("gp.password_error_notmatched"));
      return;
    }

    if (data.securityPassword !== "" && data.securityPassword.length < 4) {
      setError("securityPassword", "minLength", I18n.t("gp.security_password_error_length"));
      return;
    }

    if (data.securityPassword !== data.securityPasswordConfirm) {
      setError("securityPasswordConfirm", "notMatch", I18n.t("gp.security_password_error_notmatched"));
      return;
    }

    if (data.password !== data.passwordConfirm) {
      setError("passwordConfirm", "notMatch", I18n.t("gp.password_error_notmatched"));
      return;
    }

		if (data.securityPassword !== data.securityPasswordConfirm) {
			setError("securityPasswordConfirm", "notMatch", I18n.t("gp.security_password_error_notmatched"));
			return;
		}

    if (!result) {
      return;
    }

		result = await modifyUser(memberStore.accessToken, {
			emailAddress: trimBlankSpace(data.email),
			password: trimBlankSpace(data.password),
      pinCode: trimBlankSpace(data.securityPassword),
			emailCode: trimBlankSpace(data.emailVerificationCode)
		});

		if (!result) {
			setError("email", "apiError", I18n.t("gp.apiError"));
			return;
		}

		if (result.status === "fail") {
			setError("email", "exist", I18n.t("gp.modify_failed"));
			console.log(result);
			return;
		}

		if (result.status === "success") {
			Toast.show(I18n.t("gp.modify_complete"), Toast.LONG);
			memberStore.updateUserInfo();
      navigation.navigate("SettingPage");
		}
	};
	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Container contentInsetAdjustmentBehavior="automatic">
				<KeyboardAwareScrollView extraScrollHeight={63} enableOnAndroid={true}>
					<TitleContainer>
						<Welcome>My Info Edit</Welcome>
					</TitleContainer>
					<InformationContainer>
						<FormContainer>
							<InputTitle>E-mail</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
                    editable={false}
										isInvalid={!(errors.email === undefined)}
										ref={register({ name: "email" }, { required: true })}
										onChangeText={(text) => setValue("email", text, true)}
                    value={memberStore.user.emailAddress}
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
											{ name: "securityPassword" }
										)}
										onChangeText={(text) => setValue("securityPassword", text, true)}
									/>
								</InputRow>
								{errors.securityPassword && (
									<ErrorContainer>
										<ErrorText>{I18n.t("gp.security_password_error_length")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							<InputTitle>{I18n.t("gp.repeatPinCode")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
										isInvalid={!(errors.securityPasswordConfirm === undefined)}
										secureTextEntry={true}
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
									<InfoInput
                   editable={false}
                   isInvalid={!(errors.name === undefined)} ref={register({ name: "name" })} onChangeText={(text) => setValue("name", text, true)}
                  defaultValue={memberStore.user.name} />
								</InputRow>
								{errors.name && (
									<ErrorContainer>
										<ErrorText>{I18n.t("gp.name_error_required")}</ErrorText>
										<Icon name="information" size={15} color="#c24a49" />
									</ErrorContainer>
								)}
							</View>
							{/* id add */}
							<InputTitle>{I18n.t("gp.userId")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
										editable={false}
										isInvalid={!(errors.userId === undefined)}
										ref={register({ name: "userId" })}
										onChangeText={(text) => setValue("userId", text, true)}
                    value={memberStore.user.userId}
									/>
								</InputRow>
							</View>
							{/* id add end */}
							<InputTitle>{I18n.t("gp.mobile")}</InputTitle>
							<View style={{ marginBottom: 10 }}>
								<InputRow>
									<InfoInput
										// editable={!isMobileVerified}
										editable={false}
										isInvalid={errors.mobile}
										style={{ paddingLeft: 5, fontSize: 12 }}
										placeholder={"Phone number"}
										keyboardType={"number-pad"}
										ref={register({ name: "mobile" }, { required: true })}
										onChangeText={(text) => setValue("mobile", text, true)}
                    value={memberStore.user.phoneNumber}
									/>
								</InputRow>
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
									<Text style={{ color: "white", fontSize: 18 }}>Edit</Text>
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

MyPages.navigationOptions = ({ screenProps }) => {
	return {
		title: "", // screenProps.i18Nav.t('gp.change_language'),
		headerStyle: RemoveHeaderShadow,
	};
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
	margin-left: 10px;
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

export default inject("memberStore")(observer(MyPages));
