import React, { useMemo, useEffect, useState } from "react";
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import I18n from "i18n-js";
import DefaultColors from "../common/style/DefaultColors";
import { NumberWithCommas } from "../common/function/NumberUtil";
import styles from "./AssetSendPage.style";
import EIcon from "react-native-vector-icons/EvilIcons";
import { timeConverter } from "./AssetSendPage";
import Icon from "react-native-vector-icons/Feather";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import BigNumber from "bignumber.js";
import RemoveHeaderShadow from "../common/style/RemoveHeaderShadow";
import Modal from "react-native-modal";
import { sendToAdmin } from "../api/Api";

const TapickExchangePage = ({
  navigation,
  assetStore,
  settingStore,
  memberStore,
}) => {
  const {
    tokenPriceByCurrency,
    tokenCurrency,
    tapickExchangeFee,
  } = settingStore;
  const [lockUpState, setLockUpState] = useState([]);
  const [isAfterTransfer, setIsAfterTransfer] = useState(false);
  const [isVisibleSuccessDialog, setIsVisibleSuccessDialog] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [amount, setAmount] = useState("0");

  let balanceBN = new BigNumber(assetStore.balance);
  let feeBN = new BigNumber(tapickExchangeFee);

  const CODE = "DMW";

  const totalAmount = useMemo(
    () => BigNumber.sum(amount || "0", tapickExchangeFee || "0").toString(),
    [amount, tapickExchangeFee]
  );
  const conversionPrice = useMemo(
    () => NumberWithCommas(tokenPriceByCurrency * amount),
    [amount, tokenPriceByCurrency]
  );

  useEffect(() => {
    let currentD = new Date();

    setLockUpState({
      isLockUpAllUser: settingStore.isLockUpAllUser === "true",
      isLockUpUser: memberStore.user.lockUp || false,
      lockUpRate: memberStore.user.lockUpRate || "0",
      lockUpPeriod: memberStore.user.lockUpPeriod
        ? new Date(memberStore.user.lockUpPeriod)
        : null,
      isLockUpPeriod:
        settingStore.isLockUpAllUser === "false" &&
        memberStore.user.lockUp &&
        currentD < new Date(memberStore.user.lockUpPeriod),
    });
  }, [
    memberStore.user.lockUp,
    memberStore.user.lockUpPeriod,
    memberStore.user.lockUpRate,
    settingStore.isLockUpAllUser,
  ]);

  const handleBlurAmount = () => {
    let amountBN = new BigNumber(amount);

    if (!lockUpState.isLockUpAllUser && lockUpState.isLockUpUser) {
      balanceBN = balanceBN.multipliedBy((100 - lockUpState.lockUpRate) / 100);
    }

    if (
      amountBN === undefined ||
      amountBN.comparedTo(0) <= 0 ||
      amountBN.plus(feeBN).comparedTo(balanceBN) === 1
    ) {
      setIsValidAmount(false);
    } else {
      setIsValidAmount(true);
    }
  };

  const handleCloseModal = () => {
    assetStore.updateBalance(memberStore.accessToken);
    assetStore.updateTransactions(memberStore.user.address);
    setIsVisibleSuccessDialog(false);
  };

  const handleSubmitButton = async () => {
    let result;
    // 태픽 API 호출
    // 교환 수량 차감
    result = await sendToAdmin(memberStore.accessToken, {
      amount: amount.toString(),
      email: memberStore.user.email,
    });
    // 수수료 차감
    if (result.result) {
      result = await sendToAdmin(memberStore.accessToken, {
        amount: feeBN.toString(),
        email: memberStore.user.email,
      });
    }

    if (result.result) {
      setIsAfterTransfer(true);
      setIsVisibleSuccessDialog(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <View>
          <BalanceContainer>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.infoText]}>
                {`${I18n.t("gp.holding_amount")} : `}
              </Text>
              <View style={{ alignItems: "flex-end" }}>
                <View style={{ flexDirection: "row" }}>
                  <BalanceHighlight />
                  <BalanceText>
                    {`${NumberWithCommas(assetStore.balance, 0)} ${CODE}`}
                  </BalanceText>
                  {(lockUpState.isLockUpAllUser ||
                    lockUpState.isLockUpUser) && (
                    <View
                      style={{
                        marginTop: -4,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <EIcon
                        name="lock"
                        size={27}
                        color={DefaultColors.secondColorToneDown}
                      />
                      {!lockUpState.isLockUpAllUser &&
                        lockUpState.isLockUpUser &&
                        lockUpState.lockUpRate && (
                          <LockRateText>{lockUpState.lockUpRate}%</LockRateText>
                        )}
                    </View>
                  )}
                </View>
              </View>
            </View>
            {!lockUpState.isLockUpAllUser &&
              lockUpState.isLockUpUser &&
              lockUpState.lockUpPeriod && (
                <LockUpPeriodText>
                  ~ {timeConverter(lockUpState.lockUpPeriod)}
                </LockUpPeriodText>
              )}
          </BalanceContainer>
          <InputContainer>
            <InputTitle>{I18n.t("gp.amount")}</InputTitle>
            <InputRow>
              <InfoInput
                // isInvalid={!(errors.amount === undefined)}
                // keyboardType={'number'}
                // ref={register({name: 'amount'}, {required: true})}
                // onChangeText={text => setValue('amount', text, true)}
                value={amount}
                onChangeText={(value) => setAmount(value)}
                onBlur={handleBlurAmount}
              />
              <UnitText>GP</UnitText>
            </InputRow>
          </InputContainer>
          <IconWrapper>
            <Icon
              name={"arrow-down"}
              size={27}
              color={DefaultColors.mainColorToneDown}
            />
          </IconWrapper>
          <InputContainer>
            <InputTitle>{I18n.t("gp.conversion_price")}</InputTitle>
            <InputRow>
              <InfoInputView>
                <InputText>{conversionPrice}</InputText>
              </InfoInputView>
              <UnitText>{tokenCurrency}</UnitText>
            </InputRow>
          </InputContainer>

          <InfoContainer>
            <InfoRow style={{ borderBottomWidth: 0 }}>
              <KeyText>{I18n.t("gp.exchange_amount")}</KeyText>
              <ValueText>{(amount || 0) + ` ${CODE}`}</ValueText>
            </InfoRow>
            <InfoRow style={{ paddingBottom: 12, marginBottom: 8 }}>
              <KeyText>{I18n.t("gp.exchange_fee")}</KeyText>
              <ValueText>
                {"+ " + (settingStore.tapickExchangeFee || 0) + ` ${CODE}`}
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
                <TotalText>{totalAmount}</TotalText>
                <ValueText>{" " + CODE}</ValueText>
              </View>
            </InfoRow>
          </InfoContainer>
        </View>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}
          style={styles.submitButton}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSubmitButton()}
            disabled={
              lockUpState.isLockUpAllUser ||
              lockUpState.isLockUpPeriod ||
              !isValidAmount ||
              isAfterTransfer
            }
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  !lockUpState.isLockUpAllUser &&
                  !lockUpState.isLockUpPeriod &&
                  !isAfterTransfer &&
                  isValidAmount
                    ? "transparent"
                    : "#bfbfbf",
              },
            ]}
          >
            <Text style={{ color: "white", fontSize: 18 }}>
              {I18n.t("gp.exchange")}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <Modal
          isVisible={isVisibleSuccessDialog}
          onModalHide={() => navigation.navigate({ routeName: "AssetOnePage" })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalCloseButton}>
              <TouchableOpacity onPress={handleCloseModal}>
                <EIcon name="close" size={25} color="#bbb" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalHeader}>
              <MIcon
                name={"progress-check"}
                size={50}
                color={DefaultColors.mainColor}
              />
              <Text style={styles.modalHeaderText}>
                {I18n.t("gp.success")}
              </Text>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalDetailText}>
                {I18n.t("gp.complete_exchange_request_desc")}
              </Text>
            </View>
            <TouchableOpacity onPress={handleCloseModal}>
              <View style={[styles.modalButton, { backgroundColor: "white" }]}>
                <Text
                  style={{
                    color: DefaultColors.mainColorToneDown,
                    fontSize: 18,
                  }}
                >
                  {I18n.t("gp.confirm")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};

