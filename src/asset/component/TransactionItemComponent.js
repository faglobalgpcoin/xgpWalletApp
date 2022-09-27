import React from "react";
import { Dimensions, View } from "react-native";
import { inject, observer } from "mobx-react";
import ThinIcon from "react-native-vector-icons/SimpleLineIcons";
import styled from "styled-components";
import BigNumber from "bignumber.js";

import { NumberWithCommas } from "../../common/function/NumberUtil";
import DefaultColors from "../../common/style/DefaultColors";
import LineSeparator from "../../common/component/LineSeparator";
import { hideAddress } from "../../common/function/StringUtil";

const { width } = Dimensions.get("window");

export function timeConverter(UNIX_timestamp) {
  const a = new Date(UNIX_timestamp * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

const sendOption = {
  iconName: "arrow-left-circle",
  transactionOperator: "-",
  transactionColor: DefaultColors.send,
};

const receiveOption = {
  iconName: "arrow-right-circle",
  transactionOperator: "+",
  transactionColor: DefaultColors.receive,
};

const TransactionItemComponent = ({
  assetStore,
  memberStore,
  tokenStore,
  tx,
  index,
  type,
}) => {
  const isSend =
    type === "luniverse"
      ? memberStore.address === tx.from
      : type === "ethereum"
      ? memberStore.ethAddress === tx.from
      : memberStore.btcAddress === tx.from;
  const amountWeiBN = new BigNumber(tx.value);
  const amountBN =
    type !== "bitcoin" ? amountWeiBN.shiftedBy(-18) : amountWeiBN.shiftedBy(-8);

  if (tx.to === tokenStore.feeAddress) {
    tx.to = "FEE";
  }

  return (
    tx && (
      <View>
        <Container onPress={() => assetStore.popTransactionModal(index, type)}>
          <LeftContainer>
            <ThinIcon
              size={25}
              name={isSend ? sendOption.iconName : receiveOption.iconName}
              color={
                isSend
                  ? sendOption.transactionColor
                  : receiveOption.transactionColor
              }
            />
            <TitleContainer>
              <TransactionId>
                {hideAddress(isSend ? tx.to : tx.from)}
              </TransactionId>
              <Timestamp>
                {timeConverter(tx.timestamp || tx.timeStamp || tx.time || "")}
              </Timestamp>
            </TitleContainer>
          </LeftContainer>
          <RightContainer>
            {/*{(isBitcoinPending || tx.isPending) && (*/}
            {/*  <PendingContainer>*/}
            {/*    <Icon name={'progress-clock'} size={15} color={'#959595'} />*/}
            {/*    <Pending> {I18n.t('asset.processing')}</Pending>*/}
            {/*  </PendingContainer>*/}
            {/*)}*/}
            <BalanceContainer>
              <Balance
                style={
                  isSend
                    ? sendOption.transactionColor
                    : receiveOption.transactionColor
                }
              >
                {isSend
                  ? sendOption.transactionOperator
                  : receiveOption.transactionOperator}
                {` ${NumberWithCommas(amountBN.toString(), 5)}`}
              </Balance>
              {/* <Balance
                style={
                  isSend
                    ? sendOption.transactionColor
                    : receiveOption.transactionColor
                }
              >
                {` ${
                  type === "luniverse"
                    ? tx.token.symbol
                    : type === "ethereum"
                    ? tx.tokenSymbol || "ETH"
                    : "BTC"
                }`}
              </Balance> */}
              <BalanceSymbolName
                style={
                  isSend
                    ? sendOption.transactionColor
                    : receiveOption.transactionColor
                }
              >
                {` ${
                  type === "luniverse"
                    ? tx.token.symbol
                    : type === "ethereum"
                    ? tx.tokenSymbol || "ETH"
                    : "BTC"
                }`}
              </BalanceSymbolName>
            </BalanceContainer>
          </RightContainer>
        </Container>
        <LineSeparator />
      </View>
    )
  );
};

const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.6,
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 65px;
  width: ${width - 60}px;
`;

const LeftContainer = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  padding: 10px 10px 10px 3px;
`;
const RightContainer = styled.View`
  display; flex;
  flex-direction: column;
  align-items: flex-end;
`;
const TitleContainer = styled.View`
  flex-direction: column;
  margin-horizontal: 10px;
`;
const TransactionId = styled.Text`
  color: #474747;
  font-size: 12px;
  margin-bottom: 3px;
  color: ${DefaultColors.fontColor};
  font-size: 14px;
`;
const Timestamp = styled.Text`
  color: #707070;
  font-size: 11px;
`;
const BalanceContainer = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;
const Balance = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${DefaultColors.fontColor};
`;
const BalanceSymbolName = styled.Text`
  font-size: 14px;
  color: ${DefaultColors.darkGray};
`;

export default inject("assetStore", "memberStore", "tokenStore")(
  observer(TransactionItemComponent)
);
