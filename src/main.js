import './assets/scss/app.scss';

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import SearchMixin from './mixins/search';
import SearchService from './services/search-service';

Vue.config.productionTip = false;

// TODO: get the URL from config
const searchService = new SearchService('/solr/hpo-pl/select');

// Inject the search service into components
Vue.mixin(SearchMixin);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  searchService,
  components: { App },
  template: '<App/>'
});
