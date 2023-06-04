import { type NextPage } from "next";
import { Timeline as TimelineContainer } from "~/utils/components/Timeline/Timeline";
import { useGetCategories } from "~/utils/services/TimelineService";
import { type TimelineItemStandalone } from "~/utils/types/timeline";

const Timeline: NextPage = () => {
	const query = useGetCategories();
	if (query.isLoading || query.isError) {
		return <></>
	}
	const categories = query.data;
	return <div className="min-h-screen flex flex-col justify-center align-middle">
		<TimelineContainer categories={categories}/>
	</div>
}

export default Timeline;