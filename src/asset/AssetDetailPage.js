import React, { useEffect } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { inject, observer } from "mobx-react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Spinner from "react-native-loading-spinner-overlay";
import styled from "styled-components";
import I18n from "i18n-js";
import LinearGradient from "react-native-linear-gradient";

import DefaultColors from "../common/style/DefaultColors";
import { NumberWithCommas } from "../common/function/NumberUtil";
import TransactionListComponent from "./component/TransactionListComponent";
import TransactionModalComponent from "./component/TransactionModalComponent";
import images from "./image/images";

const AssetDetailPage = ({
  assetDetailStore,
  settingStore,
  assetStore,
  memberStore,
  navigation,
}) => {
  useEffect(() => {
    const currentAsset = assetStore.assetList[navigation.getParam("code")];
    async function setInitialStore() {
      assetDetailStore.setIsLoadingTrue();
      assetDetailStore.setIsLoadingFalse();
    }

    setInitialStore();

    return () => {
      assetDetailStore.reset();
    };
  }, [
    assetDetailStore,
    assetStore,
    assetStore.assetList,
    navigation,
    settingStore.userTokenContractAddress,
  ]);

  const { navigate } = navigation;
  const props = navigation.state.params;

  return (
    <Container>
      <Header>
        <IconContainer>
          <SymbolIcon source={images[props.icon]} />
        </IconContainer>
        <BalanceContainer>
          <Balance>
            {NumberWithCommas(
              assetStore.assetList[navigation.getParam("code")].balance,
              0
            )}
          </Balance>
          <SymbolText>{`  ${props.code}`}</SymbolText>
        </BalanceContainer>
        <ButtonContainer>
          <SendButtonBackground
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}
          >
            <AssetButton
              activeOpacity={0.8}
              onPress={() =>
                navigate({
                  routeName: "AssetSendPage",
                  params: navigation.state.params,
                })
              }
            >
              <SendButtonText>{I18n.t("asset.send")}</SendButtonText>
            </AssetButton>
          </SendButtonBackground>
          <ReceiveButtonBackground
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#c5c6e9", "#d0dee9"]}
          >
            <ReceiveButton
              activeOpacity={0.8}
              onPress={() =>
                navigate({
                  routeName: "AssetReceivePage",
                  params: {
                    code: props.code,
                    name: props.name,
                    englishName: props.englishName,
                  },
                })
              }
            >
              <ReceiveButtonText>{I18n.t("asset.receive")}</ReceiveButtonText>
            </ReceiveButton>
          </ReceiveButtonBackground>
        </ButtonContainer>
      </Header>
      <TitleBar>
        <Title>{I18n.t("asset.transaction_list")}</Title>
      </TitleBar>
      <SafeAreaView style={{ flex: 1 }}>
        <Spinner
          visible={assetDetailStore.isLoading}
          textContent={""}
          overlayColor={"rgba(0, 0, 0, 0)"}
          customIndicator={
            <ActivityIndicator
              size="large"
              color={DefaultColors.mainColorToneDown}
            />
          }
        />
        <TransactionListComponent
          assetStore={assetStore}
          memberStore={memberStore}
        />
        {assetDetailStore.transactions.length >= 20 && (
          <MoreTransaction>
            <TouchableOpacity
              // onPress={assetDetailStore.searchEtherscanAddress}
              style={{ flexDirection: "row", justifyContent: "center" }}
            >
              <MoreTransactionText>
                {I18n.t("asset.show_more")}
              </MoreTransactionText>
              <Icon name="chevron-right" size={13} color="#bbb" />
            </TouchableOpacity>
          </MoreTransaction>
        )}
      </SafeAreaView>
      <TransactionModalComponent
        assetDetailStore={assetDetailStore}
        navigation={navigation}
      />
    </Container>
  );
};

AssetDetailPage.navigationOptions = ({ navigation }) => {
  return {
    title: `${
      I18n.defaultLocale === "en"
        ? navigation.getParam("englishName")
        : navigation.getParam("name")
    } (${navigation.getParam("code")})`,
  };
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
`;

const Header = styled.View`
  align-items: center;
  justify-content: center;
  padding: 15px;
`;

const IconContainer = styled.View`
  align-self: center;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  border: 1px solid ${DefaultColors.lightGray};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const SymbolIcon = styled.Image`
  align-self: center;
  width: 45px;
  height: 45px;
`;

const BalanceContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Balance = styled.Text`
  margin-vertical: 8px;
  color: #474747;
  font-size: 22px;
  font-weight: bold;
`;

const SymbolText = styled.Text`
  align-self: center;
`;

const ButtonContainer = styled.View`
  margin-vertical: 8px;
  flex-direction: row;
`;

const AssetButton = styled.TouchableOpacity`
  width: 46%;
  border-radius: 23px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 46px;
  margin-horizontal: 7px;
`;

const ReceiveButton = styled(AssetButton)`
  background-color: #c7d4e9;
`;

const ReceiveButtonBackground = styled(LinearGradient)`
  height: 46px;
  width: 46%;
  border-radius: 23px;
  justify-content: center;
  align-items: center;
  margin-horizontal: 7px;
`;

const SendButtonBackground = styled(LinearGradient)`
  height: 46px;
  width: 46%;
  border-radius: 23px;
  justify-content: center;
  align-items: center;
  margin-horizontal: 7px;
`;

const SendButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const ReceiveButtonText = styled.Text`
  color: ${DefaultColors.mainColorToneDown};
  font-weight: bold;
`;

const TitleBar = styled.View`
  margin-top: 5px;
  height: 30px;
  padding-horizontal: 15px;
  padding-bottom: 5px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const MoreTransaction = styled.View``;

const MoreTransactionText = styled.Text``;

export default inject(
  "assetDetailStore",
  "assetStore",
  "memberStore",
  "settingStore"
)(observer(AssetDetailPage));
