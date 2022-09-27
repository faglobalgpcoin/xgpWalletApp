import {action, computed, observable} from 'mobx';
import {persist} from 'mobx-persist';

import NavigationService from '../../config/nav/NavigationService';
import {registerUserToContract} from '../../dapp/repository/DAppRepository';
import I18n from '../../config/i18n';
import {slicePrefix} from '../../common/function/CryptoUtil';
import {trimBlankSpace} from '../../common/function/StringUtil';

class MemberInfoFormStore {
  @observable @persist('object') userInfo = {};
  @observable mnemonicWords = [];
  @observable genderBefore = '';
  @observable selectedGender = '';
  @observable languageBefore = '';
  @observable selectedLanguage = '';
  @observable identityBefore = '';
  @observable identityInput = '';
  @observable nameBefore = '';
  @observable nameInput = '';
  @observable lastNameBefore = '';
  @observable lastNameInput = '';
  @observable emailBefore = '';
  @observable emailInput = '';
  @observable countryCodeBefore = '';
  @observable countryCodeInput = '';
  @observable mobileBefore = '';
  @observable mobileInput = '';
  @observable yearBefore = '';
  @observable yearInput = '';
  @observable monthBefore = '';
  @observable monthInput = '';
  @observable dayBefore = '';
  @observable dayInput = '';
  @observable isLoading = false;
  @observable isIdentityFocused = false;
  @observable isNameFocused = false;
  @observable isLastNameFocused = false;
  @observable isYearFocused = false;
  @observable isMonthFocused = false;
  @observable isDayFocused = false;
  @observable isEmailFocused = false;
  @observable isCountryCodeFocused = false;
  @observable isMobileFocused = false;
  @observable isVisibleBackUpModal = false;
  @observable loadingText = I18n.t('wallet.creating_wallet');
  @observable defaultBorderStyle = {
    borderColor: '#d6d6d6',
    borderBottomWidth: 1.5,
  };
  @observable focusBorderStyle = {
    borderColor: '#7EA7E5',
    borderBottomWidth: 1.5,
  };

  // @action setUserInfo = value => (this.userInfo = value);
  @action setIsLoadingTrue = () => (this.isLoading = true);
  @action setIsLoadingFalse = () => (this.isLoading = false);
  @action handleChangeYear = value => (this.yearInput = trimBlankSpace(value));
  @action handleChangeDay = value => (this.dayInput = trimBlankSpace(value));
  @action handleChangeName = value => (this.nameInput = value);
  @action handleChangeLastName = value => (this.lastNameInput = value);
  @action handleChangeIdentity = value =>
    (this.identityInput = trimBlankSpace(value));
  @action handleChangeMonth = value =>
    (this.monthInput = trimBlankSpace(value));
  @action handleChangeEmail = value =>
    (this.emailInput = trimBlankSpace(value));
  @action handleChangeMobile = value =>
    (this.mobileInput = trimBlankSpace(value));
  @action handleChangeCountryCode = value =>
    (this.countryCodeInput = trimBlankSpace(value));
  @action setIsVisibleBackUpModalTrue = () =>
    (this.isVisibleBackUpModal = true);
  @action setMnemonicWords = async mnemonic => {
    this.mnemonicWords = [...mnemonic.split(' ')];
  };
  @action handleBackupModalHide = () => {
    NavigationService.navigate('MainBottomTabNavigator');
  };

  @action handleFocusIdentity = () => (this.isIdentityFocused = true);
  @action handleBlurIdentity = () => (this.isIdentityFocused = false);
  @action handleFocusName = () => (this.isNameFocused = true);
  @action handleBlurName = () => (this.isNameFocused = false);
  @action handleFocusLastName = () => (this.isLastNameFocused = true);
  @action handleBlurLastName = () => (this.isLastNameFocused = false);
  @action handleFocusYear = () => (this.isYearFocused = true);
  @action handleBlurYear = () => (this.isYearFocused = false);
  @action handleFocusMonth = () => (this.isMonthFocused = true);
  @action handleBlurMonth = () => (this.isMonthFocused = false);
  @action handleFocusDay = () => (this.isDayFocused = true);
  @action handleBlurDay = () => (this.isDayFocused = false);
  @action handleFocusEmail = () => (this.isEmailFocused = true);
  @action handleBlurEmail = () => (this.isEmailFocused = false);
  @action handleFocusCountryCode = () => (this.isCountryCodeFocused = true);
  @action handleBlurCountryCode = () => (this.isCountryCodeFocused = false);
  @action handleFocusMobile = () => (this.isMobileFocused = true);
  @action handleBlurMobile = () => (this.isMobileFocused = false);
  @action handleChangeGender = selected => {
    this.selectedGender = this.selectedGender === selected ? '' : selected;
  };
  @action handleChangeLanguage = selected => {
    this.selectedLanguage = this.selectedLanguage === selected ? '' : selected;
  };

