export const API_URL = 'https://api.xgpinco.com/api/v1';
const CHAIN_CODE = '7806468005210300226';

export const SCAN_TRANSFER_URL = address =>
  `https://api.luniverse.io/scan/v1.0/chains/${CHAIN_CODE}/accounts/${address}/transfer-events`;
export const GO_TRANSACTION_SCAN_URL = txHash => //'http://dmwmainnet.com';
`https://sidescan.luniverse.io/chains/${CHAIN_CODE}/transactions/${txHash}`;

export const GO_TRANSFER_LIST_SCAN_URL = address => //'http://dmwmainnet.com';
`https://sidescan.luniverse.io/chains/${CHAIN_CODE}/accounts/${address}`;

export const GO_ETHERSCAN_URL = address => "https://etherscan.io/address/" + address + "#tokentxns";

export const GO_ETHERSCAN_TX_URL = hash => "https://etherscan.io/tx/" + hash;

export const GO_BITCOIN_URL = address => "https://blockchain.com/btc/address/" + address + "#tokentxns";

export const GO_BITCOIN_TX_URL = hash => "https://blockchain.com/btc/tx/" + hash;

export const SCAN_TOKEN_URL = (address) =>
  // `https://api.luniverse.io/scan/v1.0/chains/6022710925185810777/accounts/0x638734cbc723167a2c59f23e81f4028bf7904443/tokens?limit=25`;
  `https://api.luniverse.io/scan/v1.0/chains/${CHAIN_CODE}/accounts/${address}/tokens?limit=25`;

export const GET_TOKEN_LIST = () =>
  `${API_URL}/support/gettokeninfo`;

export const XGP_OFFICE = () => API_URL + "/external/goToOffice?accessToken=";
export const XGP_MARKET = () => 'http://app.lifechainpartners.com/service/excpn.php?accessToken=';
export const DMW_GAME = () => 'https://www.dmwgame.com/';

export const GET_ETHER_ADDRESS =
  'https://swapapi.dmwwallet.com/api/v1/address/setwfctoeth';
