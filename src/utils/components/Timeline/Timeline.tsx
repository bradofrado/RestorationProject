import dayjs from 'dayjs';

export const Timeline: React.FC<TimelineProps> = ({items}: TimelineProps) => {
	return <div className="timeline-container">
		{items?.map((item, i) => <TimelineItem {...item} key={i}/>)}
	</div>
}

export const TimelineItem: React.FC<ITimelineItem> = (props: ITimelineItem) => {
	const date = dayjs(props.date).format('DD/MM/YYY');
	return <>
		<div className="timeline-item">
        <div className="timeline-item-content">
            <p>{props.text}</p>
            <span className="circle" />
						<span className="date">{date}</span>
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