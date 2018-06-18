import { shallow } from '@vue/test-utils';

import AnnotationSufficiency from '@/components/AnnotationSufficiency';
import StarRating from 'vue-star-rating';

describe('AnnotationSufficiency.vue', () => {
  test('basic rendering', () => {
    const wrapper = shallow(AnnotationSufficiency, {
      propsData: {
        score: 0.4
      }
    });

    // Renders a span with the score category
    const categorySpan = wrapper.find('.score-category');
    expect(categorySpan.exists()).toBe(true);
    expect(categorySpan.text()).toEqual('Fair');

    // Renders a component with the score
    const scoreComponent = wrapper.find(StarRating);
    expect(scoreComponent.exists()).toBe(true);

    // The link to toggle the tips is displayed, but the tips are not
    const tipsToggle = wrapper.find('.display-tips');
    expect(tipsToggle.exists()).toBe(true);
    expect(wrapper.find('.tips-list').exists()).toBe(false);

    // Error text is not displayed
    const errorMessage = wrapper.find('.score-error');
    expect(errorMessage.exists()).toBe(false);
  });

  test('renders a warning if there is a scoring error', () => {
    const wrapper = shallow(AnnotationSufficiency, {
      propsData: {
        score: 0.25,
        error: null
      }
    });

    expect(wrapper.find('.score-error').exists()).toBe(false);

    wrapper.setProps({ error: new Error('example') });
    expect(wrapper.find('.score-error').exists()).toBe(true);
  });

  test('clampIndex helper method', () => {
    const wrapper = shallow(AnnotationSufficiency);

    expect(wrapper.vm._clampIndex(-1)).toEqual(0);
    expect(wrapper.vm._clampIndex(0)).toEqual(0);
    expect(wrapper.vm._clampIndex(2)).toEqual(2);
    expect(wrapper.vm._clampIndex(4)).toEqual(4);
    expect(wrapper.vm._clampIndex(5)).toEqual(4);
  });

  describe('actions', () => {
    test('toggling the list of tips', () => {
      const tipsSelector = '.tips-list';
      const wrapper = shallow(AnnotationSufficiency, {
        propsData: {
          score: 0.4
        }
      });

      // tips start out hidden
      expect(wrapper.find(tipsSelector).exists()).toBe(false);

      const toggleLink = wrapper.find('.display-tips a');

      // click the toggle to display the tips
      toggleLink.trigger('click');
      expect(wrapper.find(tipsSelector).exists()).toBe(true);

      // click the toggle to hide the tips again
      toggleLink.trigger('click');
      expect(wrapper.find(tipsSelector).exists()).toBe(false);
    });
  });

  describe('computed properties', () => {
    test('categoryCount', () => {
      const wrapper = shallow(AnnotationSufficiency);
      expect(wrapper.vm.categoryCount).toEqual(wrapper.vm.categoryLabels.length);
    });

    test('scaledScore', () => {
      const wrapper = shallow(AnnotationSufficiency, {
        propsData: {
          score: 0
        }
      });

      expect(wrapper.vm.scaledScore).toEqual(0);

      wrapper.setProps({ score: 0.2 });
      expect(wrapper.vm.scaledScore).toEqual(1.0);
    });

    test('category', () => {
      const wrapper = shallow(AnnotationSufficiency, {
        propsData: {
          score: 0
        }
      });

      expect(wrapper.vm.category).toEqual('Very Poor');

      wrapper.setProps({ score: 0.2 });
      expect(wrapper.vm.category).toEqual('Poor');

      wrapper.setProps({ score: 0.4 });
      expect(wrapper.vm.category).toEqual('Fair');

      wrapper.setProps({ score: 0.6 });
      expect(wrapper.vm.category).toEqual('Good');

      wrapper.setProps({ score: 0.8 });
      expect(wrapper.vm.category).toEqual('Very Good');

      wrapper.setProps({ score: 1.0 });
      expect(wrapper.vm.category).toEqual('Very Good');
    });
  });
});
