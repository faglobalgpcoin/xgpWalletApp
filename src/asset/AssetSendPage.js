import React from "react";
import { Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, KeyboardAvoidingView, NativeModules, StatusBarIOS, Platform } from "react-native";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EIcon from "react-native-vector-icons/EvilIcons";
import Modal from "react-native-modal";
import I18n from "i18n-js";
import LinearGradient from "react-native-linear-gradient";

import styles from "./AssetSendPage.style";
import Colors from "../common/style/DefaultColors";
import { NumberWithCommas } from "../common/function/NumberUtil";
import { validateEmailFormat } from "../common/function/ValidateUtil";
import { checkVerifyCode, sendEmailCode, validateAddress } from "../api/Api";
import { DotIndicator } from "react-native-indicators";
import DefaultColors from "../common/style/DefaultColors";

const { StatusBarManager } = NativeModules;

export function timeConverter(UNIX_timestamp) {
	const a = new Date(UNIX_timestamp);
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const year = a.getFullYear();
	const month = months[a.getMonth()];
	const date = a.getDate();
	const hour = a.getHours();
	const min = a.getMinutes();
	const sec = a.getSeconds();
	const time = date + " " + month + " " + year + " ";
	// + hour + ':' + min + ':' + sec;
	return time;
}

@inject("assetSendStore", "tokenStore", "assetDetailStore", "assetStore", "memberStore", "settingStore")
@observer
class AssetSendPage extends React.Component {
	state = {
		statusBarHeight: 0,
		email: "",
		emailCode: "",
		pinCode: "",
		isEmailCode: false,
		isEmailVerified: false,
		isAfterSendEmail: false,
		emailError: null,
		emailCodeError: null,
		checkAddress: "",
	};

	async componentDidMount() {
		this.setState({ email: this.props.memberStore.user.emailAddress });
		const store = this.props.assetSendStore;
		const props = this.props.navigation.state.params;

		const assetInfo = {
			code: props.symbol,
			balance: this.props.tokenStore.token.balance,
			ethBalance: this.props.tokenStore.token.ethBalance,
		};

		this.props.memberStore.updateUserInfo();

		if (this.props.tokenStore.token.type === "luniverse" || this.props.tokenStore.token.type === "bitcoin") {
			console.log(this.props.tokenStore.transferFee);
			store.setTransferFee(this.props.tokenStore.transferFee[props.symbol.toLowerCase()]);
		} else {
			if (props.symbol === "ETH") store.setGasPrice(this.props.tokenStore.transferFee["eth"] * 21000);
			else if (props.symbol !== "ETH") store.setGasPrice(this.props.tokenStore.transferFee["eth"] * 100000);
		}

		store.setLockUpState(this.props.memberStore.user, this.props.tokenStore.isLockUpAllUser);

		store.setInitialStore(assetInfo, this.props.tokenStore, this.props.assetDetailStore, this.props.assetStore);

		//StatusBarManager.getHeight(statusBarFrameData => {
		this.setState({ statusBarHeight: StatusBarManager.HEIGHT });
		//});

		this.statusBarListener = StatusBarIOS.addListener("statusBarFrameWillChange", (statusBarData) => {
			this.setState({ statusBarHeight: statusBarData.frame.height });
		});
	}

	componentWillUnmount() {
		this.props.assetSendStore.reset();
		this.statusBarListener && this.statusBarListener.remove();
	}

