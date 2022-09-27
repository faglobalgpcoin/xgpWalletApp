import React, { useState, useEffect } from "react";
import Toast from "react-native-simple-toast";
import {
  Dimensions,
  Keyboard,
  Platform,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import DefaultColors from "../common/style/DefaultColors";
import styled from "styled-components";
import I18n from "i18n-js";
import { inject, observer } from "mobx-react";
import { hidePhoneNumber } from "../common/function/StringUtil";
import { legacyAirdrop } from "../api/Api";

const { width } = Dimensions.get("window");

const RemainingBalanceComponent = ({ data }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <FormContainer>
        <InputTitle>{I18n.t("gp.check_transfer_result")}</InputTitle>
        <InfoContainer>
          <InfoRow>
            <KeyText>{I18n.t("gp.transaction_id")}</KeyText>
            <ValueText>{data ? data.txId : ""}</ValueText>
          </InfoRow>
          <InfoRow style={{ marginBottom: 6 }}>
            <KeyText>{I18n.t("gp.transaction_uuid")}</KeyText>
            <ValueText>{data ? data.txUuid : ""}</ValueText>
          </InfoRow>
        </InfoContainer>
        {/*<InputRow>*/}
        {/*  <InfoInput*/}
        {/*    editable={false}*/}
        {/*    // defaultValue={balance}*/}
        {/*    // ref={register({name: 'email'}, {required: true})}*/}
        {/*    // onChangeText={text => setValue('email', text, true)}*/}
        {/*  />*/}
        {/*  <UnitText>GP</UnitText>*/}
        {/*</InputRow>*/}
        <InputTitle style={{ color: DefaultColors.darkGray }}>
          {I18n.t("gp.can_take_times")}
        </InputTitle>
      </FormContainer>
    </Animated.View>
  );
};

const TransferTokenPage = ({ memberStore }) => {
  const initalState =
    memberStore.user.isLegacyTokenAirdrop !== undefined
      ? memberStore.user.isLegacyTokenAirdrop
      : true;

  const [transferRequested, setTransferRequested] = useState(initalState);
  const [transactionResult, setTransactionResult] = useState({});
  const [isAfterTransfer, setIsAfterTransfer] = useState(false);

  const handleSubmit = async () => {
    setIsAfterTransfer(true);
    const result = await legacyAirdrop(memberStore.accessToken);

    if (result.result) {
      setTransactionResult(result.data);
      setTransferRequested(true);
    } else if (
      result &&
      !result.result &&
      result.message === "You has no tokens"
    ) {
      Toast.show(I18n.t("gp.empty_account"));
    } else {
      setIsAfterTransfer(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <InformationContainer>
          <ProcessWrapper>
            <ProcessNumber>
              <Text style={{ color: "white" }}>1</Text>
            </ProcessNumber>
            <ProcessDesc>{I18n.t("gp.request_for_mobile")}</ProcessDesc>
          </ProcessWrapper>
          <FormContainer>
            <InputTitle>{I18n.t("gp.mobile")}</InputTitle>
            <InputRow>
              <InfoInput
                editable={false}
                style={{ color: "gray" }}
                defaultValue={
                  (memberStore.user.phoneNumber &&
                    memberStore.user.phoneNumber.length > 7 &&
                    hidePhoneNumber(memberStore.user.phoneNumber)) ||
                  ""
                }
              />
            </InputRow>
            <View
              style={{ alignItems: "center", marginTop: 15, paddingLeft: 3 }}
            >
              <SubmitButtonBackground
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[
                  DefaultColors.mainColor,
                  DefaultColors.mainColorToneDown,
                ]}
              >
                <SubmitButton
                  disabled={isAfterTransfer || transferRequested}
                  isActive={!isAfterTransfer && !transferRequested}
                  activeOpacity={0.6}
                  onPress={!transferRequested && handleSubmit}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {I18n.t("gp.request")}
                  </Text>
                </SubmitButton>
              </SubmitButtonBackground>
            </View>
          </FormContainer>
          <ProcessWrapper>
            <ProcessNumber disabled={!transferRequested}>
              <Text style={{ color: "white" }}>2</Text>
            </ProcessNumber>
            <ProcessDesc disabled={!transferRequested}>
              {I18n.t("gp.transfer_complete")}
            </ProcessDesc>
          </ProcessWrapper>
          {Object.entries(transactionResult).length > 0 && (
            <RemainingBalanceComponent data={transactionResult} />
          )}
          {/*<RemainingBalanceComponent />*/}
        </InformationContainer>
      </Container>
    </TouchableWithoutFeedback>
  );
};

TransferTokenPage.navigationOptions = ({ screenProps }) => {
  return {
    title: screenProps.i18Nav.t("gp.transfer_token"),
    headerTitleStyle: {
      color: "black",
      fontWeight: "bold",
    },
    headerStyle: {
      backgroundColor: "white",
    },
  };
};

const Container = styled.View`
  flex: 1;
`;

const InformationContainer = styled.View`
  display: flex;
  flex: 1;
  padding-horizontal: ${Platform.OS === "ios" ? "20" : "15"}px;
  padding-top: 10px;
  background-color: white;
`;

const FormContainer = styled.View`
  border-style: solid;
  border-left-width: 1px;
  border-left-color: ${DefaultColors.secondColorLight};
  margin-left: 12px;
  padding-top: 5px;
  padding-left: 25px;
  padding-right: 10px;
`;

const ProcessWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const ProcessNumber = styled.View`
  width: 23px;
  height: 23px;
  color: white;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: ${({ disabled }) =>
    disabled ? DefaultColors.gray : DefaultColors.secondColorToneDown};
`;

const ProcessDesc = styled.Text`
  font-size: 17px;
  color: ${({ disabled }) =>
    disabled ? DefaultColors.gray : DefaultColors.darkGray};
`;

const InfoContainer = styled.View`
  background-color: ${DefaultColors.lightGray};
  border-radius: 7px;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: -4px;
`;

const InfoRow = styled.View`
  margin-top: 5px;
  margin-bottom: 15px;
  flex-direction: column;
  align-items: flex-start;
`;

const InputRow = styled.View`
  margin-top: 5px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
`;

const KeyText = styled.Text`
  font-size: 11px;
  color: gray;
`;
const ValueText = styled.Text`
  font-size: 11px;
`;

const UnitText = styled.Text`
  position: absolute;
  right: 15px;
  top: 10px;
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
  ${({ isFocused }) =>
    isFocused && `border-color: ${DefaultColors.mainColor};`};
  color: black;
  font-size: 18px;
`;

const SubmitButtonBackground = styled(LinearGradient)`
  width: ${width - 70}px;
  height: 50px;
  margin-top: -7px;
  margin-left: -5px;
  margin-bottom: 15px;
  border-radius: 40px;
`;

const SubmitButton = styled.TouchableOpacity`
  width: ${width - 70}px;
  margin-bottom: 15px;
  height: 50px;
  background-color: transparent;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${({ isActive }) =>
    isActive ? "transparent" : DefaultColors.gray};
`;

const ButtonDescWrapper = styled.View`
  align-self: flex-end;
  margin-right: 14px;
`;

const ButtonDesc = styled.Text`
  color: ${DefaultColors.gray};
`;

export default inject("memberStore")(observer(TransferTokenPage));
