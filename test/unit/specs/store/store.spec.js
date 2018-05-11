import storeConfig from '@/store';

describe('vuex store', () => {
  test('exports the initial state', () => {
    expect(storeConfig.state).toBeDefined();
    expect(storeConfig.state.selectedTerms).toEqual([]);
  });

  test('exports the mutations', () => {
    expect(storeConfig.mutations).toBeDefined();
  });
});
