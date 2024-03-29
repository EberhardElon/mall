// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import LazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(LazyLoad,{
  loading:"./static/load/loading-balls.svg"
});
Vue.use(infiniteScroll);
Vue.filter("currency",currency);
/* eslint-disable no-new */
Vue.use(Vuex);
const store=new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName=nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount+=cartCount;;
    },
    initCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
