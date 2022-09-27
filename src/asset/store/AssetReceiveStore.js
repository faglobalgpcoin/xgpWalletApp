import {observable, action, computed} from 'mobx';
import {trimBlankSpace} from '../../common/function/StringUtil';

class AssetReceiveStore {
  @observable address = '';
  @observable amountInput = '';
  @observable tokenType = '';
  @observable isChecked = false;
  @observable isLoading = false;
  @observable isVisibleAmountDialog = false;
  @observable isVisibleAlertDialog = false;
  @observable isKeyboardShow = false;

  @action setIsKeyboardShowTrue = () => (this.isKeyboardShow = true);
  @action setIsKeyboardShowFalse = () => (this.isKeyboardShow = false);
  @action handleChangeAmount = input =>
    (this.amountInput = trimBlankSpace(input));
  @action clearAmountInput = () => (this.amountInput = '');

  @action setInitialStore = ({code, address}) => {
    // if (props.code === 'BITCOIN') {
    //   this.tokenType = 'bitcoin';
    // } else {
    //   this.tokenType = 'ethereum';
    // }
    this.tokenType = code.toLowerCase();
    this.address = address;
  };

  @action handlePressCheckbox = () => {
    this.isChecked = !this.isChecked;
    this.clearAmountInput();
  };

  @computed get qrCodeUri() {
    return (
      `${this.tokenType}:${this.address}` +
      `${
        this.isChecked && this.amountInput.length > 0
          ? `?amount=${this.amountInput}`
          : ''
      }`
    );
  }

  @action reset = () => {
    this.address = '';
    this.amountInput = '';
    this.tokenType = '';
    this.isChecked = false;
    this.isLoading = false;
    this.isVisibleAmountDialog = false;
    this.isVisibleAlertDialog = false;
  };
}

export default AssetReceiveStore;
