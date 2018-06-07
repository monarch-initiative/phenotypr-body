import store from '@/store';
import { routes, checkTermsAccepted } from '@/router';

jest.mock('@/store', () => {
  return {
    state: {
      selectedTerms: [],
      termsOfUseAccepted: false
    }
  };
});

describe('router', () => {
  describe('checkTermsAccepted() guard', () => {
    const fromRoute = {};
    const termsOfUsePath = '/terms-of-use';
    const toRoute = { path: '/example', meta: { requireTermsOfUse: true } };
    const noMetaRoute = { path: '/example' };

    test('routes have metadata indicating if terms need to be accepted', () => {
      const unprotected = [ termsOfUsePath ];
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
      checkTermsAccepted(toRoute, fromRoute, next);
      expect(next).toHaveBeenCalledWith({ path: termsOfUsePath });

      next.mockReset();
      checkTermsAccepted(noMetaRoute, fromRoute, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });

    test('when terms of use have been accepted', () => {
      store.state.termsOfUseAccepted = true;
      const next = jest.fn();
      checkTermsAccepted(toRoute, fromRoute, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });
  });
});
