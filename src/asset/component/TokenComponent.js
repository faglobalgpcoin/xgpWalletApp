import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { inject, observer } from "mobx-react";
import BigNumber from "bignumber.js";

import DefaultColors from "../../common/style/DefaultColors";
import { NumberWithCommas } from "../../common/function/NumberUtil";

const TokenComponent = ({ token, tokenCurrency, goToAssetOnePage }) => {
  //console.log(token);
  const bnBalance = new BigNumber(token.balance);
  const assetUSD = bnBalance.multipliedBy(token.tokenPriceByCurrency);
  return (
    token && (
      <TouchableOpacity onPress={() => goToAssetOnePage(token)}>
        <View style={styles.root}>
          {token.imageUrl && (
            <Image source={{ uri: token.imageUrl }} style={styles.tokenImage} />
          )}
          {token.imagePath && (
            <Image source={token.imagePath} style={styles.tokenImage} />
          )}
          <View style={styles.contentStyle}>
            <View style={styles.titleLayoutStyle}>
              <Text style={styles.tokenName}>{token.symbol || ""}</Text>
              <Text style={styles.name}>{`(${token.name || ""})`}</Text>
            </View>
            <View style={styles.titleLayoutStyle}>
              <Text style={styles.balanceStyle}>
                {NumberWithCommas(token.balance || 0, 0) + " " + token.symbol}
              </Text>
              {/* {token.tokenPriceByCurrency && (
                <>
                  <Text>{" / "}</Text>
                  <Text>
                    {NumberWithCommas(assetUSD || 0) + " " + tokenCurrency}
                  </Text>
                </>
              )} */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  );
};

export default inject("assetStore", "memberStore")(observer(TokenComponent));

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: DefaultColors.lightGray,
  },
  tokenImage: {
    width: 45,
    height: 45,
    // borderRadius: 10,
    marginRight: 20,
    resizeMode: "contain",
  },
  contentStyle: {
    flex: 1,
  },
  titleLayoutStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tokenName: {
    fontWeight: "bold",
    fontSize: 20,
    marginRight: 5,
    color: DefaultColors.fontColor,
  },
  name: {
    color: DefaultColors.fontColor,
  },
  balanceStyle: {
    marginRight: 0,
    color: DefaultColors.fontColor,
  },
});
