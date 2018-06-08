import store from '@/store';
import {
  routes,
  checkTermsAccepted,
  skipWhenAlreadyAccepted
} from '@/router';

jest.mock('@/store', () => {
  return {
    state: {
      selectedTerms: [],
      termsOfUseAccepted: false
    }
  };
});

describe('router', () => {
  const placeholderRoute = {};
  const searchRoute = { path: '/search' };
  const termsRoute = { path: '/terms-of-use' };
  const termsRequiredRoute = { path: '/example', meta: { requireTermsOfUse: true } };
  const noMetaRoute = { path: '/example' };

  describe('checkTermsAccepted() guard', () => {
    test('routes have metadata indicating if terms need to be accepted', () => {
      const unprotected = [ termsRoute.path ];
      routes.forEach(route => {
        if (!unprotected.includes(route.path)) {
          expect(route.meta).toBeTruthy();
          expect(route.meta.requireTermsOfUse).toBe(true);
        }
      });
    });

    test('when terms of use have not been accepted', () => {
      const next = jest.fn();
      store.state.termsOfUseAccepted = false;
      checkTermsAccepted(termsRequiredRoute, placeholderRoute, next);
      expect(next).toHaveBeenCalledWith(termsRoute);
    });

    test('when route has no metadata', () => {
      const next = jest.fn();
      store.state.termsOfUseAccepted = false;

      checkTermsAccepted(noMetaRoute, placeholderRoute, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });

    test('when terms of use have been accepted', () => {
      store.state.termsOfUseAccepted = true;
      const next = jest.fn();
      checkTermsAccepted(termsRequiredRoute, placeholderRoute, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });
  });

  describe('skipWhenAlreadyAccepted() guard', () => {
    test('when terms have not been accepted', () => {
      const next = jest.fn();
      store.state.termsOfUseAccepted = false;

      skipWhenAlreadyAccepted(termsRoute, placeholderRoute, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });

    test('when terms have already been accepted', () => {
      const next = jest.fn();
      store.state.termsOfUseAccepted = true;

      skipWhenAlreadyAccepted(termsRoute, placeholderRoute, next);
      expect(next).toHaveBeenCalledWith(searchRoute);
    });
  });
});
