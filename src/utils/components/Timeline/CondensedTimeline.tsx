import { type RestorationTimelineItem } from "~/utils/types/timeline";
import { DateFormat } from "~/utils/utils";
import { useAnnotationLink } from "../edit/add-component";

export interface CondensedTimelineProps {
	items: RestorationTimelineItem[],
	className?: string
}

const CondensedTimeline : React.FC<CondensedTimelineProps> = ({items, className}: CondensedTimelineProps) => {
	return <>
		<ul className={`condensed-timeline-container pt-5 ${className || ''}`}>
			{items.map((item, i) => <TimelineRow item={item} key={i} />)}
		</ul>
	</>
}

interface TimelineRowProps {
	item: RestorationTimelineItem
}
const TimelineRow : React.FC<TimelineRowProps> = ({item}: TimelineRowProps) => {
	const {annotate} = useAnnotationLink();
	if (!item.date) return <></>
	
	const date = item.endDate ? `${DateFormat.fullText(item.date)} to ${DateFormat.fullText(item.endDate)}` : DateFormat.fullText(item.date);
	return <>
		<li className="condensed-timeline-row">
			<div className="condensed-timeline-row-label">
				<p className="md:text-xl">{date}</p>
			</div>
			<div className="condensed-timeline-row-content">
				<p className="md:text-xl">
					<span>{item.text}</span>
					<span>{item.links.map((link, i) => <Annotation link={link} key={i} id={annotate(link)}/>)}</span>
				</p>
			</div>
		</li>
	</>
}

interface AnnotationProps {
	link: string,
	id: number
}
export const Annotation : React.FC<AnnotationProps> = (props: AnnotationProps) => {
	const {link, id} = props;
	return <>
		<span className="relative font-normal" role="annotation">
			<a className="no-underline" href={link} target="_blank">
				<span className="text-[0.75em] relative top-[-7px]">
					[<span className="underline">{id}</span>]
				</span>
			</a>
		</span>
	</>
}

export default CondensedTimeline;