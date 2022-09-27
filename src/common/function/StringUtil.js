const bitcoin = require("bitcoinjs-lib");

export function trimBlankSpace(str) {
  return str.replace(/(\s*)/g, '');
}

export function stringSplitToArray(str) {
  return str.split(' ');
}

export function removeTrailing0x(str) {
  if (str.startsWith('0x')) {
    return str.substring(2);
  } else {
    return str;
  }
}

export function formatAddressToStr(str) {
  // return removeTrailing0x(str);
  return str;
}

export function formatAddressFrom(str) {
  if (str.startsWith('cf')) {
    return '0x' + str.substring(2);
  } else {
    return str;
  }
}

export function hidePhoneNumber(str) {
  return str.slice(0, 3) + '*'.repeat(str.length - 6) + str.slice(-3);
}

export function hideAddress(str) {
  if (str === 'FEE') return str;
  else if (str === "Unknown") return str;
  else return str.slice(0, 8) + '...' + str.slice(-8);
}

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export function is55Address(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    // return isChecksumAddress(address);
    return false;
  }
}

export function bitcoinAddress(address) {
  try {
    bitcoin.address.toOutputScript(address)
    return true
  } catch (e) {
    return false
  }
}
