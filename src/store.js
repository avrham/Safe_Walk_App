import {observable} from 'mobx';

export default class AppStore {
  @observable userLoginDetails = [];
  @observable userDetails = [];
  @observable RehabPlan = [];
  @observable StatusVideo = [];
  @observable rehabProgress = 0.0;
  @observable abnormality = '';
  @observable testProcessError = '';
}
