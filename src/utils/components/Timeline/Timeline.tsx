import dayjs from 'dayjs';
import ScrollDrag from '../ScrollDrag';
import { CSSProperties, ReactNode } from 'react';

interface TimelineProps {
	items: RestorationTimelineItem[]
}
export const Timeline: React.FC<TimelineProps> = ({items}: TimelineProps) => {
	const sorted = items.slice().sort((a, b) => {
		if (a.date < b.date) {
			return -1;
		} else if (a.date > b.date) {
			return 1;
		}

		return 0;
	});

	const lastDate = sorted[sorted.length - 1]?.date as Date;
	const firstDate = sorted[0]?.date as Date;

	const yearDiff = lastDate.getFullYear() - firstDate.getFullYear() + 1;
	const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	const monthItems = (() => {
		let timeItems: TimelineItem[] = [];
		const offset = 166;
		const firstYear = firstDate.getFullYear();
		const getYearOffset = (year: number) => {
			return year * months.length * offset;
		}
		const getMonthOffset = (month: number) => {
			return month * offset;
		}
		const getDayOffset = (day: number) => {
			return day / 31.0 * offset;
		}

		for (let i = 0; i < yearDiff; i++) {
			timeItems = timeItems.concat(months.map((m, inx) => {
				//const content = m === 0 ? <div className="date-indicator timeline-item-connector">{firstYear + i}</div> : null;
				const item: TimelineItem = {
					graphDate: dayjs(new Date(firstYear + i, m, 1)).format("MMM"), 
					//x: getMonthOffset(inx) + getYearOffset(i),
					x: 0,
					below: false,
					date: m === 0 ? (firstYear + i).toString() : undefined
				};

				return item;
			}));
		}
		
		return timeItems.slice().sort((a, b) => a.x - b.x);
	})();

	const timeItems = (() => {
		const offset = 166;
		const firstYear = firstDate.getFullYear();
		const getYearOffset = (year: number) => {
			return year * months.length * offset;
		}
		const getMonthOffset = (month: number) => {
			return month * offset;
		}
		const getDayOffset = (day: number) => {
			return day / 31.0 * offset;
		}
		let currDate: Date | null = null;
		let currDateCount = 0;
		const timeItems: TimelineItem[] = [];
		for (let i = 0; i < sorted.length; i++) {
			const item = sorted[i] as RestorationTimelineItem;
			if (!currDate || (item.date.getFullYear() != currDate.getFullYear() || (item.date.getMonth() - currDate.getMonth()) > 1)) {
				currDate = item.date;
				currDateCount = 0;
			} else {
				currDateCount++;
			}

			timeItems.push({
				date: dayjs(item.date).format("MMM, D"),
				x: getYearOffset(item.date.getFullYear() - firstYear) + getMonthOffset(item.date.getMonth()) + getDayOffset(item.date.getDate()),
				below: currDateCount % 2 === 0,
				content: <div className="restoration-item timeline-item-connector">
										<p>{item.text}</p>
								</div>,
			});
		}

		return timeItems;
	})();


	return <div className="w-full">
		{/* <h1 className="text-4xl font-bold tracking-tight text-center pb-5 text-gray-100">{yearDiff}</h1> */}
		<ScrollDrag rootClass="timeline-container">
			<>
				{monthItems?.map((item, i) => <TimelineItemComponent {...item} key={i}/>)}
				{timeItems?.map((item, i) => <TimelineItemComponent {...item} key={i}/>)}
			</>
		</ScrollDrag>
	</div>
}


const TimelineItemComponent: React.FC<TimelineItem> = (props: TimelineItem) => {
	const {date, x, content, below, graphDate} = props;
	//const date = dayjs(item.date).format('MMM');
	let belowClass = below ? ' below' : '';
	const style: CSSProperties | undefined = x > 0 ? {left: `${x}px`} : undefined;
	if (x > 0) {
		belowClass += ' absolute';
	} else {
		belowClass += ' relative';
	}
	return <>
		<div className={"timeline-item" + belowClass} style={style}>
				<div className="timeline-item-content">
					{date && <div className="date-indicator timeline-item-connector">{date}</div>}
				</div>
				<div className="timeline-item-content">
					{content}
				</div>
				{graphDate && <div className="circle">
					<span className="">{graphDate}</span>
				</div>}
    </div>	
		</> 
}

export interface TimelineItem {
	graphDate?: string,
	x: number,
	below: boolean,
	content?: ReactNode,
	date?: string
}

export type TimelineCategory = "Book of Mormon";

export interface RestorationTimelineItem {
	date: Date,
	category: TimelineCategory,
	text: string,
	links: string[],
}