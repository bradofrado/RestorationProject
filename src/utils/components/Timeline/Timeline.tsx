import dayjs from 'dayjs';
import ScrollDrag from '../ScrollDrag';

export const Timeline: React.FC<TimelineProps> = ({items}: TimelineProps) => {
	return <ScrollDrag rootClass="timeline-container">
		<>
			{items?.map((item, i) => <TimelineItem {...item} key={i}/>)}
		</>
	</ScrollDrag>
}

export const TimelineItem: React.FC<ITimelineItem> = (props: ITimelineItem) => {
	const date = dayjs(props.date).format('MMM, D');
	return <>
		<div className="timeline-item">
        <div className="timeline-item-content">
            <p>{props.text}</p>
						<div className="circle">
							<span className="">{date}</span>
						</div>
        </div>
    </div>	
		</> 
}

export interface ITimelineItem {
	date: Date,
	category: {
		color: string,
		tag: string
	},
	text: string,
	link: {
		url: string,
		text: string
	},
}

interface TimelineProps {
	items: ITimelineItem[]
}