import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import EventPageService from "~/utils/services/EventPageService";
import { CustomComponent } from "~/utils/components/AddComponent";
import { useService } from "~/utils/react-service-container";

const Event_page : NextPage= () => {
	const router = useRouter();
	const { eventId } = router.query;
	
	const isLoading = !eventId || Array.isArray(eventId);
	if (isLoading) {
		return <div>Loading...</div>
	}
	
	return <EventPage eventId={eventId}/>
}

const EventPage = ({eventId} : {eventId: string}) => {
	const pageService = useService(EventPageService);
	const query = pageService.getPage(eventId);

	if (query.isLoading) {
		return <div>Loading...</div>
	}

	if (query.isError) {
		return <div>Error: {query.error.message}</div>
	}
	
	const {title, description, settings} = query.data;

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