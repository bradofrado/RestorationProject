import { type NextPage } from 'next';
import { getCategories } from '~/server/dao/categoriesDAO';
import { prisma } from '~/server/db';
import { Map } from '~/utils/components/map/map';
import { Layout } from '~/utils/components/page/layout';

const MapPage: NextPage = async () => {
  const categories = await getCategories(prisma);
  return (
    <>
      <Layout>
        <Map categories={categories} />
      </Layout>
    </>
  );
};

export default MapPage;
