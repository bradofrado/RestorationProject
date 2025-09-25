import { render, getAllByRole, itemsSorted, categories } from './util';
import userEvent from '@testing-library/user-event';
import {
  TimelineContainer,
  type TimelineProps,
} from '../utils/components/Timeline/Timeline';
const getUrl = (pageId: string) => {
  return pageId;
};

jest.mock('src/utils/services/EventPageService', () => ({
  useGetPageUrl: () => ({
    isLoading: false,
    isError: false,
    data: getUrl,
  }),
}));

const renderTimeline = (props?: TimelineProps) => {
  const defaultProps = {
    categories: categories,
  };
  return {
    user: userEvent.setup(),
    ...render(<TimelineContainer {...props} {...defaultProps} />),
  };
};

describe('<Timeline/>', () => {
  test('should show 13 timeline items with correct sorting', () => {
    const { getAllByTestId } = renderTimeline();

    const items = getAllByTestId('timeline-item');
    expect(items.length).toBe(itemsSorted.length);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemSorted = itemsSorted[i];
      if (!item || !itemSorted) {
        fail('Cannot find item ' + i.toString());
      }

      expect(item.getElementsByTagName('p').length).toBe(1);
      expect(getAllByRole(item, 'link').length).toBe(itemSorted.links.length);

      const p = item.getElementsByTagName('p')[0];

      if (!p) {
        fail('Cannot find paragraph ' + i.toString());
      }

      expect(p.innerHTML).toContain(itemSorted.text);

      for (let j = 0; j < itemSorted.links.length; j++) {
        const a = item.getElementsByTagName('a')[j];
        if (!a) {
          fail(`Cannot find a tag ${j} for item ${i}`);
        }

        expect(a.href).toBe(itemSorted.links[j]);
      }

      // await user.hover(item);

      // if (itemSorted.pageId) {
      // 	expect(getAllByRole(item, 'link').length).toBe(itemSorted.links.length + 1);
      // 	const a = item.getElementsByTagName('a')[itemSorted.links.length];
      // 	if (!a) {
      // 		fail('Cannot find hover tag ' + i.toString());
      // 	}

      // 	expect(a.href).toBe(`http://localhost/${getUrl(itemSorted.pageId)}`);
      // } else {
      // 	expect(getAllByRole(item, 'link').length).toBe(itemSorted.links.length);
      // }
    }
  });
});
