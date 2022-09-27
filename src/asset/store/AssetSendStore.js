import { action, computed, observable } from "mobx";
import BigNumber from "bignumber.js";

import { bitcoinAddress, is55Address, trimBlankSpace } from "../../common/function/StringUtil";
import Alert from "../../common/function/Alert";
import { MAIN_ASSET_CODE } from "../AssetCodeConstants";
import I18n from "../../config/i18n";
import { sendAsset } from "../../api/Api";

class AssetSendStore {
	DEFAULT_FEE_INDEX = 1;

	@observable assetInfo = {};
	@observable form = {
		toAddress: "",
		amount: "",
	};
	@observable feeDetail = {
		symbol: "",
		gasPrice: "",
		gasLimit: "",
		computeFee: "",
	};
	@observable feeTypes = [
		{
			typeName: "slow",
			displayName: I18n.t("asset.slow"),
			time: "",
			computeFee: "",
			gasPrice: "",
		},
		{
			typeName: "regular",
			displayName: I18n.t("asset.regular"),
			time: "",
			computeFee: "",
			gasPrice: "",
		},
		{
			typeName: "fast",
			displayName: I18n.t("asset.fast"),
			time: "",
			computeFee: "",
			gasPrice: "",
		},
	];
	@observable qrScannerInfo = {
		tokenType: "",
		address: "",
		amount: "",
	};
	@observable passwordInput = "";
	@observable transferFee = "";
	@observable gasPrice = "";
	@observable tokenType = "";
	@observable tokenSymbol = "";
	@observable selectFeeIndex = this.DEFAULT_FEE_INDEX;
	@observable isDisabledButtonGroup = true;

	@observable isLoading = false;
	@observable isLockUpAllUser = false;
	@observable isAfterTransfer = false;
	@observable isValidatePassword = false;
	@observable isValidateAmount = false;
	@observable isValidateAddress = false;
	@observable isValidateFee = false;
	@observable isValidateAlertShow = false;
	@observable isVisibleSendSuccessDialog = false;
	@observable isVisibleSendFailDialog = false;
	@observable isVisiblePasswordWarningModal = false;

	@observable alertMessage = "";
	@observable submitMessage = I18n.t("gp.send");
	@observable indicatorText = I18n.t("asset.requesting_send");

	@observable nativeCoinBalance = 0;
	@observable userTokenContractAddress = "";

	@observable utxoList = [];
	@observable feeResult = {};
	@observable user = {};
	assetDetailStore = {};

	@action setIsLoadingTrue = async () => {
		this.isLoading = true;
	};
	@action setLockUpState = (user, isLockUpAllUser) => {
		this.user = user;
		this.isLockUpAllUser = isLockUpAllUser;
	};
	@action setTransferFee = (value) => {
		this.transferFee = value;
	};
	@action setGasPrice = (value) => {
		this.gasPrice = value;
	};
	@action setIsLoadingFalse = () => (this.isLoading = false);
	@action handleChangeAddress = (input) => (this.form.toAddress = trimBlankSpace(input));
	@action handleChangePassword = (input) => (this.passwordInput = trimBlankSpace(input));
	@action handlePressQRCode = (navigation) => {
		navigation.navigate({ routeName: "AssetQRCodeScanPage" });
	};

	@action togglePasswordWarningModal = () => (this.isVisiblePasswordWarningModal = !this.isVisiblePasswordWarningModal);
	@action setIsVisibleSendSuccessDialogFalse = () => (this.isVisibleSendSuccessDialog = false);

	@action setIsVisibleSendFailDialogFalse = () => (this.isVisibleSendFailDialog = false);

	@computed get invalidateSubmit() {
		return this.isValidateAmount && this.isValidateAddress;
	}

	@computed get totalAmount() {
		if (this.tokenType !== "ethereum") return BigNumber.sum(this.form.amount || "0", this.transferFee || "0").toString();
		else if (this.tokenType === "ethereum" && this.tokenSymbol === "ETH") return BigNumber.sum(this.form.amount || "0", this.gasPrice || "0").toString();
		else if (this.tokenType === "ethereum" && this.tokenSymbol !== "ETH") return BigNumber.sum(this.form.amount || "0", this.transferFee || "0").toString();
	}

