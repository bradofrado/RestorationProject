import { type NextPage } from "next";
import Link from "next/link";
import Button from "~/utils/components/base/button";

const Index: NextPage = () => {
 return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-[5rem] sm:leading-[1] my-10 text-center">
				Witnesses of the Restoration
		</h1>
		<div className="flex">
			<Button as={Link} href="/timeline" className="py-3 px-3 font-bold sm:text-base">Go to timeline</Button>
		</div>
    </div>
  );
};

export default Index;
