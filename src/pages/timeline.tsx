import { type NextPage } from "next";
import { Timeline as TimelineContainer } from "~/utils/components/Timeline/Timeline";
import { TimelineService } from "~/utils/services/TimelineService";
import { useService } from "~/utils/react-service-container";
import { type TimelineItemStandalone } from "~/utils/types/timeline";

const Timeline: NextPage = () => {
	const timelineService = useService(TimelineService);
	const categories = timelineService.getCategories();
	const items = categories.reduce<TimelineItemStandalone[]>((prev, curr) => {
		const items: TimelineItemStandalone[] = curr.items.map(item => ({...item, color: curr.color, page: curr.page}));
		prev = prev.concat(items);

		return prev;
	}, [])
	return <div className="min-h-screen flex flex-col justify-center align-middle">
		<TimelineContainer items={items}/>
	</div>
}

export default Timeline;