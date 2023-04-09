import { type NextPage } from "next";
import Link from "next/link";

const Index: NextPage = () => {
 return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-extrabold tracking-tight text-bom sm:text-[5rem] my-10">
				Witnesses of the Restoration
			</h1>
			<div className="flex">
				<Link
					className="p-3 font-bold text-white no-underline rounded bg-bom white hover:bg-primary"
					href="/timeline"
				>
					Go to timeline
				</Link>
			</div>
    </div>
  );
};

export default Index;
