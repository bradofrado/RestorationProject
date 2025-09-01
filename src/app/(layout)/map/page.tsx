import { type NextPage } from 'next';
import { getCategories } from '~/server/dao/categoriesDAO';
import { prisma } from '~/server/db';
import { Map } from '~/utils/components/map/map';

const MapPage: NextPage = async () => {
  const categories = await getCategories(prisma);
  return <Map categories={categories} />;
};

export default MapPage;
