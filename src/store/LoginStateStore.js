import { observable, computed } from 'mobx';
import { persist } from 'mobx-persist';


export default class LoginStateStore {
    @persist @observable token = '';
    @persist @observable username = '';
    @persist @observable userid = 0;
    @computed get completed() {
      return this.token !== '';
    }

  login(username, token) {
    this.token = token;
    this.username = username;
  }

  logout() {
    this.token = '';
    this.username = '';
    this.userid = 0;
  }
}
