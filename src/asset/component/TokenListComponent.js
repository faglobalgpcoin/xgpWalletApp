import React, { useState } from "react";
import { FlatList, View, Dimensions, RefreshControl } from "react-native";
import styled from "styled-components";
import { inject, observer } from "mobx-react";
import I18n from "i18n-js";
import { withNavigationFocus } from "react-navigation";

import TokenComponent from "./TokenComponent";
import DefaultColors from "../../common/style/DefaultColors";

const { width } = Dimensions.get("window");

const TokenListComponent = ({
  dataLength,
  memberStore,
  tokenStore,
  goToAssetOnePage,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isPage = dataLength === undefined || dataLength > 6;
  const renderToken = (token) => {
    return (
      <TokenComponent
        key={token.id}
        token={token.item}
        tokenCurrency={tokenStore.tokenCurrency}
        id={token.id}
        goToAssetOnePage={goToAssetOnePage}
      />
    );
  };

  const renderEmptyTransaction = () => {
    return (
      <EmptyContainer isPage={isPage}>
        <EmptyDAppText>{I18n.t("gp.token_empty")}</EmptyDAppText>
      </EmptyContainer>
    );
  };

  const keyExtractor = (item, index) => index.toString();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await tokenStore.updateAppProperty(memberStore.accessToken);
      await tokenStore.tokenList.map(async (token) => {
        await tokenStore.updateBalance(memberStore.accessToken, token);
      });
    } catch (e) {
      setIsRefreshing(false);
    }
    setIsRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tokenStore.tokenList}
        showsVerticalScrollIndicator={false}
        renderItem={renderToken} //{renderTransaction()}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyTransaction}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[DefaultColors.mainColor, DefaultColors.mainColorToneDown]}
            tintColor={DefaultColors.mainColorToneDown}
          />
        }
      />
    </View>
  );
};

const EmptyContainer = styled.View`
  margin: 10px;
  width: ${width - 50};
  align-items: center;
  height: 50px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ isPage }) => (isPage ? "transparent" : "#eaeaea")};
`;

const EmptyDAppText = styled.Text`
  font-size: 13px;
  color: gray;
`;

export default inject()(observer(withNavigationFocus(TokenListComponent)));
