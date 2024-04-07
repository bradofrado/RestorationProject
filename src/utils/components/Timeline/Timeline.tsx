import dayjs from 'dayjs';
import ScrollDrag from '../base/scroll-drag';
import { type ReactElement, type CSSProperties,  useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { PrimaryColor, type HexColor } from '~/utils/types/colors';
import React from 'react';
import {type TimelineCategory, type TimelineItemStandalone} from '~/utils/types/timeline';
import { useGetPageUrl } from 'src/utils/services/EventPageService';
import Button from '../base/buttons/button';
import Label from '../base/label';
import Header from '../base/header';
import { Annotation } from './CondensedTimeline';

export interface TimelineProps {
	categories: TimelineCategory[]
}
export const Timeline: React.FC<TimelineProps> = ({categories}: TimelineProps) => {
	const query = useGetPageUrl();
	const [filteredCategories, setFilteredCategories] = useState<TimelineCategory['id'][]>([]);
	const [scrollIndex, setScrollIndex] = useState<number>(-1);

	const items = categories.reduce<TimelineItemStandalone[]>((prev, curr) => {
		const items: TimelineItemStandalone[] = curr.items.filter(item => !!item.date).map(item => ({...item, color: curr.color, pageId: curr.pageId, date: item.date || new Date()}));
		prev = prev.concat(items);

		return prev;
	}, [])
	if (query.isLoading || query.isError || items.length == 0) {
		return <>Loading</>
	}

	const getUrl = query.data;

	const unfilteredSorted = items.slice().sort((a, b) => {
		if (a.date < b.date) {
			return -1;
		} else if (a.date > b.date) {
			return 1;
		}

		return 0;
	});
	const sorted = unfilteredSorted.filter(x => x.categoryId && filteredCategories.indexOf(x.categoryId) < 0);
	

	const lastDate = unfilteredSorted[unfilteredSorted.length - 1]?.date as Date;
	const firstDate = unfilteredSorted[0]?.date as Date;

	const yearDiff = lastDate.getFullYear() - firstDate.getFullYear() + 1;
	const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	const monthItems = (() => {
		let timeItems: TimelineItem[] = [];
		const firstYear = firstDate.getFullYear();
		
		for (let i = 0; i < yearDiff; i++) {
			timeItems = timeItems.concat(months.map(m => {
				const item: TimelineItem = {
					graphDate: dayjs(new Date(firstYear + i, m, 1)).format("MMM"), 
					x: 0,
					below: false,
					date: m === 0 ? (firstYear + i).toString() : undefined,
					color: PrimaryColor,
					year: firstYear + i
				};

				return item;
			}));
		}

		return timeItems.slice().sort((a, b) => a.x - b.x);
	})();

	const timeItems = (() => {
		const style = getComputedStyle(document.body);
		const containerSize = style.getPropertyValue('--container-size');
		const offset = Number(containerSize.substring(0, containerSize.length - 2)) / 4;
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

			const hoverState = item.text.length > offset ? 'hover:w-[300px] sm:hover:w-[500px] group/overflow' : '';

			timeItems.push({
				date: dayjs(item.date).format("MMM D"),
				x: getYearOffset(item.date.getFullYear() - firstYear) + getMonthOffset(item.date.getMonth()) + getDayOffset(item.date.getDate()),
				below: currDateCount % 2 === 0,
				content: <div data-testid="timeline-item" className={`restoration-item overflow-hidden group focus:z-20 hover:z-20 ${hoverState} h-[200px] absolute transition-width ease-in-out`}>
							<div className="h-full flex justify-center flex-col">
								<p className="text-sm md:text-base mt-3 group-hover:pb-1 overflow-hidden group-hover/overflow:overflow-auto">{item.text} {item.links.map((link, i) => <Annotation key={i} link={link} id={i + 1}/>)}</p>
							</div>
							{item.pageId && <div className="justify-around flex h-5">
								<Link className="text-gray-800 hover:text-gray-700 text-sm font-medium group-hover:inline-block hidden" href={`/${getUrl(item.pageId)}`}>More</Link>
							</div>}

						</div>,
				color: item.color,
				year: item.date.getFullYear()
			});
		}

		return timeItems;
	})();

	const onCategoryClick = (i: TimelineCategory['id']) => {
		const copy = filteredCategories.slice();
		const index = copy.indexOf(i);
		if (index >= 0) {
			copy.splice(index, 1);
		} else {
			copy.push(i);
		}
		setScrollIndex(-1);
		setFilteredCategories(copy);
	}

	const onNextClick = () => {
		const newIndex = (scrollIndex + 1) % timeItems.length;
		setScrollIndex(newIndex);
	}

	const onPreviousClick = () => {
		let newIndex = scrollIndex - 1;
		newIndex = newIndex < 0 ? timeItems.length - 1 : newIndex;
		setScrollIndex(newIndex);
	}

	const categoriesWithDateItems = categories.filter(x => x.items.filter(item => item.date).length > 0);
	return <>
		<div className="w-full">
			<h1 className="text-4xl font-bold tracking-tight text-center pb-5 text-gray-800 mt-[20px] sm:mb-[100px] sm:mt-0">Timeline {firstDate.getFullYear()} - {lastDate.getFullYear()}</h1>
			<ScrollDrag rootClass="timeline-container mt-[20px] sm:mb-[100px] sm:mt-0" scrollPos={timeItems[scrollIndex]?.x}>
				<>
					{monthItems?.map((item, i) => <TimelineItemComponent {...item} key={i}/>)}
					{timeItems?.map((item, i) => <TimelineItemComponent {...item} key={i}/>)}
				</>
			</ScrollDrag>
			<div className="flex items-center flex-col-reverse sm:flex-row">
				<Label label="Categories" className="grow">
					<TimelineCategoryFilter categories={categoriesWithDateItems} filtered={filteredCategories} onChange={onCategoryClick} filterKey="id"/>
				</Label>
				<div className="grow">
					<Header className={scrollIndex < 0 || !timeItems[scrollIndex] ? 'invisible' : ''}>{scrollIndex >= 0 && timeItems[scrollIndex] ? `${timeItems[scrollIndex]?.date || ''}, ${timeItems[scrollIndex]?.year || ''}` : 'Filler'}</Header>
					<div>
						<Button onClick={onPreviousClick}>Previous</Button>
						<Button onClick={onNextClick}>Next</Button>
					</div>
				</div>
			</div>
		</div>
	</>
}

type TimelineCategoryFilterProps<T extends keyof TimelineCategory> = {
	categories: TimelineCategory[],
	filtered: TimelineCategory[T][],
	onChange: (key: TimelineCategory[T]) => void,
	filterKey: T
}
export const TimelineCategoryFilter = <T extends keyof TimelineCategory>({categories, filtered, onChange, filterKey}: TimelineCategoryFilterProps<T>) => {
	
	return <>
		{categories.map((category, i) => <Button key={i} mode={filtered.indexOf(category[filterKey]) > -1 ? 'secondary' : 'other'} backgroundColor={category.color} onClick={() => onChange(category[filterKey])}>{category.name}</Button>)}
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
		<div className={"timeline-item" + belowClass} style={style} ref={ref} aria-label={`${x}`}>
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
	color: HexColor,
	year: number
}