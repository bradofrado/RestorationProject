import { type NextPage } from "next";
import CondensedTimeline from "~/utils/components/Timeline/CondensedTimeline";
import { useService } from "~/utils/react-service-container";
import Link from "next/link";
import { useRouter } from "next/router";
import EventPageService, { type TimelinePages, countLinks } from "~/utils/components/event-page/EventPageService";
import { TimelineService } from "~/utils/components/Timeline/TimelineService";
import { CustomComponent } from "~/utils/components/AddComponent";

const Event_page : NextPage= () => {
	const router = useRouter();
	const { eventId } = router.query;
	const eventPageService = useService(EventPageService);
	const timelineService = useService(TimelineService);
	if (!eventId) {
		return <></>
	}
	const pageData = eventPageService.getPage(eventId as TimelinePages);
	
	const {title, description, settings} = pageData;

	//const items = timelineService.getItems(timelineItems);

	//TODO: make this so we are not calculating the anotation count in two places (CondensedTimeline also)
	//const annotationCount = countLinks(items);
	return <>
		<div className="max-w-4xl px-4 mx-auto sm:px-24 my-10">
			<Link href="/timeline" className="text-xs italic font-bold text-gray-600 no-underline uppercase hover:text-gray-800">&lt; Back to timeline</Link>
			<h1 className="mx-auto text-3xl font-bold my-5 text-bom">{title}</h1>
			<div>
				<p>
					{description}
				</p>
			</div>
			{/* <div className="py-10">
				<h2 className="text-xl font-bold">Timeline of Events</h2>
				<CondensedTimeline items={items} />
			</div>
			<Component linkCount={annotationCount}/> */}
			{settings.map((setting, i) => <CustomComponent key={i} type={setting.component} data={setting.data}/>)}
		</div>
	</>
}

export default Event_page;