	/**
	 * Legacy
	 * @returns {boolean}
	 */
	// @computed get invalidateSubmit() {
	//   return (
	//     this.isValidateAmount && this.isValidateFee && this.isValidateAddress
	//   );
	// }

	@action setInitialStore = (
		assetInfo,
		tokenStore,
		// settingStore,
		assetDetailStore,
		assetStore
	) => {
		this.assetInfo = assetInfo;
		this.assetDetailStore = assetDetailStore;
		// this.userTokenContractAddress = settingStore.userTokenContractAddress;
		this.assetStore = assetStore;
		this.tokenType = tokenStore.token.type;
		this.tokenSymbol = tokenStore.token.symbol;
	};

	@action setEthereumInfo = async () => {
		this.feeDetail.symbol = "ETH";
		this.feeDetail.gasLimit = "21000";
		this.isDisabledButtonGroup = false;
		this.feeTypes[0].time = "30" + I18n.t("asset.minute");
		this.feeTypes[1].time = "5" + I18n.t("asset.minute");
		this.feeTypes[2].time = "2" + I18n.t("asset.minute");
	};

	@action setQrScannerInfo = async (tokenType, address, amount) => {
		this.form.toAddress = address;
		await this.handleBlurAddress();

		if (this.isValidateAddress && amount) {
			this.form.amount = amount;
			await this.checkTokenAmount(amount);
		}
	};

	@action handleSendSuccessModalHide = (navigation, tokenStore, { accessToken }) => {
		// fetch transaction list;
		// assetStore.updateBalance(accessToken);
		if (this.assetInfo.code !== "ETHEREUM") {
			tokenStore.updateBalance(accessToken, tokenStore.token);
			navigation.navigate({ routeName: "AssetOnePage" });
		} else {
			navigation.navigate("EthOnePage", { symbol: tokenStore.token.symbol });
		}
	};

	@action handleChangeAmount = (input) => {
		if (input.length === 0 && this.assetInfo.code === "BITCOIN") {
			this.isDisabledButtonGroup = true;
		}
		this.form.amount = trimBlankSpace(input);
	};

	@action handleAmountButton = (input) => {
		let newAmount;
		if (this.form.amount === "") newAmount = 0 + input;
		else newAmount = parseInt(this.form.amount) + input;

		if (input === "reset") newAmount = 0;

		this.form.amount = trimBlankSpace(newAmount.toString());

		let _balance = new BigNumber(this.assetInfo.balance);
		let _amount = new BigNumber(this.form.amount);
		let _fee = new BigNumber(this.transferFee);
		let _gas = new BigNumber(this.gasPrice);
		let _ethBalance = new BigNumber(this.assetInfo.ethBalance);

		if (this.isLockUpAllUser === "false" && this.user.lockUp) {
			_balance = new BigNumber(this.assetInfo.balance);
			_balance = _balance.multipliedBy((100 - this.user.lockUpRate) / 100);
		}

		if (this.tokenType !== "ethereum") {
			if (_amount === undefined || _amount.comparedTo(0) <= 0 || _amount.plus(_fee).comparedTo(_balance) === 1) {
				this.validationAlertMessage(true, I18n.t("gp.invalid_balance_warning"));
				this.isValidateAmount = false;
			} else {
				this.validationAlertMessage(false);
				this.isValidateAmount = true;
			}
		} else {
			if (this.tokenSymbol !== "ETH" && (_amount === undefined || _amount.comparedTo(0) <= 0 || _amount.comparedTo(_balance) === 1 || _ethBalance.comparedTo(_gas) === -1)) {
				this.validationAlertMessage(true, I18n.t("gp.invalid_balance_warning"));
				this.isValidateAmount = false;
			} else if (this.tokenSymbol === "ETH" && (_amount.comparedTo(0) <= 0 || _amount.plus(_gas).comparedTo(_balance) === 1)) {
				this.validationAlertMessage(true, I18n.t("gp.invalid_balance_warning"));
				this.isValidateAmount = false;
			} else {
				this.validationAlertMessage(false);
				this.isValidateAmount = true;
			}
		}
	};

