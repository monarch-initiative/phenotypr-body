import Vue from 'vue';
import Router from 'vue-router';

import SearchPage from '@/components/SearchPage';
import ResultsPage from '@/components/ResultsPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/search'
    },
    {
      path: '/search',
      component: SearchPage
    },
    {
      path: '/results',
      component: ResultsPage
    }
  ]
});
