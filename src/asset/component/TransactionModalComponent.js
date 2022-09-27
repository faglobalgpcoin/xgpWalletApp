import React from "react";
import { View, TouchableOpacity, Dimensions, Text } from "react-native";
import { inject, observer } from "mobx-react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/EvilIcons";
import styled from "styled-components";
import I18n from "i18n-js";
import BigNumber from "bignumber.js";

import LineSeparator from "../../common/component/LineSeparator";
import DefaultColors from "../../common/style/DefaultColors";
import { timeConverter } from "./TransactionItemComponent";
import { formatAddressToStr } from "../../common/function/StringUtil";
import { NumberWithCommas } from "../../common/function/NumberUtil";

const { width } = Dimensions.get("window");

const TransactionModalComponent = ({ assetStore, memberStore, tokenStore }) => {
  const store = assetStore;
  const props = { code: store.transactionModal.symbol };
  const isSend =
    store.transactionModal.type === "luniverse"
      ? memberStore.address === store.transactionModal.fromAddress
      : store.transactionModal.type === "ethereum"
      ? memberStore.ethAddress === store.transactionModal.fromAddress
      : memberStore.btcAddress === store.transactionModal.fromAddress;
  const amountWeiBN = new BigNumber(store.transactionModal.amount);
  const amountBN =
    store.transactionModal.type !== "bitcoin"
      ? amountWeiBN.shiftedBy(-18)
      : amountWeiBN.shiftedBy(-8);

  return (
    <View>
      <ModalContainer
        isVisible={store.isVisibleTransactionModal}
        backdropOpacity={0.4}
      >
        <Container>
          <CloseButton>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => store.closeModal()}
            >
              <Icon name="close" size={25} color="#888" />
            </TouchableOpacity>
          </CloseButton>
          {isSend ? (
            <Header>
              <Icon name="arrow-left" size={45} color={DefaultColors.send} />
              <HeaderText>{I18n.t("gp.send_breakdown")}</HeaderText>
            </Header>
          ) : (
            <Header>
              <Icon
                name="arrow-right"
                size={45}
                color={DefaultColors.receive}
              />
              <HeaderText>{I18n.t("gp.receive_breakdown")}</HeaderText>
            </Header>
          )}
          <LineSeparator />
          <Content>
            <DetailContainer>
              <DetailTitle>
                <DetailTitleText style={{ color: DefaultColors.send }}>
                  {I18n.t("gp.send_address")}
                </DetailTitleText>
              </DetailTitle>
              <DescContainer>
                <DescText>
                  {formatAddressToStr(store.transactionModal.fromAddress)}
                </DescText>
              </DescContainer>
            </DetailContainer>
            <DetailContainer>
              <DetailTitle>
                <DetailTitleText style={{ color: DefaultColors.receive }}>
                  {I18n.t("gp.receive_address")}
                </DetailTitleText>
              </DetailTitle>
              <DescContainer>
                <DescText>
                  {formatAddressToStr(store.transactionModal.toAddress)}
                </DescText>
              </DescContainer>
            </DetailContainer>
            <DetailContainer>
              <DetailTitle>
                <DetailTitleText>
                  {I18n.t("gp.transaction_amount")}
                </DetailTitleText>
              </DetailTitle>
              <DescContainer>
                <DescText>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {NumberWithCommas(amountBN.toString())}
                  </Text>{" "}
                  {props.code}
                </DescText>
              </DescContainer>
            </DetailContainer>
            <DetailContainer style={{ marginBottom: 0 }}>
              <DetailTitle>
                <DetailTitleText>
                  {I18n.t("gp.transaction_time")}
                </DetailTitleText>
              </DetailTitle>
              <DescContainer>
                <DescText>
                  {timeConverter(store.transactionModal.timestamp)}
                </DescText>
              </DescContainer>
            </DetailContainer>
          </Content>
          <LineSeparator />
          <Footer>
            <TouchableOpacity
              onPress={() =>
                store.navigateToScanTx(
                  store.transactionModal.txHash,
                  store.transactionModal.type
                )
              }
            >
              <HyperlinkText style={{ color: DefaultColors.mainColorToneDown }}>
                {I18n.t("gp.transfer_scanner")}
              </HyperlinkText>
            </TouchableOpacity>
          </Footer>
        </Container>
      </ModalContainer>
    </View>
  );
};

const ModalContainer = styled(Modal)`
  justify-content: center;
  align-items: center;
  border: 1px solid transparent;
`;

const Container = styled.View`
  background-color: white;
  padding: 10px;
  justify-content: center;
  align-items: center;
  align-self: center;
  border-radius: 10px;
  border-color: rgba(0, 0, 0, 0.1);
  width: ${width * 0.8}px;
  height: 470px;
`;

const CloseButton = styled.View`
  align-self: flex-end;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 25px;
  margin-top: -10px;

  margin: -10px 0 20px 0;
  flex-direction: row;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  margin-top: 10px;
  color: ${DefaultColors.fontColor};
  font-weight: bold;

  flex: 1;
  margin-top: 0;
`;

const Content = styled.View`
  flex: 1;
  width: 100%;
  padding: 15px;
  justify-content: center;

  justify-content: space-between;
`;

const DetailContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 15px;
`;

const DetailTitle = styled.View`
  width: 30%;

  width: 100%;
`;

const DetailTitleText = styled.Text`
  font-size: 14px;
  color: ${DefaultColors.fontColor};
`;

const DescContainer = styled.View`
  align-items: flex-end;

  width: 100%;
  align-items: flex-start;
`;

const DescText = styled.Text`
  margin-left: 10px;
  font-size: 16px;
  color: ${DefaultColors.fontColor};
  text-align: right;

  margin-left: 0;
  margin-top: 7px;
  text-align: left;
  font-weight: 500;
`;

const Footer = styled.View`
  margin-top: 10px;
  height: 25px;
  align-items: center;
  justify-content: center;
`;

const HyperlinkText = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

export default inject("assetStore", "memberStore", "tokenStore")(
  observer(TransactionModalComponent)
);