	@action handleBlurAmount = () => {
		let _balance = new BigNumber(this.assetInfo.balance);
		let _amount = new BigNumber(this.form.amount);
		let _fee = new BigNumber(this.transferFee);
		let _gas = new BigNumber(this.gasPrice);
		let _ethBalance = new BigNumber(this.assetInfo.ethBalance);

		if (this.isLockUpAllUser === "false" && this.user.lockUp) {
			_balance = new BigNumber(this.assetInfo.balance);
			_balance = _balance.multipliedBy((100 - this.user.lockUpRate) / 100);
		}

		if (this.tokenType !== "ethereum") {
			console.log(_fee, _balance);
			if (_amount === undefined || _amount.comparedTo(0) <= 0 || _amount.plus(_fee).comparedTo(_balance) === 1) {
				this.validationAlertMessage(true, I18n.t("gp.invalid_balance_warning"));
				this.isValidateAmount = false;
			} else {
				this.validationAlertMessage(false);
				this.isValidateAmount = true;
			}
		} else {
			if (this.tokenSymbol !== "ETH" && (_amount === undefined || _amount.comparedTo(0) <= 0 || _amount.comparedTo(_balance) === 1 || _ethBalance.comparedTo(_gas) === -1)) {
				this.validationAlertMessage(true, I18n.t("gp.invalid_balance_warning"));
				this.isValidateAmount = false;
			} else if (this.tokenSymbol === "ETH" && (_amount.comparedTo(0) <= 0 || _amount.plus(_gas).comparedTo(_balance) === 1)) {
				this.validationAlertMessage(true, I18n.t("gp.invalid_balance_warning"));
				this.isValidateAmount = false;
			} else {
				this.validationAlertMessage(false);
				this.isValidateAmount = true;
			}
		}
	};

	@action checkTokenAmount = (amount) => {
		let _balance = new BigNumber(this.assetInfo.balance);
		let _amount = new BigNumber(amount);
		let _fee = new BigNumber(this.transferFee);

		if (this.assetInfo.code !== "ETHEREUM" && this.isLockUpAllUser === "false" && this.user.lockUp) {
			_balance = new BigNumber(this.assetInfo.balance);
			_balance = _balance.multipliedBy((100 - this.user.lockUpRate) / 100);
		}

		if (_amount === undefined || _amount.comparedTo(0) <= 0 || _amount.plus(_fee).comparedTo(_balance) === 1) {
			this.validationAlertMessage(true, I18n.t("gp.invalid_balance_warning"));
			this.isValidateAmount = false;
		} else {
			this.validationAlertMessage(false);
			this.isValidateAmount = true;
		}
	};

	/**
	 * Legacy
	 * @returns {Promise<void>}
	 */
	// @action handleBlurAmount = () => {
	//   if (this.form.amount.length === 0 && this.assetInfo.code === 'BITCOIN') {
	//     this.isDisabledButtonGroup = true;
	//   } else {
	//     this.checkAmount(this.form.amount, undefined);
	//   }
	// };

	@action handleBlurAddress = async () => {
		if (this.form.toAddress === "") {
			return;
		}

		let isChecked = false;
		try {
			if (this.tokenType !== "bitcoin") isChecked = is55Address(this.form.toAddress.toLowerCase());
			else isChecked = bitcoinAddress(this.form.toAddress);
		} catch (e) {
			console.log(e);
		}
		this.setValidateAddressResult(isChecked);
	};

	@action setValidateAddressResult = (isChecked) => {
		if (isChecked) {
			this.validationAlertMessage(false);
			this.isValidateAddress = true;
		} else {
			this.validationAlertMessage(true, I18n.t("gp.invalid_address_warning"));
			this.isValidateAddress = false;
		}
	};