	render() {
		const store = this.props.assetSendStore;
		const props = { code: this.props.tokenStore.token.symbol };
		let currentD = new Date();

		const userProps = this.props.memberStore.user;
		const isLockUpAllUser = this.props.tokenStore.isLockUpAllUser === "true";

		const lockUpState = {
			isLockUpAllUser: isLockUpAllUser,
			isLockUpUser: userProps.lock_up || false,
			lockUpRate: userProps.lock_up_rate || "0",
			lockUpPeriod: userProps.lock_up_period ? new Date(userProps.lock_up_period) : null,
		};

		const isLockUpPeriod = !isLockUpAllUser && userProps.lock_up && currentD < lockUpState.lockUpPeriod;

		const buttons = [
			...store.feeTypes.map((value, index) => {
				return {
					element: () => {
						return (
							<View style={styles.feeButton}>
								<Text style={store.isDisabledButtonGroup ? styles.feeTitleText : index === store.selectFeeIndex ? styles.selectedFeeTitleText : styles.feeTitleText}>{value.displayName}</Text>
								<Text style={store.isDisabledButtonGroup ? styles.feeDetail : index === store.selectFeeIndex ? [styles.selectedFeeDetail, { color: "white" }] : styles.feeDetail}>
									{value.time}
								</Text>
							</View>
						);
					},
				};
			}),
		];

		const sendEmail = async () => {
			console.log("=== sendEmail");
			let result;
			const { email } = this.state;

			if (!validateEmailFormat(email)) {
				setError("email", "format", I18n.t("gp.email_error_invalid"));
				return;
			}

			this.setState({ IsAfterSendEmail: true });
			result = await sendEmailCode({
				sendTypeKind: "EMAIL_FOR_SIGNUP",
				emailAddress: email,
				phoneNumber: null,
			});
			this.setState({ IsAfterSendEmail: false });

			if (!result) {
				this.setState({ emailError: I18n.t("gp.apiError") });
				return;
			}

			if (result.status === "fail") {
				this.setState({ emailError: I18n.t("gp.email_error_invalid") });
				return;
			}

			this.setState({ emailError: null });
			this.setState({ isEmailCode: true });
		};

		const validateEmail = async () => {
			console.log("=== validateEmail");
			const { emailCode, email } = this.state;
			let result;

			result = await checkVerifyCode({
				emailAddress: email,
				phoneNumber: null,
				code: emailCode,
			});

			if (!result) {
				this.setState({ emailCodeError: I18n.t("gp.apiError") });
				return;
			}

			if (result.status === "fail") {
				this.setState({ emailCodeError: I18n.t("gp.please_check_code") });
				return;
			}

			if (result.data !== true) {
				this.setState({ emailCodeError: I18n.t("gp.please_check_code") });
				return;
			}

			this.setState({ isEmailVerified: true });
			this.setState({ emailCodeError: null });
		};

		const handleEmailCodeChange = (e) => {
			this.setState({ emailCode: e });
		};

		const handlePinCodeChange = (e) => {
			this.setState({ pinCode: e });
		};

		const handleValidateAddress = async () => {
			let result;
			result = await validateAddress({
				type: this.props.tokenStore.token.type,
				address: store.form.toAddress,
			});

			if (result) this.setState({ checkAddress: result.data });
		};

		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<KeyboardAvoidingView behavior="height" keyboardVerticalOffset={44 + (this.state.statusBarHeight || 30)} style={[styles.container, { backgroundColor: Colors.mainColorToneDown }]}>
					{/*<Spinner*/}
					{/*  visible={store.isLoading}*/}
					{/*  textStyle={styles.indicatorText}*/}
					{/*  textContent={store.indicatorText}*/}
					{/*  overlayColor={'transparent'}*/}
					{/*  customIndicator={*/}
					{/*    <BallIndicator*/}
					{/*      style={{zIndex: 1}}*/}
					{/*      color={Colors.mainColorToneUp}*/}
					{/*      size={30}*/}
					{/*    />*/}
					{/*  }*/}
					{/*/>*/}
					<ScrollView style={styles.content}>
						<View style={styles.information}>
							<View style={{ flexDirection: "row" }}>
								<Text style={([styles.infoText], { fontSize: 18 })}>{`${I18n.t("gp.holding_amount")} : `}</Text>
								<View style={{ alignItems: "flex-end" }}>
									<View style={{ flexDirection: "row" }}>
										<BalanceHighlight />
										<BalanceText style={{ fontSize: 18, fontWeight: "bold" }}>{`${NumberWithCommas(this.props.tokenStore.token.balance, 0)} ${props.code}`}</BalanceText>

										{(lockUpState.isLockUpAllUser || lockUpState.isLockUpUser) && (
											<View
												style={{
													marginTop: -4,
													flexDirection: "row",
													alignItems: "center",
												}}
											>
												<EIcon name="lock" size={27} color={Colors.secondColorToneDown} />
												{!lockUpState.isLockUpAllUser && lockUpState.isLockUpUser && lockUpState.lockUpRate && <LockRateText>{lockUpState.lockUpRate}%</LockRateText>}
											</View>
										)}
									</View>
								</View>
							</View>
							{!lockUpState.isLockUpAllUser && lockUpState.isLockUpUser && lockUpState.lockUpPeriod && <LockUpPeriodText>~ {timeConverter(lockUpState.lockUpPeriod)}</LockUpPeriodText>}
						</View>
						{this.props.tokenStore.token.type === "ethereum" && this.props.tokenStore.token.symbol !== "ETH" && (
							<View style={styles.information2}>
								<View style={{ flexDirection: "row" }}>
									<Text style={[styles.infoText]}>{`${I18n.t("gp.holding_amount")} : `}</Text>
									<View style={{ alignItems: "flex-end" }}>
										<View style={{ flexDirection: "row" }}>
											<BalanceHighlight />
											<BalanceText>{`${NumberWithCommas(this.props.tokenStore.token.ethBalance, 0)} ETH`}</BalanceText>
										</View>
									</View>
								</View>
							</View>
						)}
						<InputTitleContainer first={true}>{I18n.t("gp.receive_to")}</InputTitleContainer>
						<View style={styles.addressContainer}>
							<View style={styles.addressInputContainer}>
								<TextInput
									value={store.form.toAddress}
									style={styles.addressInput}
									placeholder={I18n.t("gp.recipient_address")}
									onChangeText={store.handleChangeAddress}
									onBlur={store.handleBlurAddress}
									multiline={true}
									numberOfLines={2}
								/>
							</View>
							<TouchableOpacity style={styles.addressQrCode} onPress={() => store.handlePressQRCode(this.props.navigation)}>
								<Icon name="qrcode-scan" size={25} color={"black"} />
							</TouchableOpacity>
							<TouchableOpacity style={styles.boxButton} onPress={() => handleValidateAddress()}>
								<ButtonText>{I18n.t("asset.checkAddress")}</ButtonText>
							</TouchableOpacity>
						</View>
						{this.state.checkAddress === true ? (
							<ErrorContainer>
								<ErrorText>{I18n.t("asset.internalAddress")}</ErrorText>
								<Icon name="information" size={15} color="#c24a49" />
							</ErrorContainer>
						) : this.state.checkAddress === false ? (
							<ErrorContainer>
								<ErrorText>{I18n.t("asset.externalAddress")}</ErrorText>
								<Icon name="information" size={15} color="#c24a49" />
							</ErrorContainer>
						) : (
							<></>
						)}
						<InputTitleContainer>{I18n.t("gp.send_amount")}</InputTitleContainer>
						<View style={styles.amountContainer}>
							<View style={styles.amountInputContainer}>
								<TextInput
									style={styles.amountInput}
									value={store.form.amount + ""}
									placeholder={"0"}
									keyboardType={"decimal-pad"}
									onChangeText={store.handleChangeAmount}
									editable={this.props.tokenStore.token.type !== "luniverse"}
									onBlur={store.handleBlurAmount}
								/>
								<View style={styles.amountUnit}>
									<Text style={styles.unitText}>{props.code}</Text>
								</View>
							</View>
							{this.props.tokenStore.token.type === "luniverse" && (
								<View style={styles.amountQuickBtn}>
									<AmountQuickButtonWrap>
										<AmountQuickButton>
											<TouchableOpacity style={styles.amountButton} onPress={() => store.handleAmountButton(10000)}>
												<ButtonText>10,000</ButtonText>
											</TouchableOpacity>
											<TouchableOpacity style={styles.amountButton} onPress={() => store.handleAmountButton(30000)}>
												<ButtonText>30,000</ButtonText>
											</TouchableOpacity>
										</AmountQuickButton>
										<AmountQuickButton>
											<TouchableOpacity style={styles.amountButton} onPress={() => store.handleAmountButton(50000)}>
												<ButtonText>50,000</ButtonText>
											</TouchableOpacity>
											<TouchableOpacity style={styles.amountButton} onPress={() => store.handleAmountButton(100000)}>
												<ButtonText>100,000</ButtonText>
											</TouchableOpacity>
										</AmountQuickButton>
										<AmountQuickButton>
											<TouchableOpacity style={styles.amountButton} onPress={() => store.handleAmountButton("reset")}>
												<ButtonText>{I18n.t("gp.reset")}</ButtonText>
											</TouchableOpacity>
										</AmountQuickButton>
									</AmountQuickButtonWrap>
								</View>
							)}
							{/*<TouchableOpacity*/}
							{/*  style={styles.amountButtonContainer}*/}
							{/*  onPress={store.handlePressAmountMax}>*/}
							{/*  <View style={styles.amountButton}>*/}
							{/*    <Text style={[styles.maxText]}>{I18n.t('asset.max')}</Text>*/}
							{/*  </View>*/}
							{/*</TouchableOpacity>*/}
						</View>
						{/* 20200118 send add */}
						<InputTitleContainer>{I18n.t("gp.pinCode")}</InputTitleContainer>
						<View style={styles.pinContainer}>
							<View style={styles.pinInputContainer}>
								<TextInput
									style={styles.pinInput}
									value={this.state.pinCode}
									placeholder={I18n.t("gp.pinCode")}
									keyboardType={"number-pad"}
									onChangeText={handlePinCodeChange}
									maxLength={4}
									minLength={4}
								/>
							</View>
						</View>
						<InputTitleContainer>{I18n.t("gp.email")}</InputTitleContainer>
						<View style={styles.emailContainer}>
							<View style={styles.emailInputContainer}>
								<TextInput editable={false} style={styles.emailInput} value={this.props.memberStore.user.emailAddress} />
								{!this.state.isEmailVerified && (
									<TouchableOpacity style={styles.ecodeCode} onPress={sendEmail}>
										<ButtonContainer disabled={this.state.isAfterSendEmail} style={this.state.isEmailCode && { borderColor: "gray" }}>
											{this.state.isAfterSendEmail ? (
												<DotIndicator color={this.state.emailCode ? "gray" : DefaultColors.mainColor} size={5} />
											) : this.state.isEmailCode ? (
												<ButtonText style={{ color: "gray" }}>{I18n.t("gp.resend")}</ButtonText>
											) : (
												<ButtonText>{I18n.t("gp.send")}</ButtonText>
											)}
										</ButtonContainer>
									</TouchableOpacity>
								)}
							</View>
						</View>
						{this.state.emailError && (
							<ErrorContainer hasButton={true}>
								<ErrorText>{this.state.emailError || I18n.t("gp.email_error_required")}</ErrorText>
								<Icon name="information" size={15} color="#c24a49" />
							</ErrorContainer>
						)}
						<InputTitleContainer>{I18n.t("gp.email_code")}</InputTitleContainer>
						<View style={styles.ecodeContainer}>
							<View style={styles.ecodeInputContainer}>
								<TextInput
									style={styles.ecodeInput}
									// value={store.form.amount + ""}
									placeholder={"Code Number"}
									keyboardType={"decimal-pad"}
									onChangeText={handleEmailCodeChange}
									minLength={6}
									maxLength={6}
									// onBlur={store.handleBlurAmount}
								/>
								{this.state.isEmailVerified ? (
									<TouchableOpacity>
										<ButtonContainer>
											<ButtonText style={{ marginLeft: 15, marginRight: 10 }}>{I18n.t("gp.verified")}</ButtonText>
										</ButtonContainer>
									</TouchableOpacity>
								) : this.state.isEmailCode ? (
									<TouchableOpacity style={styles.ecodeCode} onPress={() => validateEmail()}>
										<ButtonContainer>
											<ButtonText>{I18n.t("gp.verify")}</ButtonText>
										</ButtonContainer>
									</TouchableOpacity>
								) : null}
							</View>
						</View>
						{this.state.emailCodeError && (
							<ErrorContainer>
								<ErrorText>{this.state.emailCodeError || I18n.t("gp.field_error_required")}</ErrorText>
								<Icon name="information" size={15} color="#c24a49" />
							</ErrorContainer>
						)}
						{
							<>
								<InputTitleContainer>{I18n.t("gp.payment_request")}</InputTitleContainer>
								<InfoContainer>
									<InfoRow style={{ borderBottomWidth: 0 }}>
										<KeyText>{I18n.t("gp.transfer_amount")}</KeyText>
										<ValueText>{(store.form.amount || 0) + ` ${props.code}`}</ValueText>
									</InfoRow>
									<InfoRow style={{ paddingBottom: 12, marginBottom: 8 }}>
										<KeyText>
											{this.props.tokenStore.token.type === "luniverse" || this.props.tokenStore.token.type === "bitcoin" ? I18n.t("gp.transfer_fee") : I18n.t("gp.gas_price")}
										</KeyText>
										<ValueText>
											{"+ " +
												(this.props.tokenStore.token.type === "luniverse" || this.props.tokenStore.token.type === "bitcoin"
													? this.props.tokenStore.transferFee[props.code.toLowerCase()] || 0
													: store.gasPrice) +
												` ${this.props.tokenStore.token.type === "luniverse" || this.props.tokenStore.token.type === "bitcoin" ? props.code : "ETH"}`}
										</ValueText>
									</InfoRow>
									<InfoRow style={{ marginBottom: 0, borderBottomWidth: 0 }}>
										<KeyText>{I18n.t("gp.total_amount")}</KeyText>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "center",
											}}
										>
											<TotalText>{store.totalAmount}</TotalText>
											<ValueText>{" " + props.code}</ValueText>
										</View>
									</InfoRow>
								</InfoContainer>
							</>
						}
					</ScrollView>
					<View style={styles.submitContainer}>
						{store.isValidateAlertShow && (
							<View style={styles.alertContainer} visible={store.isValidateAlertShow}>
								<Icon name="information" size={20} color="#c24a49" />
								<Text style={styles.alertText}> {store.alertMessage}</Text>
							</View>
						)}
						<LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[Colors.mainColor, Colors.mainColorToneDown]} style={styles.submitButton}>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() =>
									store.handlePressSendSubmit(
										this.props.memberStore.accessToken,
										this.props.tokenStore.token.symbol,
										this.props.tokenStore.token.type,
										this.state.pinCode,
										this.state.emailCode
									)
								}
								disabled={isLockUpAllUser || isLockUpPeriod || store.isAfterTransfer || !store.invalidateSubmit || !this.state.isEmailVerified}
								style={[
									styles.submitButton,
									{
										backgroundColor: !isLockUpAllUser && !isLockUpPeriod && store.invalidateSubmit && this.state.isEmailVerified ? "transparent" : "#bfbfbf",
									},
								]}
							>
								<Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{I18n.t("gp.send")}</Text>
							</TouchableOpacity>
						</LinearGradient>
					</View>

					<Modal isVisible={store.isVisibleSendFailDialog}>
						<View style={styles.modalContainer}>
							<View style={styles.modalCloseButton}>
								<TouchableOpacity onPress={store.setIsVisibleSendFailDialogFalse}>
									<EIcon name="close" size={25} color="#bbb" />
								</TouchableOpacity>
							</View>
							<View style={styles.modalHeader}>
								<Icon name={"progress-alert"} size={50} color={Colors.secondColor} />
								<Text style={styles.modalHeaderText}>{I18n.t("gp.fail")}</Text>
							</View>
							<View style={styles.modalContent}>
								<Text style={styles.modalDetailText}>{I18n.t("gp.failed_send_request_desc")}</Text>
							</View>
							<TouchableOpacity onPress={store.setIsVisibleSendFailDialogFalse}>
								<View style={[styles.modalButton, { backgroundColor: "white" }]}>
									<Text style={{ color: Colors.mainColorToneDown, fontSize: 18 }}>{I18n.t("gp.confirm")}</Text>
								</View>
							</TouchableOpacity>
						</View>
					</Modal>

					<Modal isVisible={store.isVisibleSendSuccessDialog} onModalHide={() => store.handleSendSuccessModalHide(this.props.navigation, this.props.tokenStore, this.props.memberStore)}>
						<View style={styles.modalContainer}>
							<View style={styles.modalCloseButton}>
								<TouchableOpacity onPress={store.setIsVisibleSendSuccessDialogFalse}>
									<EIcon name="close" size={25} color="#bbb" />
								</TouchableOpacity>
							</View>
							<View style={styles.modalHeader}>
								<Icon name={"progress-check"} size={50} color={Colors.mainColor} />
								<Text style={styles.modalHeaderText}>{I18n.t("gp.success")}</Text>
							</View>
							<View style={styles.modalContent}>
								<Text style={styles.modalDetailText}>{I18n.t("gp.complete_send_request_desc")}</Text>
							</View>
							<TouchableOpacity onPress={store.setIsVisibleSendSuccessDialogFalse}>
								<View style={[styles.modalButton, { backgroundColor: "white" }]}>
									<Text style={{ color: Colors.mainColorToneDown, fontSize: 18 }}>{I18n.t("gp.confirm")}</Text>
								</View>
							</TouchableOpacity>
						</View>
					</Modal>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		);
	}
}

