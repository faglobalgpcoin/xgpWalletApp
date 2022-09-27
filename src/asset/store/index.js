import AssetDetailStore from './AssetDetailStore';
import AssetStore from './AssetStore';
import AssetReceiveStore from './AssetReceiveStore';
import AssetSendStore from './AssetSendStore';
import TapickExchangeStore from './TapickExchangeStore';
import TokenStore from './TokenStore';

export default {
  assetStore: new AssetStore(),
  assetDetailStore: new AssetDetailStore(),
  assetSendStore: new AssetSendStore(),
  assetReceiveStore: new AssetReceiveStore(),
  tapickStore: new TapickExchangeStore(),
  tokenStore: new TokenStore(),
};