	@action handlePressAmountMax = async () => {
		let value = new BigNumber(this.assetInfo.balance);

		if (this.assetInfo.code === "BITCOIN") {
			// const response = await getEstimateMaxBTCFee(
			//   this.utxoList.length.toString(),
			//   this.feeTypes[2].gasPrice.toString(),
			// );
			// await this.setBitcoinFeeRate(
			//   value.shiftedBy(8).minus(new BigNumber(response.estimatedMaxBTCFee)),
			// );
			// value = new BigNumber(
			//   value.minus(this.feeTypes[2].computeFee).toString(),
			// );
			// this.selectFeeIndex = 2;
		} else if (this.assetInfo.code === "ETHEREUM") {
			value = new BigNumber(value.minus(this.feeDetail.computeFee).toString());
		}

		if (value.comparedTo(0) === 1) {
			this.form.amount = value.toString();
			await this.checkAmount(value.toString(), this.assetInfo.code === "BITCOIN" ? 2 : undefined);
			this.assetInfo.code === "BITCOIN"
				? Alert(
						I18n.t("asset.caution"),
						"자동 입력된 수량은 잔고에서 최대 속도로 전송했을 때의 수수료를 뺀 것입니다. " +
							"'다른 전송속도'를 [선택] 했을 때에는 보낼 수 있는 최대 수량이 바뀔 수 있으므로 '다른 전송속도'로 [선택]을 하시면 출금 수량을 다시 확인하여 출금 하세요.",
						true,
						{},
						{},
						{
							okText: I18n.t("gp.confirm"),
							okCallback: () => {},
						}
				  )
				: "";
		}
	};

	@action handlePressFeeRate = (selectFeeIndex) => {
		let isMaxEvent = false;
		if (!this.isDisabledButtonGroup) {
			let prevSelectFeeIndex = this.selectFeeIndex;
			this.selectFeeIndex = selectFeeIndex;
			this.feeDetail.computeFee = this.feeTypes[selectFeeIndex].computeFee;
			this.feeDetail.gasPrice = this.feeTypes[selectFeeIndex].gasPrice;
			this.setTransferFee(this.feeTypes[selectFeeIndex].computeFee);
			if (this.isMaxAmountRequest(this.assetInfo.balance, this.form.amount, this.feeTypes[prevSelectFeeIndex].computeFee)) {
				isMaxEvent = true;
				let balance = new BigNumber(this.assetInfo.balance);
				this.form.amount = balance.minus(this.feeDetail.computeFee).toString();
			}

			this.handleBlurAmount();
			this.checkAmount(this.form.amount, this.assetInfo.code === "BITCOIN" ? selectFeeIndex : undefined, isMaxEvent);
		}
	};

	// @action
	// async updateBitcoinUtxo() {
	//   const response2 = await getUTXO(this.assetInfo.address);
	//   const json2 = await response2.json();
	//
	//   this.utxoList = [
	//     ...json2.data.txs.map(value => {
	//       let amount = new BigNumber(value.value);
	//       amount = amount.shiftedBy(8);
	//       return {
	//         txHash: value.txid,
	//         vout: value.output_no,
	//         amount: amount.toString(),
	//         address: this.assetInfo.address,
	//         scriptPubKey: value.script_hex,
	//         confirmCount: value.confirmations,
	//       };
	//     }),
	//   ];
	//
	//   this.feeTypes[0].time = '1시간';
	//   this.feeTypes[1].time = '30분';
	//   this.feeTypes[2].time = '30분 이내';
	// }

	// @action
	// async updateBitcoinFeeRate() {
	//   const response = await getBitcoinFeeRates();
	//   const json = await response.json();
	//
	//   this.feeDetail.symbol = this.assetInfo.symbol;
	//   this.feeTypes[0].gasPrice = json.hourFee + '';
	//   this.feeTypes[1].gasPrice = json.halfHourFee + '';
	//   this.feeTypes[2].gasPrice = json.fastestFee + '';
	// }
	@action updateKlayBalance = () => {
		const klayInfo = this.assetStore.assetList.KLAY;
		this.nativeCoinBalance = klayInfo.balance;
	};

	/**
	 * Legacy
	 * @param amount
	 * @param selectedFeePosition
	 * @param isMaxEvent
	 * @returns {Promise<void>}
	 */
	@action checkAmount = async (amount, selectedFeePosition, isMaxEvent) => {
		// if (this.form.amount === '') {
		//   return;
		// }
		//
		// let _amount = new BigNumber(amount);
		//
		// if (
		//   _amount.isNaN() ||
		//   _amount.comparedTo(0) <= 0 ||
		//   _amount.plus(_fee).comparedTo(this.assetInfo.balance) === 1
		// ) {
		//   this.validationAlertMessage(true, I18n.t('gp.invalid_balance_warning'));
		//   this.isValidateAmount = false;
		// } else {
		//   this.validationAlertMessage(false);
		//   this.isValidateAmount = true;
		//   // if (this.assetInfo.code === 'BITCOIN' && !isMaxEvent) {
		//   //   await this.getBitcoinFee(selectedFeePosition);
		//   // }
		//   // this.checkFee();
		// }
	};

