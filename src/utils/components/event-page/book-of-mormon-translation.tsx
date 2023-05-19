import { DateFormat, groupBy } from "~/utils/utils";
import { countLinks, type EventPageComponent } from "./EventPageService";
import { useService } from "~/utils/react-service-container";
import { type RestorationTimelineItem, TimelineService, type TimelineSubcategory } from "../Timeline/TimelineService";
import { Annotation } from "../Timeline/CondensedTimeline";


const BookOfMormonTranslationMethods: EventPageComponent = ({linkCount}) => {
	const timelineService = useService(TimelineService);
	const bomTranslationItems = timelineService.getItems("Book of Mormon Translation");
	const annotationCount = bomTranslationItems.reduce((prev, curr) => {
		return prev + curr.links.length;
	}, linkCount)
  return <>
		<div className="py-5">
			<h2 className="text-xl font-bold">Translation Methods</h2>
			<p className="my-5">
			There are many accounts of the method of translation for the Book of Mormon. Some agree, and some disagree. When considering all of the accounts, scholars
			consider it best to view them with a &#34;this and that&#34; approach as opposed to a &#34;either this or that&#34; approach. The reason for this is that the contempory accounts
			of the translation process suggest that Joseph used a variety of methods of translation instead of just one. Not one of these accounts was there for the full translation process--
			only Joseph Smith himself who did not give any details to the methods.
			</p>
			<TranslationMethodsContainer items={bomTranslationItems} annotationCount={linkCount}/>
		</div>
		<div className="py-5">
			<h2 className="text-xl font-bold">Other sources</h2>
			<p className="my-5">
				Here are a few other insights to scholars and other professionals that give insights to the Book of Mormon and the methods of translation.
			</p>
			<ul className="list-disc px-10">
				<li>Book of Mormon Translation, Gospel Topics Essay from churchofjesuschrist.org <Annotation link="https://www.churchofjesuschrist.org/study/manual/gospel-topics-essays/book-of-mormon-translation?lang=eng" id={annotationCount + 1}/></li>
				<li>The Translation Miracle of the Book of Mormon by Elder Robert K. Dellenbach <Annotation link="https://www.churchofjesuschrist.org/study/general-conference/1995/04/the-translation-miracle-of-the-book-of-mormon?lang=eng" id={annotationCount + 2}/></li>
				<li>The Credibility of the Book of Mormon Translators by Richard L. Anderson <Annotation link="https://rsc.byu.edu/book-mormon-authorship/credibility-book-mormon-translators" id={annotationCount + 3}/></li>
				<li>The Book of Mormon: Historical Setting for Its Translation and Publication by Larry C. Porter <Annotation link="https://rsc.byu.edu/joseph-smith-prophet-man/book-mormon-historical-setting-its-translation-publication" id={annotationCount + 4}/></li>
			</ul>
		</div>
	</>
}

interface TranslationMethodsContainerProps {
	items: RestorationTimelineItem[],
	annotationCount: number,
	className?: string
}
export const TranslationMethodsContainer = ({items, annotationCount, className}: TranslationMethodsContainerProps) => {
	return <div className={className || ''}>
		{Object.entries(groupBy(items, "subcategory")).map(([title, items], i) => {
				const content = <TranslationMethods items={items} title={title as TimelineSubcategory} key={i} linkNumber={annotationCount}/>;
				annotationCount += countLinks(items);
				return content;
			})}
	</div>
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
		<ul>
			<li>
				<h3 className="text-xl">{title}</h3>
				<ul className="list-disc px-10 py-2">
					{items.map((item, i) => {
					const content = <RestorationQuote item={item} linkNum={linkNum}/>
					linkNum += item.links.length;
					return content;
					})}
				</ul>
			</li>
		</ul>
	</>
}

export const RestorationQuote = ({item, linkNum}: {item: RestorationTimelineItem, linkNum: number}) => {
	const [quote, name] = item.text.split('-');
	return (
		<li>
			<span className="italic" >{quote}</span>
			<span className="font-medium">-{name} </span>
			<span className="">{DateFormat.fullText(item.date)}</span>
			<span>{item.links.map((link, i) => <Annotation link={link} key={i} id={linkNum + i + 1}/>)}</span>
		</li>
	)
}


export default BookOfMormonTranslationMethods;