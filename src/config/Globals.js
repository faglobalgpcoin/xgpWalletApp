const Globals = {
  __DID_APP_DEV__: false,
};

export function setNetwork(value) {
  Globals.__DID_APP_DEV__ = value; // used only release version (mainnet)
}

export default Globals;