	@action getBitcoinFee = async (selectedFeePosition = 1) => {
		let amount = new BigNumber(this.form.amount);
		amount = amount.shiftedBy(8);

		await this.setBitcoinFeeRate(amount);
		this.feeDetail.computeFee = this.feeTypes[selectedFeePosition].computeFee;
		this.feeDetail.gasPrice = this.feeTypes[selectedFeePosition].gasPrice;
		this.isDisabledButtonGroup = false;
	};

	@action updateKlaytnFee = () => {
		// TODO: gasPrice, gasLimit 맞는지 확인
		this.feeDetail.computeFee = "0.000625";
		this.feeDetail.gasPrice = "25000000000";
		this.feeDetail.code = "KLAY";
	};

	// @action setBitcoinFeeRate = async value => {
	//   const response2 = await computeBTCFee(
	//     JSON.stringify(this.utxoList),
	//     value.toString(),
	//     this.feeTypes[0].gasPrice,
	//     this.feeTypes[1].gasPrice,
	//     this.feeTypes[2].gasPrice,
	//   );
	//   let utxoResultJson = JSON.parse(response2.UTXOSelectionResult);
	//
	//   this.feeResult = {...utxoResultJson};
	//   let _slowFee = new BigNumber(utxoResultJson._slowFee);
	//   let _normalFee = new BigNumber(utxoResultJson._normalFee);
	//   let _fastFee = new BigNumber(utxoResultJson._fastFee);
	//   this.feeTypes[0].computeFee = _slowFee.shiftedBy(-8).toString();
	//   this.feeTypes[1].computeFee = _normalFee.shiftedBy(-8).toString();
	//   this.feeTypes[2].computeFee = _fastFee.shiftedBy(-8).toString();
	// };

	@action checkFee = () => {
		let _amount = new BigNumber(this.form.amount);
		// let _balanceForFee = new BigNumber(
		//   this.assetInfo.code === 'BITCOIN'
		//     ? this.assetInfo.balance
		//     : this.nativeCoinBalance,
		// );
		let _balanceForFee = new BigNumber(this.assetInfo.balance);
		let _feeInput = new BigNumber(this.feeDetail.computeFee);
		let _compareValue = this.assetInfo.code !== "BITCOIN" && this.assetInfo.code !== "ETHEREUM" ? _feeInput.toString() : _feeInput.plus(_amount).toString();

		if (_balanceForFee.comparedTo(_compareValue) === -1) {
			this.validationAlertMessage(true, I18n.t("asset.invalid_send_fee_warning"));
			this.isValidateFee = false;
		} else {
			this.validationAlertMessage(false);
			this.isValidateFee = true;
		}
	};

	@action validationAlertMessage(onAlert, message) {
		this.alertMessage = onAlert ? message : "";
		this.isValidateAlertShow = onAlert;
	}

	@action validatePassword = async () => {
		const isValidatePassword = await this.service.validatePassword(this.passwordInput);
		if (isValidatePassword) {
			this.indicatorText = I18n.t("asset.requesting_send");
			this.transferByAssetInfo(this.passwordInput);
		} else {
			this.isAfterTransfer = false;
			this.setIsLoadingFalse();
			this.togglePasswordWarningModal();
		}
		this.isAfterTransfer = false;
	};

