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
	const items = categories.reduce<TimelineItemStandalone[]>((prev, curr) => {
		const items: TimelineItemStandalone[] = curr.items.map(item => ({...item, color: curr.color, pageId: curr.pageId}));
		prev = prev.concat(items);

		return prev;
	}, [])
	return <div className="min-h-screen flex flex-col justify-center align-middle">
		<TimelineContainer items={items}/>
	</div>
}

export default Timeline;