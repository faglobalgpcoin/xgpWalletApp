import {action, observable} from 'mobx';
import {getTransferEvent} from '../../api/Api';

import openBrowser from '../../common/function/LinkUtil';
import {
  GO_ETHERSCAN_URL,
  GO_ETHERSCAN_TX_URL,
  GO_BITCOIN_URL,
  GO_BITCOIN_TX_URL,
  GO_TRANSACTION_SCAN_URL,
  GO_TRANSFER_LIST_SCAN_URL,
} from '../../api/Constants';

class AssetStore {
  @observable transactions = [];
  @observable isVisibleTransactionModal = false;
  @observable transactionModal = {
    txHash: '',
    amount: '',
    toAddress: '',
    fromAddress: '',
    timestamp: '',
    symbol: '',
  };
  @observable assetInfo = {}; // Can get address from memberStore
  @observable weiBalance = '0';
  @observable balance = '0';
  @observable tokenCurrency = '0';

  @action setBalance = value => (this.balance = value);
  @action popModal = () => (this.isVisibleTransactionModal = true);
  @action closeModal = () => (this.isVisibleTransactionModal = false);

  @action updateTransactions = async (accessToken, symbol, type) => {
    const result = await getTransferEvent(accessToken, symbol, type);

    if (result && result.status === "success") {
      if (type === "luniverse") {
        this.transactions = result.data.txns.filter(
          tx => tx.token.symbol === symbol,
        );
      } else {
        this.transactions = result.data.txns;
      }
    }
  };

  @action setTransactionModal = (data, type) => {
    this.transactionModal = {
      txHash: data.txHash || data.hash || data.txid,
      amount: data.value,
      toAddress: data.to,
      fromAddress: data.from,
      timestamp: data.timestamp || data.timeStamp || data.time,
      symbol: type === "luniverse" ? data.token.symbol : type === "ethereum" ? data.tokenSymbol || "ETH" :
      "BTC",
      type: type
    };
  };

  @action popTransactionModal = (index, type) => {
    this.setTransactionModal(this.transactions[index], type);
    this.popModal();
  };

  @action navigateToScanTx = (hash, type) => {
    if (type === "luniverse") openBrowser(GO_TRANSACTION_SCAN_URL());
    else if (type === "ethereum") openBrowser(GO_ETHERSCAN_TX_URL(hash));
    else openBrowser(GO_BITCOIN_TX_URL(hash));
  };

  @action navigateToScanList = (address, type) => {
    if (type === "luniverse") openBrowser(GO_TRANSFER_LIST_SCAN_URL(address));
    else if (type === "ethereum") openBrowser(GO_ETHERSCAN_URL(address));
    else openBrowser(GO_BITCOIN_URL(address));
  };

  /**
   * Legacy
   */

  // @observable assetList = {};
  // @observable isRefreshing = false;

  // @action setIsRefreshingTrue = () => {
  //   this.isRefreshing = true;
  // };
  // @action setIsRefreshingFalse = () => {
  //   this.isRefreshing = false;
  // };
  //
  // @action handleRefreshing = async address => {
  //   await this.updateBalanceByAddress(address);
  //   this.setIsRefreshingFalse();
  // };
  //
  // @action updateAssets = async () => {
  //   for (let i = 0; i < mockData.asset.length; i++) {
  //     this.assetList[mockData.asset[i].code] = mockData.asset[i];
  //   }
  // };

  // @action updateBalanceByAddress = async address => {
  //   try {
  //     for (let key in this.assetList) {
  //       let balance = '0';
  //       if (this.assetList[key].code === MAIN_ASSET_CODE) {
  //         balance = (await getKlayBalance(address)) || '0';
  //         balance = convertPepToKlay(balance);
  //       } else {
  //         balance = (await getKRC20Balance(address)) || '0';
  //       }
  //       this.assetList[key].balance = balance;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // @action updateAssetBalance = async (key, address) => {
  //   try {
  //     let balance = '0';
  //     if (this.assetList[key].code === MAIN_ASSET_CODE) {
  //       balance = (await getKlayBalance(address)) || '0';
  //       balance = convertPepToKlay(balance);
  //     } else {
  //       balance = (await getKRC20Balance(address)) || '0';
  //     }
  //     this.assetList[key].balance = balance;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
}

export default AssetStore;
