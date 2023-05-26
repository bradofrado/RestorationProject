import { type EventPage } from "~/utils/types/page";
import { api } from "~/utils/api";
import { type RestorationTimelineItem } from "../types/timeline";

class EventPageService {
	getPage(id: string): EventPage | undefined {
		const query = api.page.getPage.useQuery(id);
		const data = query.data;
		
		return data;
	}
}

export const countLinks = (items: RestorationTimelineItem[]) => {
	return items.reduce((prev, curr) => prev + curr.links.length, 0);
}

export type EventPageComponent = React.FC<{
	linkCount: number
}>

export default EventPageService;