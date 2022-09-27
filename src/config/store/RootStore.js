import {create} from 'mobx-persist';
import AsyncStorage from '@react-native-community/async-storage';

import commonStores from '../../common/store';
import settingStores from '../../setting/store';
import scannerStores from '../../scanner/store';
import memberStores from '../../member/store';
import assetStores from '../../asset/store';
import dappStores from '../../dapp/store';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

hydrate('memberStore', memberStores.memberStore);
hydrate('tokenStore', assetStores.tokenStore);
// hydrate('settingStore', settingStores.settingStore);
// hydrate('memberInfoFormStore', memberStores.memberInfoFormStore);

export default {
  ...commonStores,
  ...settingStores,
  ...assetStores,
  ...scannerStores,
  ...memberStores,
  ...dappStores,
};
