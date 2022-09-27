import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';
import {NumberWithCommas} from '../../common/function/NumberUtil';
import openBrowser from '../../common/function/LinkUtil';
import {
  getTransactionFromScope,
  getTransactionListFromScope,
} from '../repository/KlaytnRepository';
import {
  getEtherscanAddressUrl,
  getEtherscanTxUrl,
} from '../repository/EthereumAssetRepository';

import {MAIN_ASSET_CODE} from '../AssetCodeConstants';

class AssetDetailStore {
  // @persist('list') @observable ethereumPendingTransactions = [];
  // @persist('list') @observable userTokenPendingTransactions = [];
  // @observable isLoading = false;
  // @observable isRefreshing = false;
  // @observable isVisibleTransactionModal = false;
  // @observable userTokenContractAddress = '';
  // @observable assetInfo = {};
  // @observable transactions = {};
  // @observable transactionModal = {
  //   txHash: '',
  //   isSend: false,
  //   amount: '',
  //   timstamp: '',
  //   toAddress: '',
  //   fromAddress: '',
  //   timestamp: '',
  //   fee: '',
  //   inputSum: '',
  //   outputSum: '',
  // };
  //
  // @action setIsLoadingTrue = () => (this.isLoading = true);
  // @action setIsLoadingFalse = () => (this.isLoading = false);
  // @action setIsRefreshingTrue = () => (this.isRefreshing = true);
  // @action setIsRefresingFalse = () => (this.isRefreshing = false);
  //
  // @action popModal = () => (this.isVisibleTransactionModal = true);
  // @action closeModal = () => (this.isVisibleTransactionModal = false);
  //
  // @action pushEthereumPendingTransaction = transaction =>
  //   this.ethereumPendingTransactions.push(transaction);
  // @action pushUserTokenPendingTransaction = transaction =>
  //   this.userTokenPendingTransactions.push(transaction);
  //
  // @action searchEtherscanTransaction = () =>
  //   openBrowser(getEtherscanTxUrl() + '/' + this.transactionModal.txHash);
  // @action searchEtherscanAddress = async () =>
  //   openBrowser(getEtherscanAddressUrl() + '/' + this.assetInfo.address);
  //
  // @action setInitialStore = async (
  //   assetInfo,
  //   address,
  //   userTokenContractAddress,
  // ) => {
  //   this.assetInfo = assetInfo;
  //   this.assetInfo.address = address;
  //   this.userTokenContractAddress = userTokenContractAddress;
  // };
  //
  // @action handleRefresh = assetStore => {
  //   const currentAssetAddress = this.assetInfo.address;
  //   const currentAsset = this.assetInfo.code;
  //
  //   this.setIsRefreshingTrue();
  //   this.updateTransactions();
  //   assetStore.updateAssetBalance(currentAsset, currentAssetAddress);
  //   this.setIsRefresingFalse();
  // };
  //
  // @action setEthereumTransactionModal = ({
  //   txHash,
  //   isSend,
  //   isPending,
  //   amount,
  //   toAddress,
  //   fromAddress,
  //   timestamp,
  //   fee,
  //   info,
  // }) => {
  //   this.transactionModal = {
  //     txHash: txHash,
  //     isSend: isSend,
  //     isPending: isPending,
  //     amount: NumberWithCommas(amount, 0),
  //     toAddress: toAddress,
  //     fromAddress: fromAddress,
  //     timestamp: timestamp,
  //     fee: isPending
  //       ? fee.toString()
  //       : this.getEtherTransactionFee(info.gasPrice, info.gasUsed),
  //   };
  //   // console.log('setEthereumTransactionModal', this.transactionModal);
  // };
  //
  // popEthereumTransactionModal = txHash => {
  //   this.setEthereumTransactionModal({
  //     txHash: '0x1231421124421414211',
  //     isSend: true,
  //     isPending: false,
  //     amount: '1',
  //     toAddress: '0xtoaddrese',
  //     fromAddress: '0xfromaddress',
  //     timestamp: '2019112121',
  //     fee: '',
  //     info: '',
  //   });
  //   // this.setEthereumTransactionModal(this.transactions[txHash]);
  //   this.popModal();
  // };
  //
  // popTransactionModal = txHash => {
  //   if (this.assetInfo.code === 'BITCOIN') {
  //     // assetDetailStore.popBitcoinTransactionModal(txHash); // not attached
  //   } else {
  //     this.popEthereumTransactionModal(txHash);
  //   }
  // };
  //
  // @action updateTransactions = () => {
  //   const currentAssetAddress = this.assetInfo.address;
  //   const currentAsset = this.assetInfo.code;
  //
  //   return new Promise(async resolve => {
  //     if (currentAsset === 'KLAY') {
  //       await this.updateKlayTransactions(currentAssetAddress);
  //     } else if (MAIN_ASSET_CODE === 'KLAY' && currentAsset !== 'KLAY') {
  //       await this.updateKRC20Transactions(currentAssetAddress);
  //     } else if (currentAsset === 'ETH') {
  //       await this.updateEthereumTransactions(currentAssetAddress);
  //     } else {
  //       // await this.updateCustomTokenTransactions(
  //       //   currentAssetAddress,
  //       //   this.userTokenContractAddress,
  //       // );
  //     }
  //     resolve();
  //   });
  // };
  //
  // @action checkPendingTransaction = (transactionArrayName, hash) => {
  //   // let sameTxidIndex = -1;
  //   //
  //   // if (this[transactionArrayName].length > 0) {
  //   //   sameTxidIndex = this[transactionArrayName].findIndex(
  //   //     transaction => transaction.txid === hash,
  //   //   );
  //   //
  //   //   if (sameTxidIndex > -1) {
  //   //     this[transactionArrayName].splice(sameTxidIndex, 1);
  //   //   }
  //   // }
  // };
  //
  // // convertRawEthereumTransaction = (value, currentAddress) => ({
  // //   isSend: value.from.toLowerCase() === currentAddress.toLowerCase(),
  // //   txid: value.hash,
  // //   timestamp: value.timeStamp,
  // //   toAddress: value.to,
  // //   fromAddress: value.from,
  // //   amount: WeiConverter(value.value),
  // //   info: value,
  // //   fromMore: 0,
  // // });
  //
  // convertRawKlayTx = (value, currentAddress) => ({
  //   isSend: value.from.toLowerCase() === currentAddress.toLowerCase(),
  //   timestamp: value.timeStamp,
  //   toAddress: value.to,
  //   fromAddress: value.from,
  //   amount: convertPepToKlay(value.value),
  //   info: value,
  //   fromMore: 0,
  //   ...value,
  // });
  //
  // getEtherTransactionFee = (gasPrice, gasUsed) => {
  //   return (gasPrice * gasUsed) / 1000000000000000000;
  // };
  //
  // // Update Transaction List By Token ===============================================
  //
  // @action updateKlayTransactions = async address => {
  //   try {
  //     const tempTransactions = {};
  //     const response = await getTransactionListFromScope(address, 20);
  //
  //     if (!response.status) {
  //       return;
  //     }
  //
  //     const txs = response.result.transactions.slice(0, 20);
  //
  //     for (let key in txs) {
  //       const tx = txs[key];
  //       tempTransactions[tx.txHash] = this.convertRawKlayTx(tx, address);
  //     }
  //
  //     this.transactions = Object.assign(this.transactions, tempTransactions);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  //
  // @action updateKRC20Transactions = async address => {
  //   // event log와 transaction 내역이 일치하지 않는다.......
  //   const tempTransactions = {};
  //   const eventLogs = await getKRC20TransactionsByAddress(address);
  //   console.log(eventLogs);
  //   let eventNum = 1;
  //
  //   if (!eventLogs) {
  //     return;
  //   }
  //
  //   for (let key in eventLogs) {
  //     if (eventNum > 20) {
  //       return;
  //     }
  //
  //     const event = eventLogs[key];
  //     const result = await getTransactionFromScope(event.transactionHash);
  //
  //     if (!result.status) {
  //       return;
  //     }
  //
  //     tempTransactions[event.transactionHash] = this.convertRawKlayTx(
  //       {
  //         ...result.result,
  //         to: event.returnValues.to,
  //         from: event.returnValues.from,
  //         value: event.returnValues.value,
  //       },
  //       address,
  //     );
  //
  //     eventNum++;
  //   }
  //
  //   this.transactions = Object.assign(this.transactions, tempTransactions);
  // };
  //
  // @action updateEthereumTransactions = async address => {
  //   // const response = await getEthereumTransactionsByAddress(address);
  //   // const result = response.json();
  //   // const tempTansactions = [];
  //   //
  //   // result.slice(0, this.MAX_TRANSACTION_ARRAY_LENGTH).map(value => {
  //   //   this.checkPendingTransaction('ethereumPendingTransactions', value.hash);
  //   //   tempTansactions.push(this.convertRawEthereumTransaction(value, address));
  //   // });
  //   //
  //   // this.transactions = [
  //   //   ...this.ethereumPendingTransactions,
  //   //   ...tempTansactions,
  //   // ];
  // };
  //
  // // Old Version
  // // @action updateCustomTokenTransactions = async (
  // //   address,
  // //   userTokenContractAddress,
  // // ) => {
  // // const response = await getTransactionERC20ByAddress(
  // //   address,
  // //   userTokenContractAddress,
  // // );
  // // const {result} = await response.json();
  // // const tempTansactions = [];
  // //
  // // result.slice(0, this.MAX_TRANSACTION_ARRAY_LENGTH).map(value => {
  // //   this.checkPendingTransaction('userTokenPendingTransactions', value.hash);
  // //   tempTansactions.push(this.convertRawEthereumTransaction(value, address));
  // // });
  // //
  // // this.transactions = [
  // //   ...this.userTokenPendingTransactions,
  // //   ...tempTansactions,
  // // ];
  // // };
  //
  // @action reset = () => {
  //   this.isLoading = false;
  //   this.isRefreshing = false;
  //   this.isVisibleTransactionModal = false;
  //   this.userTokenContractAddress = '';
  //   this.assetInfo = {};
  //   this.transactions = {};
  //   this.transactionModal = {
  //     txHash: '',
  //     isSend: false,
  //     amount: '',
  //     timstamp: '',
  //     toAddress: '',
  //     fromAddress: '',
  //     timestamp: '',
  //     fee: '',
  //     inputSum: '',
  //     outputSum: '',
  //   };
  // };
}

export default AssetDetailStore;
