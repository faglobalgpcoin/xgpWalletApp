import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';
import BigNumber from 'bignumber.js';

import {getAppProperties} from '../../api/Api';
import APP_PROPERTY from '../constants/AppProperty';

class DMWSettingStore {
    @persist @observable isLockUpAllUser = '';
    @persist @observable tokenPrice = '';
    @persist @observable tokenPriceByCurrency = '';
    @persist @observable tokenCurrency = '';
    @persist @observable transferFee = '';

    @action setTokenCurrency = async value => (this.tokenCurrency = value);
    @action setTokenPriceByCurrency = value =>
        (this.tokenPriceByCurrency = value);

    getExchange = async current => {
        const response = await fetch(
            `https://earthquake.kr:23490/query/USD${current}`,
        );
        const data = await response.json();

        if (data) {
            return data[`USD${current}`][0];
        }
    };

    @action calculatePrice = (currency, price, rate) => {
        const priceBN = new BigNumber(price);
        const rateBN = new BigNumber(rate);
        return priceBN
            .multipliedBy(rateBN)
            .decimalPlaces(0)
            .toString();
    };

    updateTokenPriceByCurrency = async price => {
        if (this.tokenCurrency && this.tokenCurrency !== 'USD') {
            const rate = await this.getExchange(this.tokenCurrency);
            const currencyPrice = this.calculatePrice(
                this.tokenCurrency,
                price,
                rate,
            );
            this.tokenPriceByCurrency = currencyPrice;
        } else {
            this.tokenCurrency = 'USD';
            this.tokenPriceByCurrency = this.tokenPrice;
        }
    };

    @action updateAppProperty = async accessToken => {
        let result;

        try {
            result = await getAppProperties(accessToken);

            if (result.length === 0) {
                return;
            }

            for (let i = 0; i < result.length; i++) {
                if (result[i].keyName === APP_PROPERTY.LOCK_UP_ALL) {
                    this.isLockUpAllUser = result[i].value;
                } else if (result[i].keyName === APP_PROPERTY.TOKEN_PRICE) {
                    // Default is USD
                    this.tokenPrice = result[i].value;
                } else if (result[i].keyName === APP_PROPERTY.TRANSFER_FEE) {
                    this.transferFee = result[i].value;
                }
            }

            this.updateTokenPriceByCurrency(this.tokenPrice);
        } catch (e) {
            console.log(e);
        }
    };
}

export default DMWSettingStore;
