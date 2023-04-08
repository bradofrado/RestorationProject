import { type NextPage } from "next";
import CondensedTimeline, { Annotation } from "~/utils/components/Timeline/CondensedTimeline";
import { type TimelineSubcategory, type RestorationTimelineItem } from "~/utils/components/Timeline/TimelineService";
import { TimelineService } from "~/utils/components/Timeline/TimelineService";
import { DateFormat, groupBy } from "~/utils/utils";
import { useService } from "~/utils/react-service-container";

const countLinks = (items: RestorationTimelineItem[]) => {
	return items.reduce((prev, curr) => prev + curr.links.length, 0);
}

const Book_of_mormon : NextPage= () => {
	const timelineService = useService(TimelineService);
	const bomItems = timelineService.getItems("Book of Mormon");
	const bomTranslationItems = timelineService.getItems("Book of Mormon Translation");

	//TODO: make this so we are not calculating the anotation count in two places (CondensedTimeline also)
	let annotationCount = countLinks(bomItems);
	return <>
		<div className="max-w-4xl px-4 mx-auto sm:px-24">
			<h1 className="mx-auto text-3xl font-bold my-10 text-bom">Book of Mormon Translation</h1>
			<div>
				<p>
					The translation of the Book of Mormon can be considered the most pivotal question regarding the truthfulness of the restoration. 
					Joseph Smith was the only person that was present during the whole translation process, and all he said was that it was by &#34;the gift and power of God.&#34;
				</p>
			</div>
			<div className="py-10">
				<h2 className="text-xl font-bold">Timeline of Events</h2>
				<CondensedTimeline items={bomItems} />
			</div>
			<div className="py-5">
				<h2 className="text-xl font-bold">Translation Methods</h2>
				<p className="my-5">
				There are many accounts of the method of translation for the Book of Mormon. Some agree, and some disagree. When considering all of the accounts, scholars
				consider it best to view them with a &#34;this and that&#34; approach as opposed to a &#34;either this or that&#34; approach.
				</p>
				{Object.entries(groupBy(bomTranslationItems, "subcategory")).map(([title, items], i) => {
					const content = <TranslationMethods items={items} title={title as TimelineSubcategory} key={i} linkNumber={annotationCount}/>;
					annotationCount += countLinks(items);
					return content;
				})}
			</div>
		</div>
	</>
}

interface TranslationMethodsProps {
	items: RestorationTimelineItem[],
	title: TimelineSubcategory,
	linkNumber: number
}
const TranslationMethods: React.FC<TranslationMethodsProps> = (props: TranslationMethodsProps) => {
	const {items, title, linkNumber} = props;
	let linkNum = linkNumber;
	return <>
		<ul className="">
			<li>
				<h3 className="text-xl">{title}</h3>
				<ul className="list-disc px-10 py-2">
					{items.map((item, i) => {
					const [quote, name] = item.text.split('-');
					const content = <li key={i}>
							<span className="italic" >{quote}</span>
							<span className="font-medium">-{name} </span>
							<span className="">{DateFormat.fullText(item.date)}</span>
							<span>{item.links.map((link, i) => <Annotation link={link} key={i} id={linkNum + i + 1}/>)}</span>
						</li>
					linkNum += item.links.length;
					return content;
					})}
				</ul>
			</li>
		</ul>
	</>
}

export default Book_of_mormon;