import React from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";

import TokenListComponent from "./component/TokenListComponent";

const AssetListPage = ({ memberStore, assetStore, tokenStore, navigation }) => {
  const goToAssetOnePage = async (token) => {
    await tokenStore.setToken(token);
    await assetStore.updateTransactions(
      memberStore.accessToken,
      tokenStore.token.symbol,
      tokenStore.token.type
    );
    await navigation.navigate("AssetOnePage", { symbol: token.symbol });
  };

  return (
    <>
      <Container>
        <TokenListComponent
          assetStore={assetStore}
          tokenStore={tokenStore}
          memberStore={memberStore}
          goToAssetOnePage={goToAssetOnePage}
        />
      </Container>
    </>
  );
};

AssetListPage.navigationOptions = ({ navigation, screenProps }) => {
  return {
    title: screenProps.i18Nav.t("gp.gp_wallet_list"),
    headerTitleStyle: {
      color: "black",
      fontWeight: "bold",
    },
    headerStyle: {
      backgroundColor: "white",
    },
  };
};

export default inject("memberStore", "assetStore", "tokenStore")(
  observer(AssetListPage)
);

const Container = styled.View`
  display: flex;
  flex: 1;
  padding: 5px 0px;
`;
