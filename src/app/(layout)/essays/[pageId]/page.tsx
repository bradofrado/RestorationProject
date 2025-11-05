import { type NextPage } from 'next';
import Link from 'next/link';
import { getCategories } from '~/server/dao/categoriesDAO';
import { getPage, getPages } from '~/server/dao/pageDAO';
import { prisma } from '~/server/db';
import { RenderPage } from '~/utils/components/event-page/render-page';
import { CategoryProvider } from '~/utils/services/TimelineService';

const Event_page: NextPage<{ params: Promise<{ pageId: string }> }> = async ({
  params,
}) => {
  const { pageId } = await params;
  const page = await getPage({ db: prisma, input: pageId });
  const categories = await getCategories(prisma);
  return (
    <div className="mx-auto mb-10 w-full max-w-4xl px-4 sm:px-24">
      <Link
        href="/timeline"
        className="text-xs font-bold uppercase italic text-gray-600 no-underline hover:text-gray-800"
      >
        &lt; Back to timeline
      </Link>
      <CategoryProvider categories={categories}>
        <RenderPage page={page} />
      </CategoryProvider>
    </div>
  );
};

export const generateStaticParams = async () => {
  const pages = await getPages({ db: prisma, isPublished: true });

  return pages.map((page) => ({
    pageId: page.url,
  }));
};

export default Event_page;