	@action transferByAssetInfo = async (passwordInput) => {
		let gasPrice = new BigNumber(this.feeDetail.gasPrice);
		let amount = new BigNumber(this.form.amount);
		let computeFee = new BigNumber(this.feeDetail.computeFee);

		if (this.assetInfo.code === "BITCOIN") {
			await this.transferBitcoin(computeFee, amount, passwordInput);
		} else if (this.assetInfo.code === "ETHEREUM") {
			await this.transferEthereum(computeFee, gasPrice, amount, passwordInput, this.form.toAddress);
		} else if (this.assetInfo.code === "KLAY") {
			transferKlay(this.form.toAddress, this.assetInfo.address, this.form.amount);
			this.isVisibleSendSuccessDialog = true;
		} else if (MAIN_ASSET_CODE === "KLAY" && this.assetInfo.code !== "KLAY") {
			transferKRC20(this.form.toAddress, this.assetInfo.address, this.form.amount);
			this.isVisibleSendSuccessDialog = true;
		} else {
			await this.transferERC20(computeFee, gasPrice, amount, passwordInput, this.form.toAddress);
		}
	};

	@action sendTokenRequest = async (accessToken, symbol, type, pinCode, emailCode) => {
		const result = await sendAsset(accessToken, {
			amount: this.form.amount,
			receiveAddress: this.form.toAddress,
			sideTokenSymbol: symbol,
			type: type,
			pinCode,
			emailCode,
		});

		// console.log('sendCFC result :: ', result);
		if (result.status === "success") {
			this.isVisibleSendSuccessDialog = true;
		} else {
			this.isVisibleSendFailDialog = true;
			this.isAfterTransfer = false;
		}
	};

	@action handlePressSendSubmit = async (accessToken, symbol, type, pinCode, emailCode) => {
		this.isAfterTransfer = true;
		this.sendTokenRequest(accessToken, symbol, type, pinCode, emailCode);
	};

	@action transferBitcoin = async (computeFee, amount, passwordInput) => {
		let utxoResultList = [
			...this.feeResult._utxoInfos.map((value) => {
				return {
					txHash: value._txHash,
					vout: value._vout,
					amount: value._amount,
					address: value._address,
					scriptPubKey: value._scriptPubKey,
					confirmCount: value._confirmCount,
				};
			}),
		];
		// const response = await signBTCTransaction(
		//   passwordInput || '',
		//   computeFee.shiftedBy(8).toString(),
		//   this.form.toAddress,
		//   amount.shiftedBy(8).toString(),
		//   '',
		//   JSON.stringify(utxoResultList),
		// );
		//
		// try {
		//   const response_tx = await sendBitcoinTx(response.signTx);
		//   const json = await response_tx.json();
		//   console.log(' === 비트코인 출금 성공 : ', json);
		//   this.isVisibleSendSuccessDialog = true;
		// } catch (error) {
		//   Console(' === 비트코인 출금 실패', error);
		// }
	};

	@action reset = () => {
		this.form = {
			toAddress: "",
			amount: "",
		};
		this.feeDetail = {
			symbol: "",
			gasPrice: "",
			gasLimit: "",
			computeFee: "",
		};
		this.feeTypes = [
			{
				typeName: "slow",
				displayName: I18n.t("asset.slow"),
				time: "",
				computeFee: "",
				gasPrice: "",
			},
			{
				typeName: "regular",
				displayName: I18n.t("asset.regular"),
				time: "",
				computeFee: "",
				gasPrice: "",
			},
			{
				typeName: "fast",
				displayName: I18n.t("asset.fast"),
				time: "",
				computeFee: "",
				gasPrice: "",
			},
		];
		this.qrScannerInfo = {
			tokenType: "",
			address: "",
			amount: "",
		};
		this.assetInfo = {};
		this.feeResult = {};
		this.utxoList = [];
		this.alertMessage = "";
		this.passwordInput = "";
		this.submitMessage = I18n.t("asset.send");
		this.selectFeeIndex = this.DEFAULT_FEE_INDEX;
		this.nativeCoinBalance = 0;
		this.isAfterTransfer = false;
		this.isValidatePassword = false;
		this.isDisabledButtonGroup = true;
		this.isValidateAmount = false;
		this.isValidateAddress = false;
		this.isValidateFee = false;
		this.isValidateAlertShow = false;
		this.isVisibleSendSuccessDialog = false;
		this.isVisibleSendFailDialog = false;
	};

	isMaxAmountRequest = (balance, amount, fee) => {
		return new BigNumber(balance).comparedTo(new BigNumber(amount).plus(fee)) === 0;
	};
}

export default AssetSendStore;
