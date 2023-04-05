import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useService } from "~/utils/react-service-container";
import { HomeService } from "./services/HomeService";

const Index: NextPage = () => {
  const homeService = useService(HomeService);
	const name = homeService.getName();
  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
				{name}
			</h1>
			<div className="flex">
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
					href="/timeline"
				>
					<h3 className="text-2xl font-bold">Restoration Timeline →</h3>
					<div className="text-lg">
						Learn about the Restoration of the Church of Jesus Christ of Latter-day Saints from primary accounts
					</div>
				</Link>
			</div>
    </>
  );
};

export default Index;
