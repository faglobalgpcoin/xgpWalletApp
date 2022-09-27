function slicePrefix(string) {
  return string.slice(4);
}

function convertBufferToHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

function dappIconsToString(icons) {
  let value = '';
  icons.map((item, index, array) => {
    value += item + ' ';
  });
  return value;
}

export {convertBufferToHexString, slicePrefix, dappIconsToString};
