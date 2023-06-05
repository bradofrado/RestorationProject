import { DateFormat, groupBy } from "~/utils/utils";
import { Annotation } from "../Timeline/CondensedTimeline";
import { type RestorationTimelineItem } from "~/utils/types/timeline";
import { useEffect, useState } from "react";
import { ContentEditableBlur, IndexType } from "../edit/add-component";
import React from 'react';
import {useAnnotationLink} from '~/utils/components/edit/add-component';

type DataGroupbyListProps<T extends ListItem> = {
	className?: string,
	groupByKey: keyof T
} & DisplayListComponentPassthrough<T>
export const DataGroupbyList = <T extends ListItem>({className, groupByKey, items, ...rest}: DataGroupbyListProps<T>) => {
	return <div className={className || ''}>
		{Object.entries<T[]>(groupBy(items, groupByKey))
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
export const DisplayList = <T extends ListItem>({items, ListComponent, contentEditable, ...rest}: DisplayListProps<T>) => {
	return <>
		<ul className="list-disc px-10 py-2">
			{items.map((item, i) => {
				return <ListComponent key={i} item={item} contentEditable={contentEditable} {...rest}/>
			})}
		</ul>
	</>
}

type ListItem = {
	text: string
}

export type DisplayListComponentPassthrough<T extends ListItem> = {
	ListComponent: DisplayListItemComponent<T>,
	items: T[]
} & ContentEditableBlur & IndexType

type DisplayListItemComponent<T extends ListItem> = (props: {item: T} & ContentEditableBlur & IndexType) => JSX.Element

export const DisplayListItem: DisplayListItemComponent<{text: string}> = function({item, contentEditable, onBlur, index, setIndex}) {
	setIndex(index + 1);
	return <li onBlur={(e: React.FocusEvent<HTMLLIElement>) => onBlur && onBlur(e.target.innerHTML, index)} contentEditable={contentEditable}>{item.text}</li>
}

export const RestorationQuote: DisplayListItemComponent<RestorationTimelineItem> = ({item, index, setIndex}) => {
	setIndex(index + item.links.length);

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