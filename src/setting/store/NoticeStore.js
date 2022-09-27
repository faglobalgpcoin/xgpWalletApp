import {observable, action} from 'mobx';
import {getNoticesInUse} from '../../api/Api';

class NoticeStore {
  @observable notices = [];
  @observable activeSections = [];
  @observable isLoading = false;

  @action setIsLoadingTrue = () => (this.isLoading = true);
  @action setIsLoadingFalse = () => (this.isLoading = false);

  @action updateSections = activeSections =>
    (this.activeSections = activeSections);

  @action updateNoticeList = async accessToken => {
    try {
      const result = await getNoticesInUse(accessToken);
      await result.data.sort(function(a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      this.notices = result.data;
    } catch (e) {
      console.log(e);
    }
  };

  @action reset = () => {
    this.activeSections = [];
    this.isLoading = false;
  };
}

export default NoticeStore;
