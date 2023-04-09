import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useService } from "~/utils/react-service-container";
import { HomeService } from "./services/HomeService";

const Index: NextPage = () => {
  const homeService = useService(HomeService);
	const name = homeService.getName();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-extrabold tracking-tight text-bom sm:text-[5rem] my-10">
				{name}
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
