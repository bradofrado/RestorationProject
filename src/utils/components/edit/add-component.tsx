import React from 'react'
import Editable, { type ButtonIcon } from './editable'
import CondensedTimeline from '../Timeline/CondensedTimeline'
import { AddIcon, AdjustIcon, DeleteIcon, EditIcon } from '../icons/icons'
import Dropdown, { DropdownIcon, DropdownList, type DropdownItem, type ListItem } from '../base/dropdown'
import Header from '../base/header'
import { DataGroupbyList, DisplayList, DisplayListComponentPassthrough, DisplayListItem, RestorationQuote } from '../event-page/book-of-mormon-translation'
import { type RestorationTimelineItem, type TimelineCategoryName } from '../../types/timeline'
import { type EditableData } from '../../types/page'
import { z } from 'zod'
import { useGetCategories, useGetCategory } from '../../services/TimelineService'

export interface EditableComponent extends DataComponent {
	onDelete: () => void,
	onEdit: (data: EditableData) => void,
}
interface DataComponent {
	data: EditableData | null,
	className?: string
}
interface Component {
	label: string,
	editable: React.ElementType<EditableComponent>,
	component: React.ElementType<DataComponent>
}

const DataCondensedTimeline: React.ElementType<DataComponent> = ({data, className}) => {
	const query = useGetCategory(data?.content || 'Book of Mormon');
	if (query.isLoading || query.isError) {
		return <></>
	}
	
	const items = query.data.items;

	return <>
		<CondensedTimeline items={items} className={className}/>
	</>
}
const EditableCondensedTimeline: React.ElementType<EditableComponent> = ({onDelete, onEdit, data}) => {
	const query = useGetCategories();
	if (query.isLoading || query.isError) {
		return <></>
	}
	const dropdownItems: DropdownItem<string>[] = query.data.map(x => ({id: x.name, name: x.name}))
	
	return <>
			<Editable as={DataCondensedTimeline} data={data}
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

const DataList: React.ElementType<DataListProps> = ({data, onBlur, contentEditable}) => {
	const query = useGetCategories();
	if (query.isLoading || query.isError) {
		return <></>
	}
	const getListComponentProps = (orig: DataComponent['data']): ({isTimelineItem: false} & DisplayListComponentPassthrough<{text: string}>)
		 | ({isTimelineItem: true} & DisplayListComponentPassthrough<RestorationTimelineItem>) => {
		const data = orig ?? {content: 'custom', properties: null};
		if (data.content == 'custom') {
			const items = data.properties ? data.properties.split('|') : ['Text'];
			return {
				items: items.map(x => ({text: x})),
				ListComponent: DisplayListItem,
				contentEditable,
				onBlur,
				isTimelineItem: false
			}
		}

		const items: RestorationTimelineItem[] = query.data.find(x => x.name == data.content)?.items || [];

		return {
			items,
			ListComponent: RestorationQuote,
			isTimelineItem: true,
			contentEditable,
			onBlur
		}
	}
	const componentProps = getListComponentProps(data);
	// const type: TimelineCategoryName | 'custom' = data != null ? data.content : 'custom';
	// const items: {text: string}[] = type != 'custom' ? query.data.find(x => x.name == type)?.items as RestorationTimelineItem[] : (data?.properties?.split('|') || ['Text']).map(x => ({text: x}));

	// const listDisplayer = type != 'custom' ? RestorationQuote : DisplayListItem;
	if (data?.properties?.includes('Group') && componentProps.isTimelineItem) {
		return <DataGroupbyList {...componentProps} groupByKey='subcategory'/>
	}

	return <DisplayList {...componentProps}/>
	// return <>
	// 	{(!data?.properties || type == 'custom') && <ul className="list-disc px-10">
	// 		{type == 'custom' && liItems.map((x, i) => <li key={i} onBlur={(e: React.FocusEvent<HTMLLIElement>) => onBlur && onBlur(e.target.innerHTML, i)} contentEditable={contentEditable}>{x}</li>)}
	// 		{items != undefined && items.map((item, i) => <li key={i}>{item.text}</li>) }
	// 	</ul>}
	// 	{data?.properties && <TranslationMethodsContainer items={items || []} annotationCount={0}/>}
	// </>
}

const EditableList: React.ElementType<EditableComponent> = ({onDelete, onEdit, data}) => {
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
		<Editable as={DataList} icons={editIcons} data={data} onBlur={editLiItem}/>
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

export const CustomComponent = (props: EditableComponentType | DataComponentType) => {
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