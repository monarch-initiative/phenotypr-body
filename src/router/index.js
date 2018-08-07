import Vue from 'vue';
import Router from 'vue-router';

import store from '@/store';
import SearchPage from '@/components/SearchPage';
import ResultsPage from '@/components/ResultsPage';
import TermsOfUsePage from '@/components/TermsOfUsePage';
import BodySystemForm from '@/components/BodySystemForm';

Vue.use(Router);

const termsOfUsePath = '/terms-of-use';
const searchPath = '/search';
const bodySystemPath = '/body-systems';

/**
 * Redirect to the terms of use if they have not already been accepted.
 */
export const checkTermsAccepted = (to, from, next) => {
  const { meta = {} } = to;
  if (meta.requireTermsOfUse && !store.state.termsOfUseAccepted) {
    next({
      path: termsOfUsePath
    });
  } else {
    next();
  }
};

/**
 * Redirect to the search page if terms have already been accepted.
 */
export const skipWhenAlreadyAccepted = (to, from, next) => {
  if (store.state.termsOfUseAccepted) {
    next({
      path: bodySystemPath
    });
  } else {
    next();
  }
};

export const routes = [
  {
    path: '/',
    redirect: termsOfUsePath,
    meta: { requireTermsOfUse: true }
  },
  {
    path: bodySystemPath,
    component: BodySystemForm,
    meta: { requireTermsOfUse: true }
  },
  {
    path: searchPath,
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
    component: TermsOfUsePage,
    beforeEnter: skipWhenAlreadyAccepted
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new Router({
  routes
});

router.beforeResolve(checkTermsAccepted);

export default router;
