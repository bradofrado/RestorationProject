import React, { use, useContext, useState } from 'react'
import Editable, { type ButtonIcon } from './editable'
import CondensedTimeline from '../Timeline/CondensedTimeline'
import { AddIcon, AdjustIcon, DeleteIcon, EditIcon } from '../icons/icons'
import Dropdown, { DropdownIcon, DropdownList, type DropdownItem, type ListItem } from '../base/dropdown'
import Header from '../base/header'
import { DataGroupbyList, DisplayList, DisplayListItem, RestorationQuote } from '../event-page/book-of-mormon-translation'
import { type RestorationTimelineItem, type TimelineCategoryName } from '../../types/timeline'
import { type EditableData } from '../../types/page'
import { z } from 'zod'
import { useGetCategories, useGetCategory } from '../../services/TimelineService'

export interface EditableComponent extends DataComponent {
	onDelete: () => void,
	onEdit: (data: EditableData) => void,
}
interface DataComponent extends IndexType {
	data: EditableData | null,
	className?: string
}
interface Component {
	label: string,
	editable: React.ElementType<EditableComponent>,
	component: React.ElementType<DataComponent>
}

const DataCondensedTimeline: React.ElementType<DataComponent> = ({data, className, ...rest}) => {
	const query = useGetCategory(data?.content || 'Book of Mormon');
	if (query.isLoading || query.isError) {
		return <></>
	}
	
	const items = query.data.items;

	return <>
		<CondensedTimeline items={items} className={className} {...rest}/>
	</>
}
const EditableCondensedTimeline: React.ElementType<EditableComponent> = ({onDelete, onEdit, data, ...rest}) => {
	const query = useGetCategories();
	if (query.isLoading || query.isError) {
		return <></>
	}
	const dropdownItems: DropdownItem<string>[] = query.data.map(x => ({id: x.name, name: x.name}))
	
	return <>
			<Editable as={DataCondensedTimeline} data={data} {...rest}
				icons={[{icon: DeleteIcon, handler: onDelete}, 
									<DropdownIcon className="ml-1" onChange={item => onEdit({content: item.id, properties: null})}
											key={1} items={dropdownItems} icon={EditIcon}/>]}
				>
				Text
			</Editable>
		</>
}

export type ContentEditable = {
	contentEditable?: boolean | "true" | "false"
}
export type ContentEditableBlur = ContentEditable & {
	onBlur?: (value: string, index: number) => void
}
interface DataListProps extends DataComponent, ContentEditableBlur {

}

const DataList: React.ElementType<DataListProps> = ({data: orig, ...rest}) => {
	const query = useGetCategories();
	if (query.isLoading || query.isError) {
		return <></>
	}
	const data = orig ?? {content: 'custom', properties: null};
	if (data.content == 'custom') {
		const items = data.properties ? data.properties.split('|') : ['Text'];
		return <DisplayList items={items.map(x => ({text: x}))} ListComponent={DisplayListItem} {...rest}/>
	}

	const items: RestorationTimelineItem[] = query.data.find(x => x.name == data.content)?.items || [];

	if (data?.properties?.includes('Group')) {
		return <DataGroupbyList items={items} ListComponent={RestorationQuote} groupByKey='subcategory' {...rest}/>
	}

	return <DisplayList items={items} ListComponent={RestorationQuote} {...rest}/>
}

const EditableList: React.ElementType<EditableComponent> = ({onDelete, onEdit, data, ...rest}) => {
	const query = useGetCategories();
	if (query.isLoading || query.isError) {
		return <></>
	}
	const type: TimelineCategoryName | 'custom' = data != null ? data.content : 'custom';
	const dropdownItems: DropdownItem<string>[] = [
		{
			name: 'Custom',
			id: 'custom',
		},
	].concat(query.data.map(x => ({id: x.name, name: x.name})));

	const listItems: ListItem[] = [
		{
			label: 'Group',
			value: !!data?.properties?.includes('Group')
		}
	]

	const setListItems: (items: ListItem[]) => void = (items) => {
		onEdit({content: data?.content || 'custom', properties: items.reduce((prev, curr) => prev + (curr.value ? `|${curr.label as string}` : ''), '') });
	}

	const editIcons: ButtonIcon[] = [
		{icon: DeleteIcon, handler: onDelete},
		<DropdownIcon className="ml-1" items={dropdownItems} icon={EditIcon} key={1} onChange={(item) => onEdit({content: item.id, properties: data?.properties || null})}/>,
	];

	if (type != 'custom') {
		editIcons.push(<DropdownList className="ml-1" items={listItems} setItems={setListItems} icon={AdjustIcon} key={2} />)
	} else {
		editIcons.push({icon: AddIcon, handler: () => onEdit({content: 'custom', properties: data?.properties ? data?.properties + '|Text' : 'Text'})})
	}

	const editLiItem = (value: string, index: number) => {
		const vals = data?.properties ? data?.properties?.split('|') : ['Text'];
		vals[index] = value;
		onEdit({content: data?.content || 'custom', properties: vals.join('|')})
	}
	
	return <>
		<Editable as={DataList} icons={editIcons} data={data} onBlur={editLiItem} {...rest}/>
	</>
}

