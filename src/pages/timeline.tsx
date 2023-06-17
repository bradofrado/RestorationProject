import { type NextPage } from "next";
import { Timeline as TimelineContainer } from "~/utils/components/Timeline/Timeline";
import { Navbar } from "~/utils/components/page/navbar";
import { useGetCategories } from "~/utils/services/TimelineService";

const Timeline: NextPage = () => {
	const query = useGetCategories();
	if (query.isLoading || query.isError) {
		return <></>
	}
	const categories = query.data;
	return <>
		<Navbar/>
		<div className="min-h-screen flex flex-col justify-center align-middle">
			<TimelineContainer categories={categories}/>
		</div>
	</>
}

export default Timeline;