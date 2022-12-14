import {action, computed, observable} from 'mobx';
import {persist} from 'mobx-persist';

import openBrowser from '../../common/function/LinkUtil';

class SettingStore {
  @persist @observable isSegWitApply = true;
  @persist @observable isWalletCreated = false;
  @persist @observable isWalletPasswordApply = false;
  @persist @observable isGetAgreement = false;
  @persist @observable password = ''; // pin-code password
  @persist @observable isReadIntro = false;
  @observable isPrivacyPolicyAgreement = false;
  @observable isTermsOfServiceAgreement = false;
  @observable isVisibleBackUpModal = false;
  @observable appVersion = '';
  @observable mnemonicWords = [];
  @observable communityList = [];
  @observable navigation = {};

  @action setAppVersion = appVersion => (this.appVersion = appVersion);
  @action setPassword = password => (this.password = password);
  @action setPasswordApplyTrue = () => (this.isPasswordApply = true);
  @action setPasswordApplyFalse = () => (this.isPasswordApply = false);
  @action setWalletPasswordApplyTrue = () =>
    (this.isWalletPasswordApply = true);
  @action setWalletPasswordApplyFalse = () =>
    (this.isWalletPasswordApply = false);
  @action setIsReadIntro = bool => (this.isReadIntro = bool);

  @action clearCommunity = () => (this.communityList = []);
  @action pushCommunity = community => this.communityList.push(community);

  @action clickLink = url => openBrowser(url);
  @action popModal = () => (this.isVisibleBackUpModal = true);

  @action togglePrivacyPolicyCheckbox = () =>
    (this.isPrivacyPolicyAgreement = !this.isPrivacyPolicyAgreement);
  @action toggleTermsOfServiceCheckbox = () =>
    (this.isTermsOfServiceAgreement = !this.isTermsOfServiceAgreement);

  @computed get isCheckAllAgreement() {
    return this.isPrivacyPolicyAgreement && this.isTermsOfServiceAgreement;
  }

  @computed get orderedCommunityList() {
    return (
      this.communityList.length > 0 &&
      this.communityList.sort(function(a, b) {
        return a.displayOrder - b.displayOrder;
      })
    );
  }

  @action setMnemonicWords = mnemonic => {
    this.mnemonicWords = [...mnemonic.split(' ')];
  };

  @action closeBackUpModal = () => {
    this.isVisibleBackUpModal = false;
    // this.navigation.navigate('SettingPage');
  };

  @action handlePressMnemonicBackup = navigation => {
    if (this.isWalletPasswordApply) {
      navigation.navigate('PasswordEnterPage', {
        handlePress: this.handlePressPasswordSubmit,
      });
    } else {
      this.popModal();
    }
  };

  @action getAgreement = navigation => {
    this.isGetAgreement = true;
    navigation.navigate('WalletInitPage');
  };

  @action handlePressPasswordSubmit = async (passwordEnterStore, errorView) => {
    await passwordEnterStore.setIsLoadingTrue();
    const isValidatePassword = await this.service.validatePassword(
      passwordEnterStore.passwordInput,
    );
    await passwordEnterStore.setIsLoadingFalse();

    if (isValidatePassword) {
      passwordEnterStore.setErrorMessageHide();
      this.popModal();
    } else {
      passwordEnterStore.setErrorMessageShow();
      errorView.shake(200);
    }
  };

  @action resetAgreementInfo = () => {
    this.isPrivacyPolicyAgreement = false;
    this.isTermsOfServiceAgreement = false;
  };
}

export default SettingStore;
