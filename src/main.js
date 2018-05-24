/* global process */
import 'babel-polyfill';
import './assets/scss/app.scss';

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';

import storeConfig from './store';
import SearchMixin from './mixins/search';
import SearchService from './services/search-service';

Vue.config.productionTip = false;

const searchService = new SearchService(process.env.HPO_SOLR_ENDPOINT);

// Inject the search service into components
Vue.mixin(SearchMixin);

// Create the data store
Vue.use(Vuex);
const store = new Vuex.Store(storeConfig);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  searchService,
  components: { App },
  template: '<App/>'
});
