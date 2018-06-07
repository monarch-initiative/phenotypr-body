import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store';
import SearchPage from '@/components/SearchPage';
import ResultsPage from '@/components/ResultsPage';
import TermsOfUsePage from '@/components/TermsOfUsePage';

Vue.use(Router);

const termsOfUsePath = '/terms-of-use';

export const checkTermsAccepted = (to, from, next) => {
  if (to.meta && to.meta.requireTermsOfUse && !store.state.termsOfUseAccepted) {
    next({
      path: termsOfUsePath
    });
  } else {
    next();
  }
};

export const routes = [
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
];

const router = new Router({
  routes
});

router.beforeResolve(checkTermsAccepted);

export default router;
