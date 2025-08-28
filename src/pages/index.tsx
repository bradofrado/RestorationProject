import { type NextPage } from 'next';
import Link from 'next/link';
import Button from '~/utils/components/base/buttons/button';

const Index: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="my-10 text-center text-4xl font-extrabold tracking-tight text-gray-800 sm:text-[5rem] sm:leading-[1]">
        Witnesses of the Restoration
      </h1>
      <Button
        as={Link}
        href="/map"
        className="px-3 py-3 font-bold sm:text-base"
      >
        Go to map
      </Button>
      <div className="flex">
        <Button
          as={Link}
          href="/timeline"
          className="px-3 py-3 font-bold sm:text-base"
        >
          Go to timeline
        </Button>
      </div>
    </div>
  );
};

export default Index;
