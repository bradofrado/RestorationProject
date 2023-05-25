import { api } from "../api";
import { type RestorationTimelineItem, type TimelineCategory } from "../types/timeline";

export class TimelineService {
	getItems(category?: TimelineCategory): RestorationTimelineItem[] {
		const query = api.timeline.getItems.useQuery(category);

		return query.data || [];
	}
}


