import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { CustomComponent } from "~/utils/components/edit/add-component";
import { useGetPage } from "~/utils/services/EventPageService";

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
	const query = useGetPage(eventId);

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
			{settings.map((setting, i) => <CustomComponent key={i} type={setting.component} data={setting.data}/>)}
		</div>
	</>
}

export default Event_page;