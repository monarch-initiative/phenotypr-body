import Vue from 'vue';
import Router from 'vue-router';
import QuestionsPage from '@/components/QuestionsPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: QuestionsPage
    }
  ]
});
