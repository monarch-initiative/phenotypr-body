import { shallowMount } from '@vue/test-utils';
import PageHeading from '@/components/PageHeading';

describe('PageHeading.vue', () => {
  test('it renders a heading with the given title', () => {
    const title = 'Page Name';
    const wrapper = shallowMount(PageHeading, {
      propsData: {
        title
      }
    });

    expect(wrapper.find('h1').text()).toMatch(title);
  });
});
