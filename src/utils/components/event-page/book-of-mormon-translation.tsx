import { DateFormat, groupBy } from "~/utils/utils";
import { countLinks } from "../../services/EventPageService";
import { Annotation } from "../Timeline/CondensedTimeline";
import { type RestorationTimelineItem, type TimelineSubcategory } from "~/utils/types/timeline";

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
					{items.map((item) => {
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