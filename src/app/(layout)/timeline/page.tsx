import { type NextPage } from 'next';
import { getCategories } from '~/server/dao/categoriesDAO';
import { prisma } from '~/server/db';
import { Timeline as TimelineContainer } from '~/utils/components/Timeline/Timeline';

const Timeline: NextPage = async () => {
  const categories = await getCategories(prisma);
  return (
    <div className="flex flex-col justify-center align-middle">
      <TimelineContainer categories={categories} />
    </div>
  );
};

export default Timeline;
