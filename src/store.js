import {observable} from 'mobx';

export default class AppStore {
  @observable userLoginDetails = [];
  @observable userDetails = [];
  @observable RehabPlan = [];
  @observable StatusVideo = [];
  
}
