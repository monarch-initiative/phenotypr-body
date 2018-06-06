import Vue from 'vue';
import Router from 'vue-router';

import SearchPage from '@/components/SearchPage';
import ResultsPage from '@/components/ResultsPage';
import TermsOfUsePage from '@/components/TermsOfUsePage';

Vue.use(Router);

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
      path: '/terms-of-use',
      component: TermsOfUsePage
    }
  ]
});

router.beforeResolve((to, from, next) => {
  if (to.meta.requireTermsOfUse) {
    next({
      path: '/terms-of-use'
    });
  } else {
    next();
  }
});

export default router;
