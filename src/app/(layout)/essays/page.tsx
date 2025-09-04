import { type NextPage } from 'next';
import Link from 'next/link';
import { getPages } from '~/server/dao/pageDAO';
import { prisma } from '~/server/db';
import Header from '~/utils/components/base/header';
import { getPageUrl } from '~/utils/get-page-url';

const EssaysPage: NextPage = async () => {
  const pages = await getPages({ db: prisma, isPublished: true });
  return (
    <div className="mx-auto mt-5 max-w-xl">
      <Header level={1}>Essays</Header>
      <div className="mt-4 flex flex-col gap-4">
        {pages.map((page) => (
          <Link
            href={getPageUrl(page.url)}
            className="rounded-lg border bg-white p-4 hover:shadow-lg"
            key={page.id}
          >
            <Header level={2}>{page.title}</Header>
            <p className="text-gray-500">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EssaysPage;
