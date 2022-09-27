import Globals from '../../config/Globals';

// https://baobab-api.scope.klaytn.com/api/transactions?account=0x6451ad10a40506e4df05b9b90b0049769328e475&size=20
// https://scope-api.klaytn.com/api/transactions?account=0x854ca8508c8be2bb1f3c244045786410cb7d5d0a&size=20

const getTransactionListFromScope = async (address, size) => {
  const response = await fetch(
    `https://scope-api.klaytn.com/api/account/${address}`,
    {method: 'GET'},
  );
  const result = await response.json();
  return result;
};

const getTransactionFromScope = async tx => {
  const response = await fetch(
    `https://scope-api.klaytn.com/api/transaction/${tx}`,
    {method: 'GET'},
  );
  const result = await response.json();
  return result;
};

export {getTransactionListFromScope, getTransactionFromScope};
