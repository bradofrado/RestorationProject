import { type NextPage } from "next";
import CondensedTimeline from "~/utils/components/Timeline/CondensedTimeline";
import { TimelineService } from "~/utils/components/Timeline/TimelineService";
import { useService } from "~/utils/react-service-container";

const Book_of_mormon : NextPage= () => {
	const timelineService = useService(TimelineService);
	const items = timelineService.getItems();
	return <>
		<div className="max-w-4xl px-4 mx-auto sm:px-24">
			<h1 className="mx-auto text-3xl font-bold my-10 text-bom">Book of Mormon Translation Methods</h1>
			<div>
				<p >There are many accounts of the translation process of the Book of Mormon. Some agree, and some disagree. However, the only person that was there for the 
					full translation process was Joseph Smith, and all he says about the process is that it was done &#34;by the gift and power of God&#34;
				</p>
			</div>
			<div className="py-10">
				<h2 className="text-xl font-bold">Timeline of Events</h2>
				<CondensedTimeline items={items}/>
			</div>
		</div>
	</>
}

export default Book_of_mormon;