import Vue from 'vue';
import Router from 'vue-router';

import SearchPage from '@/components/SearchPage';
import ResultsPage from '@/components/ResultsPage';
import TermsOfUsePage from '@/components/TermsOfUsePage';
import store from '@/store/index.js';

Vue.use(Router);

const termsOfUsePath = '/terms-of-use';

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/search',
      meta: { requireTermsOfUse: true }
    },
    {
      path: '/search',
      component: SearchPage,
      meta: { requireTermsOfUse: true }
    },
    {
      path: '/results',
      component: ResultsPage,
      meta: { requireTermsOfUse: true }
    },
    {
      path: termsOfUsePath,
      component: TermsOfUsePage
    }
  ]
});

router.beforeResolve((to, from, next) => {
  if (to.meta.requireTermsOfUse && !store.state.termsOfUseAccepted) {
    next({
      path: termsOfUsePath
    });
  } else {
    next();
  }
});

export default router;
