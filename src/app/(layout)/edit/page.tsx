import { type NextPage } from 'next';
import Link from 'next/link';
import TabControl, { type TabItem } from '~/utils/components/base/tab';
import { EditPages } from '~/utils/components/edit/edit-pages';
import { EditTimelineItems } from '~/utils/components/edit/edit-timeline-items';

const EditPage: NextPage = () => {
  const tabItems: TabItem[] = [
    {
      label: 'Page Items',
      component: <EditPages />,
    },
    {
      label: 'Timeline Items',
      component: <EditTimelineItems />,
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
      <TabControl items={tabItems} className="w-full px-2 py-6 sm:px-0" />
    </div>
  );
};

export default EditPage;
