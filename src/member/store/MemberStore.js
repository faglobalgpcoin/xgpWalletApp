import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';

import {validateAccessToken} from '../../api/Api';

class MemberStore {
  @persist('object') @observable user = '';
  @persist @observable accessToken = '';
  @persist @observable address = '';
  @persist @observable ethAddress = '';

  @action setAddress = value => (this.address = value);
  @action setEThAddress = value => (this.ethAddress = value);
  @action setBtcAddress = value => (this.btcAddress = value);
  @action setAccessToken = async value => (this.accessToken = value);

  @action resetMemberInfo = () => {
    this.user = {};
    this.accessToken = '';
    this.address = '';
    this.ethAddress = '';
    this.btcAddress = '';
  };

  @action updateUserInfo = async () => {
    console.log('check has access token', this.accessToken);
    if (!this.accessToken) {
      return;
    }

    const result = await validateAccessToken(this.accessToken);
    console.log('validate access token', result);

    if (result.status === "fail") {
      this.resetMemberInfo();
      return false;
    } else {
      this.user = result.data;
      this.address = result.data.address;
      this.ethAddress = result.data.ethAddress;
      this.btcAddress = result.data.btcAddress;
      return true;
    }
  };
}

export default MemberStore;