TapickExchangePage.navigationOptions = ({ screenProps }) => {
  return {
    title: screenProps.i18Nav.t("gp.tapic_exchange"),
    headerTitleStyle: {
      color: "black",
      fontWeight: "bold",
    },
    headerStyle: {
      ...RemoveHeaderShadow,
      backgroundColor: "white",
    },
  };
};

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: space-between;
  padding-bottom: 15px;
`;

const BalanceContainer = styled.View`
  flex-direction: column;
  align-items: flex-end;
  padding: 5px 20px 18px 20px;
`;

const BalanceHighlight = styled.View`
  background-color: rgba(0, 205, 172, 0.25);
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: 100%;
  height: 9px;
`;

const BalanceText = styled.Text`
  font-size: 14px;
`;

const LockRateText = styled.Text`
  font-size: 16px;
  color: ${DefaultColors.secondColorToneDown};
  font-weight: bold;
`;

const LockUpPeriodText = styled.Text`
  margin-top: 5px;
  color: ${DefaultColors.secondColorToneDown};
`;

const InputContainer = styled.View`
  margin: 0px 20px;
  padding: 5px 20px 7px 20px;
  border-radius: 7px;
  background-color: white;
  shadow-color: #000000;
  shadow-radius: 3px;
  shadow-offset: 1px 2px;
  shadow-opacity: 0.1;
  elevation: 5;
