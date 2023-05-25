import { RestorationTimelineItem } from "~/utils/types/timeline";
import { DateFormat } from "~/utils/utils";

export interface CondensedTimelineProps {
	items: RestorationTimelineItem[],
	className?: string
}

const CondensedTimeline : React.FC<CondensedTimelineProps> = (props: CondensedTimelineProps) => {
	const {items, className} = props;
	let linkCounts = 0;
	return <>
		<div className={`condensed-timeline-container pt-5 ${className || ''}`}>
			{items.map((item, i) => {
				const content = <TimelineRow item={item} key={i} linkNumber={linkCounts}/>
				linkCounts += item.links.length;
				return content;
			})}
		</div>
	</>
}

interface TimelineRowProps {
	item: RestorationTimelineItem,
	linkNumber: number
}
const TimelineRow : React.FC<TimelineRowProps> = (props: TimelineRowProps) => {
	const {item, linkNumber} = props;
	const date = item.endDate ? `${DateFormat.fullText(item.date)} to ${DateFormat.fullText(item.endDate)}` : DateFormat.fullText(item.date);
	return <>
		<div className="condensed-timeline-row">
			<div className="condensed-timeline-row-label">
				<p className="md:text-xl">{date}</p>
			</div>
			<div className="condensed-timeline-row-content">
				<p className="md:text-xl">
					<span>{item.text}</span>
					<span contentEditable="false">{item.links.map((link, i) => <Annotation link={link} key={i} id={linkNumber + i + 1}/>)}</span>
				</p>
			</div>
		</div>
	</>
}

interface AnnotationProps {
	link: string,
	id: number
}
export const Annotation : React.FC<AnnotationProps> = (props: AnnotationProps) => {
	const {link, id} = props;
	return <>
		<span className="relative font-normal">
			<a className="no-underline" href={link} target="_blank">
				<span className="text-[0.75em] relative top-[-7px]">
					[<span className="underline">{id}</span>]
				</span>
			</a>
		</span>
	</>
}

export default CondensedTimeline;