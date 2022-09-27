/* 이더리움 infura API 기본 주소 */
import GLOBALS from '../../config/Globals';

const ETHEREUM_CONSTANTS = {
  ETHERSCAN_API_INFO: {
    NETWORK: GLOBALS.__DID_APP_DEV__ ? 'api-ropsten' : 'api',
    API_KEY: 'CYAB3DZ3Q6E4CHJD8CRDA5Q58STXK7PTUP',
  },
  ETHERSCAN_WEB_API_INFO: {
    NETWORK: GLOBALS.__DID_APP_DEV__ ? 'ropsten.' : '',
  },
  ETHEREUM_API_ROOT_URL: '',
  ETHEREUM_API_GET_GAS_URL: 'https://ethgasstation.info/json/ethgasAPI.json',
  ETHERSCAN_API_ROOT_URL: `http://${
    GLOBALS.__DID_APP_DEV__ ? 'api-ropsten' : 'api'
  }.etherscan.io/api`,
  ETHERSCAN_TX_URL: `https://${
    GLOBALS.__DID_APP_DEV__ ? 'ropsten.' : ''
  }etherscan.io/tx`,
  ETHERSCAN_ADDRESS_URL: `https://${
    GLOBALS.__DID_APP_DEV__ ? 'ropsten.' : ''
  }etherscan.io/address`,
};

export const setEthereumAssetConstants = (
  ETHEREUM_API_ROOT_URL,
  ETHEREUM_API_GET_GAS_URL,
) => {
  ETHEREUM_CONSTANTS.ETHEREUM_API_ROOT_URL = ETHEREUM_API_ROOT_URL;
  ETHEREUM_CONSTANTS.ETHEREUM_API_GET_GAS_URL = ETHEREUM_API_GET_GAS_URL;
  ETHEREUM_CONSTANTS.ETHERSCAN_API_ROOT_URL = `http://${
    ETHEREUM_CONSTANTS.ETHERSCAN_API_INFO.NETWORK
  }.etherscan.io/api`;
  // ETHEREUM_CONSTANTS.ETHERSCAN_TX_URL = `https://${
  //   ETHEREUM_CONSTANTS.ETHERSCAN_WEB_API_INFO.NETWORK
  // }etherscan.io/tx`;
  // ETHEREUM_CONSTANTS.ETHERSCAN_ADDRESS_URL = `https://${
  //   ETHEREUM_CONSTANTS.ETHERSCAN_WEB_API_INFO.NETWORK
  // }etherscan.io/address`;
};

export default ETHEREUM_CONSTANTS;
//
// export const ETHEREUM_INFURA_API_INFO = {
//   NETWORK: GLOBALS.__WalletTradeAppUI_DEV__ ? "ropsten" : "mainnet",
//   PROJECT_ID: "8eb6c4218f8f4352bef52df3668cbfde",
// };
// export const ETHEREUM_API_ROOT_URL = `https://${ETHEREUM_INFURA_API_INFO.NETWORK}.infura.io/v3/${ETHEREUM_INFURA_API_INFO.PROJECT_ID}`;
//
// /* 이더리움 Etherscan API 기본 주소 */
// export const ETHERSCAN_API_INFO = {
//   NETWORK: GLOBALS.__WalletTradeAppUI_DEV__ ? "api-ropsten" : "api",
//   API_KEY: "CYAB3DZ3Q6E4CHJD8CRDA5Q58STXK7PTUP"
// };
// export const ETHERSCAN_API_ROOT_URL = `http://${ETHERSCAN_API_INFO.NETWORK}.etherscan.io/api`;
//
// /* 이더리움 ETC Gas Price API 주소 */
// export const ETHEREUM_API_GET_GAS_URL = 'https://ethgasstation.info/json/ethgasAPI.json';
//
/* 이더리움 Etherscan API 기본 주소 */
export const ETHERSCAN_TX_API_INFO = {
  NETWORK: GLOBALS.__DID_APP_DEV__ ? 'ropsten.' : '',
};

/* 이더스캔에서 트랜잭션 조회 URL */
export const ETHERSCAN_TX_URL = txHash =>
  `https://${ETHERSCAN_TX_API_INFO.NETWORK}etherscan.io/tx/${txHash}`;

/* 이더스캔에서 주소 조회 URL */
export const ETHERSCAN_ACCOUNT_URL = address =>
  `https://${ETHERSCAN_TX_API_INFO.NETWORK}etherscan.io/address/${address}`;
