import Vue from 'vue';
import { config, mount, createLocalVue } from '@vue/test-utils';
import SearchMixin from '@/mixins/search';

config.logModifiedComponents = false;

/**
 * Tests in this file use render functions because we're using Webpack, and the template
 * compiler isn't present.
 *
 * @see https://vuejs.org/v2/guide/render-function.html
 * @see https://codeburst.io/dependency-injection-with-vue-js-f6b44a0dae6d
 */
describe('search mixin', () => {
  test('it injects the search service when present', () => {
    const localVue = createLocalVue();
    localVue.mixin(SearchMixin);

    const TestComponent = Vue.extend({
      render: () => '<div></div>',
      searchService: {}
    });

    const wrapper = mount(TestComponent, { localVue });
    expect(wrapper.vm.$searchService).toBeDefined();
  });

  test('it injects the search service into nested components when present', () => {
    const localVue = createLocalVue();
    localVue.mixin(SearchMixin);

    const NestedComponent = localVue.component('nested-component', {
      render(createElement) {
        if (this.$searchService) {
          return createElement('div', 'injected');
        } else {
          return createElement('div', 'missing');
        }
      }
    });

    const TestComponent = Vue.extend({
      render(createElement) {
        return createElement('div', [createElement(NestedComponent)]);
      },
      searchService: {},
      components: {
        NestedComponent
      }
    });

    const wrapper = mount(TestComponent, { localVue });
    expect(wrapper.text()).toMatch('injected');
  });

  test('it does not inject the search service when not present', () => {
    const localVue = createLocalVue();
    localVue.mixin(SearchMixin);

    const TestComponent = Vue.extend({
      render: () => '<div></div>'
    });

    const wrapper = mount(TestComponent, { localVue });
    expect(wrapper.vm.$searchService).not.toBeDefined();
  });
});
