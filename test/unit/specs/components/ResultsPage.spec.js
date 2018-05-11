import { shallow } from '@vue/test-utils';
import ResultsPage from '@/components/ResultsPage';

describe('ResultsPage.vue', () => {
  test('renders', () => {
    const wrapper = shallow(ResultsPage);
    expect(wrapper.classes()).toContain('results-page');
  });
});
