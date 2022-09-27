import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';
import BigNumber from 'bignumber.js';

import {getAppProperties, getBalance, getTokenInfos} from '../../api/Api';
import APP_PROPERTIES from "../../config/appProperties";

class TokenStore {
  // 1 토큰 당 USD 금액 ex) 1 wfca = 1 USD => USD 금액은 관리자사이트에서 설정
  @persist('object') @observable tokenPrice = {
    xgp: '',
    eth: '',
    btc: ''
  };

  @persist @observable isLockUpAllUser = '';
  @persist @observable tokenCurrency = 'KRW';
  @persist("object") @observable transferFee = {
    xgp: "0",
    eth: "0",
    btc: "0"
  };
  @persist @observable feeAddress = "";

  @persist('list') @observable tokenList = [];
  @observable token = {};

  @action setToken = value => (this.token = value);
  @action setTokenCurrency = value => (this.tokenCurrency = value);

  @action updateTokenList = async accessToken => {
    const result = await getTokenInfos();
    await this.updateAppProperty(accessToken);
    if (result.status === "success") {
      let tempTokenList = [];
      await result.data.map(async token => {
        tempTokenList = [...tempTokenList, token];
      });
      this.tokenList = [...tempTokenList];
    }
  };

  @action updateAppProperty = async accessToken => {
    let result;

    try {
      result = await getAppProperties(accessToken);

      if (result.data.length === 0) {
        return;
      }

      for (let i = 0; i < result.data.length; i++) {
        if ( result.data[i].keyName === APP_PROPERTIES.LOCK_UP_ALL ) {
          this.isLockUpAllUser = result.data[i].value;
        } else if ( result.data[i].keyName === APP_PROPERTIES.TOKEN_PRICE_XGP ) {
          // Default is USD
          this.tokenPrice.xgp = result.data[i].value;
        } else if ( result.data[i].keyName === APP_PROPERTIES.TRANSFER_FEE_XGP ) {
          this.transferFee.xgp = result.data[i].value;
        } else if ( result.data[i].keyName === APP_PROPERTIES.TOKEN_PRICE_ETH ) {
          // Default is USD
          this.tokenPrice.eth = result.data[i].value;
        } else if ( result.data[i].keyName === APP_PROPERTIES.TRANSFER_FEE_ETH ) {
          this.transferFee.eth = result.data[i].value;
        } else if ( result.data[i].keyName === APP_PROPERTIES.TOKEN_PRICE_BTC ) {
          // Default is USD
          this.tokenPrice.btc = result.data[i].value;
        } else if ( result.data[i].keyName === APP_PROPERTIES.TRANSFER_FEE_BTC ) {
          this.transferFee.btc = result.data[i].value;
        } else if ( result.data[i].keyName === APP_PROPERTIES.TAPICK_EXCHANGE_FEE ) {
          this.tapickExchangeFee = result.data[i].value;
        } else if (result.data[i].keyName === "fee_address") {
          this.feeAddress = result.data[i].value;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  updateTokenPriceByCurrency = async (price, token) => {
    if (this.tokenCurrency && this.tokenCurrency !== 'KRW') {
      const rate = await this.getExchange(this.tokenCurrency);
      return this.calculatePrice(this.tokenCurrency, price, rate);
    } else {
      this.tokenCurrency = 'KRW';
      return price;
    }
  };

  getExchange = async current => {
    const obj = {
      method: "spotRateHistory",
      data: {
        base: "KRW",
        term: current,
        period: "day"
      }
    }
    const response = await fetch(
      'https://api.rates-history-service.prd.aws.ofx.com/rate-history/api/1',
      {
        method: 'post',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const data = await response.json();
    if (data) {
      return data.data.CurrentInterbankRate;
    }
  };

  calculatePrice = (currency, price, rate) => {
    const priceBN = new BigNumber(price);
    const rateBN = new BigNumber(rate);
    return priceBN
      .multipliedBy(rateBN)
      .decimalPlaces(0)
      .toString();
  };


  @action updateBalance = async (accessToken, token) => {
    await this.updateAppProperty(accessToken);
    const result = await getBalance(accessToken, token.symbol, token.type);
    const ethResult = await getBalance(accessToken, "ETH", "ethereum");
    if (result && result.status === "success" && ethResult && ethResult.status === "success" ) {
      token.weiBalance = result.data.balance || '0';
      let bnBalance = new BigNumber(token.weiBalance);
      if (token.type !== "bitcoin") token.balance = bnBalance.shiftedBy(-18).toString();
      else token.balance = bnBalance.shiftedBy(-8).toString();

      token.ethWeiBalance = ethResult.data.balance || '0';
      let ethBnBalance = new BigNumber(token.ethWeiBalance);
      token.ethBalance = ethBnBalance.shiftedBy(-18).toString();

      let tokenPriceByCurrency;
      if (APP_PROPERTIES.TOKEN_SYMBOL.XGP === token.symbol) {
        tokenPriceByCurrency = await this.updateTokenPriceByCurrency(
          this.tokenPrice.xgp,
        );
        token.tokenPriceByCurrency = tokenPriceByCurrency;
      } else if (APP_PROPERTIES.TOKEN_SYMBOL.ETH === token.symbol) {
        tokenPriceByCurrency = await this.updateTokenPriceByCurrency(
          this.tokenPrice.eth,
        );
        token.tokenPriceByCurrency = tokenPriceByCurrency;
      } else if (APP_PROPERTIES.TOKEN_SYMBOL.BTC === token.symbol) {
        tokenPriceByCurrency = await this.updateTokenPriceByCurrency(
          this.tokenPrice.btc,
        );
        token.tokenPriceByCurrency = tokenPriceByCurrency;
      }
    } else {
      token.balance = "0";
      let tokenPriceByCurrency;
      tokenPriceByCurrency = await this.updateTokenPriceByCurrency(
        this.tokenPrice[token.symbol.toLowerCase()],
      );
      token.tokenPriceByCurrency = tokenPriceByCurrency;
    }
  };
}

export default TokenStore;
