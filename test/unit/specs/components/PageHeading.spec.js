import { shallow } from '@vue/test-utils';
import PageHeading from '@/components/PageHeading';

describe('PageHeading.vue', () => {
  test('it renders a heading with the given title', () => {
    const title = 'Page Name';
    const wrapper = shallow(PageHeading, {
      propsData: {
        title
      }
    });

    expect(wrapper.find('h1').text()).toMatch(title);
  });
});