function createComponents<T extends readonly Component[] & Array<{label: V}>, V extends string>(...args: T) {
	return args
}

const components = createComponents(
	{
		label: 'Header',
		editable: (({onDelete, onEdit, data}) => <Editable as={Header} icons={[{icon: DeleteIcon, handler: onDelete}]} 
			onBlur={(e: React.FocusEvent<HTMLHeadingElement>) => onEdit({content: e.target.innerHTML, properties: null})}>
											{data?.content || 'Text'}
										</Editable>) as React.ElementType<EditableComponent>,
		component: (({data}) => <Header className="py-2">{data?.content || 'Text'}</Header>) as React.ElementType<DataComponent>
	},
	{
		label: 'Paragraph',
		editable: (({onDelete, onEdit, data}) => <Editable as="p" icons={[{icon: DeleteIcon, handler: onDelete}]} 
				onBlur={(e: React.FocusEvent<HTMLParagraphElement>) => onEdit({content: e.target.innerHTML, properties: null})}>
											{data?.content || 'Text'}
										</Editable>) as React.ElementType<EditableComponent>,
		component: (({data}) => <p className="py-2">{data?.content || 'Text'}</p>) as React.ElementType<DataComponent>
	},
	{
		label: 'Timeline',
		editable: EditableCondensedTimeline,
		component: DataCondensedTimeline
	},
	{
		label: 'List',
		editable: EditableList,
		component: DataList
	}
);

const componentsTypes = components.map(x => x.label);

export type ComponentType = typeof components[number]['label'];
export const ComponentTypeSchema = z.custom<ComponentType>((val) => {
	return (componentsTypes as ReadonlyArray<string>).includes(val as string);
})

type EditableComponentType = {type: ComponentType, editable: true} & EditableComponent;
type DataComponentType = {type: ComponentType, editable?: false} & DataComponent;

const AnnotationLinkContext = React.createContext<{index: number, update: (index: number) => void}>({index: 0, update: () => {return undefined}});

const AnnotationLinkProvider = ({children}: React.PropsWithChildren) => {
	const [index, setIndex] = useState(0);

	return <AnnotationLinkContext.Provider value={{index, update: setIndex}}>
		{children}
	</AnnotationLinkContext.Provider>
}

export const useAnnotationLink = (): [number, (index: number) => void] => {
	const {index, update} = useContext(AnnotationLinkContext);

	return [index, update];
}

export const CustomComponents = ({items}: {items: CustomComponentType[]}) => {
	let index = 0;
	const setIndex = (newIndex: number) => {
		index += newIndex;
	}
	return <>
		{items.map((item, i) => <CustomComponent key={i} {...item} index={index} setIndex={setIndex}/>)}
	</>
}

export type IndexType = {
	index: number,
	setIndex: (index: number) => void
}
type CustomComponentType = (EditableComponentType | DataComponentType) & IndexType;
export const CustomComponent = (props: CustomComponentType) => {
	const Component = components.find(x => x.label == props.type) || components[0];
	if (props.editable) {
		const {type: _, editable: _a, ...rest} = props;
		return <Component.editable {...rest}></Component.editable>
	}
	
	const {type: _, editable: _a, ...rest} = props;
	return <Component.component {...rest}></Component.component>
}

export default function AddComponent({onAdd}: {onAdd: (component: ComponentType) => void}) {
  const items: DropdownItem<ComponentType>[] = components.map(comp => ({name: comp.label, id: comp.label}))
	return (
		<Dropdown items={items} chevron={false} onChange={item => onAdd(item.id)}>
			+
		</Dropdown>
  )
}