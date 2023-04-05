import { type NextPage } from "next";
import { Timeline as TimelineContainer } from "~/utils/components/Timeline/Timeline";
import { TimelineService } from "~/utils/components/Timeline/TimelineService";
import { useService } from "~/utils/react-service-container";

const Timeline: NextPage = () => {
	const timelineService = useService(TimelineService);
	const items = timelineService.getItems();
	return <>
		<TimelineContainer items={items}/>
	</>
}

export default Timeline;