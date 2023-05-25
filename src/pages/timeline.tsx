import { type NextPage } from "next";
import { Timeline as TimelineContainer } from "~/utils/components/Timeline/Timeline";
import { TimelineService } from "~/utils/services/TimelineService";
import { useService } from "~/utils/react-service-container";

const Timeline: NextPage = () => {
	const timelineService = useService(TimelineService);
	const items = timelineService.getItems();
	return <div className="min-h-screen flex flex-col justify-center align-middle">
		<TimelineContainer items={items}/>
	</div>
}

export default Timeline;