import Vue from 'vue';
import Router from 'vue-router';

import QuestionsPage from '@/components/QuestionsPage';
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
      component: QuestionsPage
    },
    {
      path: '/results',
      component: ResultsPage
    }
  ]
});
