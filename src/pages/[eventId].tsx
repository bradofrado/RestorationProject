import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { CustomComponents } from "~/utils/components/edit/add-component";
import { Layout } from "~/utils/components/page/layout";
import { useGetPage } from "~/utils/services/EventPageService";
import { EventPage } from "~/utils/types/page";

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
	
	return <Layout>
		<div className="max-w-4xl px-4 mx-auto sm:px-24 mb-10 w-full">
			<Link href="/timeline" className="text-xs italic font-bold text-gray-600 no-underline uppercase hover:text-gray-800">&lt; Back to timeline</Link>
			<RenderPage page={query.data}/>
		</div>
	</Layout>
}

interface RenderPageProps {
	page: EventPage
}
export const RenderPage = ({page}: RenderPageProps) => {
	const {settings} = page;
	return <div className="w-full px-2 py-6 sm:px-0">
		<CustomComponents items={settings.map((setting, i) => ({type: setting.component, data: setting.data, id: i}))}/>
	</div>
}

export default Event_page;