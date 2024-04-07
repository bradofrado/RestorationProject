import { type NextPage } from "next";
import Link from "next/link";
import Button from "~/utils/components/base/buttons/button";

const Index: NextPage = () => {
 return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-[5rem] sm:leading-[1] my-10 text-center">
				Closer to Christ
		</h1>
		<div className="flex gap-2">
			<Button as={Link} href="/map" className="py-3 px-3 font-bold sm:text-base">Go to map</Button>
			<Button as={Link} href="/timeline" className="py-3 px-3 font-bold sm:text-base">Go to timeline</Button>
		</div>
    </div>
  );
};

export default Index;
