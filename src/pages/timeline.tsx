import { type NextPage } from 'next';
import { Timeline as TimelineContainer } from '~/utils/components/Timeline/Timeline';
import { Layout } from '~/utils/components/page/layout';
import { useGetCategories } from '~/utils/services/TimelineService';

const Timeline: NextPage = () => {
  const query = useGetCategories();
  if (query.isLoading || query.isError) {
    return <></>;
  }
  const categories = query.data;
  return (
    <>
      <Layout>
        <div className="flex flex-col justify-center align-middle">
          <TimelineContainer categories={categories} />
        </div>
      </Layout>
    </>
  );
};

export default Timeline;