AssetSendPage.navigationOptions = ({ navigation }) => {
	return {
		title: I18n.t("gp.send_token", { name: navigation.state.params.symbol }),
		headerTitleStyle: {
			color: "black",
			fontWeight: "bold",
		},
		headerStyle: {
			backgroundColor: "white",
		},
	};
};

const InputTitle = styled.Text`
	margin-left: 2px;
	font-size: 16px;
	font-weight: bold;
	color: ${Colors.darkGray};
`;

const InputTitleContainer = styled(InputTitle)`
	margin-top: ${Platform.OS === "ios" ? "20" : "10"}px;
	${({ first }) => first && "margin-top: 5px"};
	font-size: 23px;
`;

const BalanceText = styled.Text`
	font-size: 14px;
	color: ${Colors.mainColor};
`;

const LockRateText = styled.Text`
	font-size: 16px;
	color: ${Colors.secondColorToneDown};
	font-weight: bold;
`;

const LockUpPeriodText = styled.Text`
	margin-top: 5px;
	color: ${Colors.secondColorToneDown};
`;

const BalanceHighlight = styled.View`
	background-color: rgba(56, 25, 15, 0);
	position: absolute;
	right: 0px;
	bottom: 0px;
	width: 100%;
	height: 5px;
`;

const InfoContainer = styled.View`
	margin-top: 15px;
	background-color: ${Colors.lightToneDownGray};
	border-radius: 7px;
	padding: 15px 15px 20px 15px;
`;

const InfoRow = styled.View`
	padding: 0 5px;
	margin-top: 5px;
	margin-bottom: 10px;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	align-items: center;
	border-bottom-width: 1px;
	border-bottom-color: ${Colors.gray};
`;

const KeyText = styled.Text`
	font-size: 14px;
	color: gray;
`;

const TotalText = styled.Text`
	font-size: 18px;
	font-weight: bold;
	color: ${Colors.mainColorToneDown};
`;

const ValueText = styled.Text`
	font-size: 18px;
`;

const ButtonContainer = styled.View``;
const ButtonText = styled.Text`
	font-size: 14px;
	color: #fefefe;
	text-align: center;
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

const AmountQuickButtonWrap = styled.View`
	flex-direction: column;
	width: 100%;
`;
const AmountQuickButton = styled.View`
	flex-direction: row;
`;
export default AssetSendPage;