`;

const InputRow = styled.View`
  margin-top: 5px;
  margin-bottom: 5px;
  flex-direction: row;
  align-items: center;
`;

const UnitText = styled.Text`
  padding-left: 15px;
  padding-right: 5px;
  font-size: 17px;
`;

const InputTitle = styled.Text`
  font-size: 13px;
  margin-right: 3px;
  margin-top: 5px;
  color: #676767;
`;

const InfoInput = styled.TextInput`
  ${({ inputWidth }) =>
    inputWidth > 0 ? `width: ${inputWidth}px;` : "flex: 1;"}
  margin-top: 3px;
  padding-left: 3px;
  padding-top: ${Platform.OS === "ios" ? "5" : "0"}px;
  padding-bottom: ${Platform.OS === "ios" ? "13" : "8"}px;
  font-size: 14px;
  border-color: #d6d6d6;
  border-bottom-width: 1px;
  ${({ isInvalid }) => isInvalid && "border-color: #c24a49;"};
  color: black;
  font-size: 18px;
`;

const InfoInputView = styled.View`
  ${({ inputWidth }) =>
    inputWidth > 0 ? `width: ${inputWidth}px;` : "flex: 1;"}
  margin-top: 3px;
  padding-left: 3px;
  padding-top: ${Platform.OS === "ios" ? "5" : "0"}px;
  padding-bottom: ${Platform.OS === "ios" ? "8" : "3"}px;
  font-size: 14px;
  color: black;
  font-size: 18px;
`;

const InputText = styled.Text`
  font-size: 18px;
`;

const IconWrapper = styled.View`
  margin: 10px 0px 8px 0px;
  align-items: center;
`;

const InfoContainer = styled.View`
  margin: 20px 20px 0px 20px;
  background-color: ${DefaultColors.lightGray};
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
  border-bottom-width: 1px;
  border-bottom-color: ${DefaultColors.gray};
`;

const KeyText = styled.Text`
  font-size: 14px;
  color: gray;
`;

const TotalText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${DefaultColors.mainColorToneDown};
`;

const ValueText = styled.Text`
  font-size: 15px;
`;

export default inject("assetStore", "settingStore", "memberStore")(
  observer(TapickExchangePage)
);
