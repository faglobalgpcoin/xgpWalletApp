import {action, observable} from 'mobx';

class TapickExchangeStore {
  @observable user = {};
  @observable isLockUpAllUser = false;

  @action setLockUpState = (user, isLockUpAllUser) => {
    this.user = user;
    this.isLockUpAllUser = isLockUpAllUser;
  };

}

export default TapickExchangeStore;
