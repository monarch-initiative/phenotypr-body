import Vue from 'vue';
import Router from 'vue-router';
import SearchForm from '@/components/SearchForm';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: SearchForm
    }
  ]
});