  @action setFormInfo = ({
    identity = '',
    name = '',
    lastName = '',
    gender = '',
    email = '',
    countryCode = '',
    mobile = '',
    dateBirth = '',
  }) => {
    this.identityBefore = identity;
    this.identityInput = identity;
    this.nameBefore = name;
    this.nameInput = name;
    this.lastNameBefore = lastName;
    this.lastNameInput = lastName;
    this.genderBefore = gender;
    this.selectedGender = gender;
    this.languageBefore = '';
    this.selectedLanguage = I18n.defaultLocale;
    this.emailBefore = email;
    this.emailInput = email;
    this.countryCodeBefore = countryCode;
    this.countryCodeInput = countryCode;
    this.mobileBefore = mobile;
    this.mobileInput = mobile;
    this.yearBefore = dateBirth.substring(0, 4);
    this.yearInput = dateBirth.substring(0, 4);
    this.monthBefore = dateBirth.substring(4, 6);
    this.monthInput = dateBirth.substring(4, 6);
    this.dayBefore = dateBirth.substring(6);
    this.dayInput = dateBirth.substring(6);
  };

  @computed get dateBirth() {
    return `${this.yearInput}${this.monthInput}${this.dayInput}`;
  }

  @computed get isChanged() {
    return (
      this.identityBefore !== this.identityInput ||
      this.nameBefore !== this.nameInput ||
      this.lastNameBefore !== this.lastNameInput ||
      this.genderBefore !== this.selectedGender ||
      this.emailBefore !== this.emailInput ||
      this.mobileBefore !== this.mobileInput ||
      this.yearBefore !== this.yearInput ||
      this.monthBefore !== this.monthInput ||
      this.dayBefore !== this.dayInput ||
      this.languageBefore !== this.selectedLanguage
    );
  }

  @action closeBackUpModal = () => {
    this.isVisibleBackUpModal = false;
    this.loadingText = I18n.t('wallet.loading_wallet');
    // Toast.show(I18n.t('gp.signup_complete'), Toast.LONG);

    setTimeout(() => {
      NavigationService.navigate('HomePage');
    }, 2000);
  };

  // @action currentUserInfo = addressName => {
  //   return {
  //     identity: this.identityInput,
  //     name: this.nameInput || addressName,
  //     gender: this.selectedGender,
  //     email: this.emailInput,
  //     emailCrtfd: false,
  //     mobile: this.mobileInput,
  //     mobileCrtfd: false,
  //     dateBirth: this.dateBirth,
  //   };
  // };

  @action registerUserWithContract = async postData => {
    const response = await registerUserToContract(postData);
    const result = await response.json();
    if (result.result) {
      delete result.data.rawTx.from;
      const signedTx = await signing(result.data.rawTx);
      const txResponse = await registerUserToContract({signedTx: signedTx});
      const txResult = await txResponse.json();

      return txResult && true;
    }

    return false;
  };

  @action setWalletInfo = async (
    walletStore,
    {mnemonic, address, publicKey, privateKey},
    selectedLanguage,
  ) => {
    walletStore.setSeedPhrase(mnemonic);
    walletStore.setAddress(address);
    walletStore.setPubKey(publicKey);
    walletStore.setPrivateKey(privateKey);
    walletStore.setLanguage(selectedLanguage);
    await this.setMnemonicWords(mnemonic);
  };

  @action modifyClientMemberInfo = () => {
    this.userInfo.name = this.nameInput;
    this.userInfo.email = this.emailInput;
  };

  // TODO: 유효성 검사 필요(아이디 중복 체크, 필수 사항 입력)
  // @action
  // handlePressRegisterUser = async (walletStore, memberInfoFormStore) => {
  //   try {
  //     const wallet = await createAccount(this.selectedLanguage);
  //     console.log('wallet : ', wallet);
  //
  //     const addressName = removeTrailing0x(wallet.address).substring(0, 6);
  //     const userInfo = this.currentUserInfo(addressName);
  //     // console.log('userInfo : ', userInfo);
  //
  //     const encrypted = await encryptWithPublicKey(
  //       wallet.publicKey,
  //       JSON.stringify(userInfo),
  //     );
  //     // console.log('userInfoEncrypted : ', encrypted);
  //
  //     const registerResult = await registerUserWithContract(encrypted, wallet);
  //
  //     if (registerResult) {
  //       await this.setWalletInfo(walletStore, wallet, this.selectedLanguage);
  //       memberInfoFormStore.setUserInfo(userInfo);
  //       rewardTokenToRegisteredUser(wallet.address, 30).then(result => {
  //         // console.log('registerUserWithContract result : ', registerResult);
  //         // console.log('rewardTokenToRegisteredUser result : ', result);
  //       });
  //
  //       return true;
  //     }
  //
  //     return false;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  @action
  handlePressRegisterUser = async walletStore => {
    try {
      const {walletKey} = await createWallet();
      const publicKey = slicePrefix(walletKey.publicKey);
      // const userInfoString = JSON.stringify(this.currentUserInfo());
      // const encrypted = await encryptWithPublicKey(publicKey, userInfoString);
      // const result = await this.registerUser({
      //   from: walletKey.address,
      //   inputs: encrypted,
      // });

      // console.log('walletKey : ', walletKey);

      if (publicKey) {
        await this.setWalletInfo(walletStore, walletKey);
        // this.setUserInfo(this.currentUserInfo());
        return true;
      }

      return false;
    } catch (e) {
      console.error(e);
    }
  };
}

export default MemberInfoFormStore;
