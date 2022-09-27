import React, {useState} from 'react';
import {FlatList, View, Dimensions, RefreshControl} from 'react-native';
import styled from 'styled-components';
import {inject, observer} from 'mobx-react';
import {withNavigationFocus} from 'react-navigation';
import I18n from 'i18n-js';

import DefaultColors from '../../common/style/DefaultColors';
import TransactionItemComponent from './TransactionItemComponent';

const {width} = Dimensions.get('window');

const TransactionListComponent = ({
  dataLength,
  assetStore,
  tokenStore,
  memberStore,
  type,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isPage = dataLength === undefined || dataLength > 6;
  const renderTransaction = key => {
    return <TransactionItemComponent type={type} tx={key.item} index={key.index} />;
  };

  const renderEmptyTransaction = () => {
    return (
      <EmptyContainer isPage={isPage}>
        <EmptyDAppText>{I18n.t('gp.transactions_empty')}</EmptyDAppText>
      </EmptyContainer>
    );
  };

  const keyExtractor = (item, index) => index.toString();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await tokenStore.updateBalance(
        memberStore.accessToken,
        tokenStore.token,
      );
      await assetStore.updateTransactions(
        memberStore.accessToken,
        tokenStore.token.symbol,
        tokenStore.token.type,
      );
    } catch (e) {
      setIsRefreshing(false);
    }
    setIsRefreshing(false);
  };

  return (
    <View style={{alignItems: 'center'}}>
      <FlatList
        data={
          dataLength
            ? assetStore.transactions.slice(0, dataLength)
            : assetStore.transactions
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderTransaction} //{renderTransaction()}
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
  background-color: ${({isPage}) => (isPage ? 'transparent' : '#eaeaea')};
`;

const EmptyDAppText = styled.Text`
  font-size: 13px;
  color: gray;
`;

export default inject()(
  observer(withNavigationFocus(TransactionListComponent)),
);
