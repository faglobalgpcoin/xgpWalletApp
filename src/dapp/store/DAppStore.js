import {action, observable} from 'mobx';

import {stringSplitToArray} from '../../common/function/StringUtil';

class DAppStore {
  @observable dappList = {};
  @observable dappCollapse = [];
  @observable isRefreshing = false;

  @action setIsRefreshingTrue = () => {
    this.isRefreshing = true;
  };
  @action setIsRefreshingFalse = () => {
    this.isRefreshing = false;
  };

  @action setIsConnectedForDapp = (publicKey, bool) => {
    this.dappList[publicKey].isConnected = bool;
  };

  @action handleRefreshing = async () => {
    await this.getUsedDappListByAddress();
    this.setIsRefreshingFalse();
  };

  @action pushDapp = dapp => {
    this.dappList[dapp.publicKey] = dapp;
  };

  @action pushDappCollapse = collapse => {
    this.dappCollapse.push(collapse);
  };

  @action toggleIsProvided = publicKey => {
    this.dappList[publicKey].isProvided = !this.dappList[publicKey].isProvided;
  };

  @action toggleDappCollapse = index => {
    this.dappCollapse[index] = !this.dappCollapse[index];
  };

  @action getUsedDAppListByAddress = async () => {
    const result = await findAllUseDAppFromContract();

    if (!result) {
      return;
    }

    for (let i = 0; i < result.length; i++) {
      this.pushDAppFromContract(result[i]);
      this.pushDappCollapse(true);
    }
    return false;
  };

  @action pushDAppFromContract = dappInfo => {
    const dappObject = {
      dappId: dappInfo[0],
      publicKey: dappInfo[1],
      name: dappInfo[2],
      description: dappInfo[3],
      icons: stringSplitToArray(dappInfo[4]),
      url: dappInfo[5],
      isProvided: dappInfo[6],
      isConnected: false,
    };
    this.dappList[dappObject.publicKey] = dappObject;
  };
}

export default DAppStore;
