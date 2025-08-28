import { type NextPage } from 'next';
import { Map } from '~/utils/components/map/map';
import { Layout } from '~/utils/components/page/layout';
import { useGetCategories } from '~/utils/services/TimelineService';

const Timeline: NextPage = () => {
  const query = useGetCategories();
  if (query.isLoading || query.isError) {
    return <>Loading</>;
  }
  const categories = query.data;
  return (
    <>
      <Layout>
        <Map categories={categories} />
      </Layout>
    </>
  );
};

export default Timeline;
