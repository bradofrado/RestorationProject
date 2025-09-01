import Link from 'next/link';
import { Suspense, type FC } from 'react';
import TabControl, { type TabItem } from '~/utils/components/base/tab';
import { EditPages } from '~/utils/components/edit/edit-pages';
import { EditTimelineItems } from '~/utils/components/edit/edit-timeline-items';

export const EditTabs: FC<{ tab: 'page' | 'timeline' }> = ({ tab }) => {
  const tabItems: TabItem[] = [
    {
      label: 'Page Items',
      component: <EditPages />,
      href: '/edit/essays',
    },
    {
      label: 'Timeline Items',
      component: <EditTimelineItems />,
      href: '/edit/timelines',
    },
  ];
  return (
    <div className="mx-auto mb-10 w-full max-w-4xl px-4 sm:px-24">
      <Link
        href="/timeline"
        className="text-xs font-bold uppercase italic text-gray-600 no-underline hover:text-gray-800"
      >
        &lt; Back to timeline
      </Link>
      <Suspense>
        <TabControl
          selectedIndex={tab === 'page' ? 0 : 1}
          items={tabItems}
          className="w-full px-2 py-6 sm:px-0"
        />
      </Suspense>
    </div>
  );
};
