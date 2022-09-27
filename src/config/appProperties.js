import packageJson from "../../package.json";

const APP_PROPERTIES = {
  LOCK_UP_ALL: "lock_up_all",
  TOKEN_PRICE_XGP: "XGP_token_price",
  TOKEN_PRICE_ETH: "ETH_token_price",
  TOKEN_PRICE_BTC: "BTC_token_price",
  TRANSFER_FEE_XGP: "XGP_transfer_fee",
  TRANSFER_FEE_ETH: "ETH_transfer_fee",
  TRANSFER_FEE_BTC: "BTC_transfer_fee",
  TOKEN_SYMBOL: {
    XGP: "XGP",
    ETH: "ETH",
    BTC: "BTC",
  },
  MAIN_TOKEN_SYMBOL: "XGP",
  TOKEN_NAME: "FAGlobal",
  TOKEN_SITE: "xgpinco.com",
  APP_VERSION: packageJson.version,
};

export default APP_PROPERTIES;
