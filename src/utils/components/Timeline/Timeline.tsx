import dayjs from 'dayjs';
import ScrollDrag from '../base/scroll-drag';
import { type ReactElement, type CSSProperties,  useRef, useEffect } from 'react';
import Link from 'next/link';
import { PrimaryColor, type HexColor } from '~/utils/types/colors';
import React from 'react';
import {type TimelineItemStandalone} from '~/utils/types/timeline';
import { useGetPageUrl } from '~/utils/services/EventPageService';

interface TimelineProps {
	items: TimelineItemStandalone[]
}
export const Timeline: React.FC<TimelineProps> = ({items}: TimelineProps) => {
	const query = useGetPageUrl();
	if (query.isLoading || query.isError || items.length == 0) {
		return <>Loading</>
	}
	const getUrl = query.data;

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
		const firstYear = firstDate.getFullYear();
		
		for (let i = 0; i < yearDiff; i++) {
			timeItems = timeItems.concat(months.map(m => {
				//const content = m === 0 ? <div className="date-indicator timeline-item-connector">{firstYear + i}</div> : null;
				const item: TimelineItem = {
					graphDate: dayjs(new Date(firstYear + i, m, 1)).format("MMM"), 
					//x: getMonthOffset(inx) + getYearOffset(i),
					x: 0,
					below: false,
					date: m === 0 ? (firstYear + i).toString() : undefined,
					color: PrimaryColor
				};

				return item;
			}));
		}

		return timeItems.slice().sort((a, b) => a.x - b.x);
	})();

	const timeItems = (() => {
		const offset = 125;
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
			const item = sorted[i];
			if (!item) continue;

			if (!currDate || (item.date.getFullYear() != currDate.getFullYear() || (item.date.getMonth() - currDate.getMonth()) > 1)) {
				currDate = item.date;
				currDateCount = 0;
			} else {
				currDateCount++;
			}

			if (item.color == undefined) {
				throw new Error(`item ${item.date.toDateString()} does not have color`);
			}

			const hoverState = item.text.length > 125 ? 'hover:w-[500px] group' : '';

			timeItems.push({
				date: dayjs(item.date).format("MMM, D"),
				x: getYearOffset(item.date.getFullYear() - firstYear) + getMonthOffset(item.date.getMonth()) + getDayOffset(item.date.getDate()),
				below: currDateCount % 2 === 0,
				content: <Link className={`restoration-item overflow-auto w-[200px] hover:z-20 ${hoverState} h-[200px] absolute transition-width ease-in-out`} href={`/${getUrl(item.pageId)}`}>
							<p className="text-sm md:text-base mt-3 overflow-hidden group-hover:mt-0 group-hover:overflow-auto">{item.text}</p>
						</Link>,
				color: item.color
			});
		}

		return timeItems;
	})();


	return <>
		<div className="w-full">
			<h1 className="text-4xl font-bold tracking-tight text-center pb-5 text-gray-800 mb-[100px]">Timeline {firstDate.getFullYear()} - {lastDate.getFullYear()}</h1>
			<ScrollDrag rootClass="timeline-container mb-[100px]">
				<>
					{monthItems?.map((item, i) => <TimelineItemComponent {...item} key={i}/>)}
					{timeItems?.map((item, i) => <TimelineItemComponent {...item} key={i}/>)}
				</>
			</ScrollDrag>
		</div>
	</>
}


const TimelineItemComponent: React.FC<TimelineItem> = (props: TimelineItem) => {
	const ref = useRef<HTMLDivElement>(null);
	const {date, x, content, below, graphDate, color} = props;
	
	let belowClass = below ? ' below' : '';
	const style: CSSProperties | undefined = x > 0 ? {left: `${x}px`} : undefined;
	if (x > 0) {
		belowClass += ' absolute';
	} else {
		belowClass += ' relative';
	}

	useEffect(() => {
		ref.current?.style.setProperty('--bom-color', color);
	}, [color]);

	return <>
		<div className={"timeline-item" + belowClass} style={style} ref={ref}>
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
	content?: ReactElement,
	date?: string,
	color: HexColor
}