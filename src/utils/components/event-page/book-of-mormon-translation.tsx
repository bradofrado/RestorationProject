import { DateFormat, groupBy } from "~/utils/utils";
import { countLinks } from "../../services/EventPageService";
import { Annotation } from "../Timeline/CondensedTimeline";
import { type RestorationTimelineItem, type TimelineSubcategory } from "~/utils/types/timeline";
import { useEffect, useState } from "react";
import { ContentEditableBlur } from "../edit/add-component";
import React from 'react';

type DataGroupbyListProps<T extends ListItem> = {
	className?: string,
	groupByKey: keyof T
} & DisplayListComponentPassthrough<T>
export const DataGroupbyList = <T extends ListItem>({className, groupByKey, items, ...rest}: DataGroupbyListProps<T>) => {
	return <div className={className || ''}>
		{Object.entries(groupBy(items, groupByKey))
			.map(([title, items], i) => <DisplayGroup items={items} title={title} key={i} {...rest}/>)}
	</div>
}

type DisplayGroup<T extends ListItem> = {
	title: string
} & DisplayListComponentPassthrough<T>

const DisplayGroup = <T extends ListItem>(props: DisplayGroup<T>) => {
	const {title, ...rest} = props;
	return <>
		<ul>
			<li>
				<h3 className="text-xl">{title}</h3>
				<DisplayList {...rest} />
			</li>
		</ul>
	</>
}

type DisplayListProps<T extends ListItem> = DisplayListComponentPassthrough<T>
export const DisplayList = <T extends ListItem>({items, ListComponent, contentEditable}: DisplayListProps<T>) => {
	const setNextIndex = () => {

	}
	return <>
		<ul className="list-disc px-10 py-2">
			{items.map((item, i) => {
				return <ListComponent key={i} index={0} setNextIndex={setNextIndex} item={item} contentEditable={contentEditable}/>
			})}
		</ul>
	</>
}

type IndexType = {
	index: number,
	setNextIndex: (index: number) => void
}

type ListItem = {
	text: string
}

export type DisplayListComponentPassthrough<T extends ListItem> = {
	ListComponent: DisplayListItemComponent<T>,
	items: T[]
} & ContentEditableBlur

type DisplayListItemComponent<T extends ListItem> = (props: IndexType & {item: T} & ContentEditableBlur) => JSX.Element

export const DisplayListItem: DisplayListItemComponent<{text: string}> = function({item, index, setNextIndex, contentEditable, onBlur}) {
	useEffect(() => setNextIndex(index + 1), []);
	return <li onBlur={(e: React.FocusEvent<HTMLLIElement>) => onBlur && onBlur(e.target.innerHTML, i)} contentEditable={contentEditable}>{item.text}</li>
}

export const RestorationQuote: DisplayListItemComponent<RestorationTimelineItem> = ({item, index, setNextIndex}) => {
	useEffect(() => setNextIndex(index + item.links.length), [])
	const [quote, name] = item.text.split('-');
	return (
		<li>
			<span className="italic" >{quote}</span>
			{name && <>
				<span className="font-medium">-{name}</span>
				<span className=""> {DateFormat.fullText(item.date)}</span>
			</>}
			<span>{item.links.map((link, i) => <Annotation link={link} key={i} id={index}/>)}</span>
		</li>
	)
}