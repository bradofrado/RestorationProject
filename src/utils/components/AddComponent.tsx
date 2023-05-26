import React from 'react'
import Editable, { type ButtonIcon } from './Editable'
import CondensedTimeline from './Timeline/CondensedTimeline'
import { useService } from '../react-service-container'
import { AddIcon, AdjustIcon, DeleteIcon, EditIcon } from './icons/icons'
import Dropdown, { DropdownIcon, DropdownList, type DropdownItem, type ListItem } from './Dropdown'
import Header from './base/baseComponents'
import { TranslationMethodsContainer } from './event-page/book-of-mormon-translation'
import { TimelineService } from '../services/TimelineService'
import { type TimelineCategory } from '../types/timeline'
import { type EditableData } from '../types/page'
import { z } from 'zod'

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
	const timelineService = useService(TimelineService);
	const items = timelineService.getItems(data?.content as TimelineCategory || 'Book of Mormon');

	return <>
		<CondensedTimeline items={items} className={className}/>
	</>
}
const EditableCondensedTimeline: React.ElementType<EditableComponent> = ({onDelete, onEdit, data}) => {
	const dropdownItems: DropdownItem[] = [
		{
			label: 'Book of Mormon',
			handler: () => onEdit({content: 'Book of Mormon', properties: null})
		},
		{
			label: 'Book of Mormon Translation',
			handler: () => onEdit({content: 'Book of Mormon Translation', properties: null})
		}
	]
	
	return <>
	 				<Editable as={DataCondensedTimeline} data={data}
						icons={[{icon: DeleteIcon, handler: onDelete}, 
											<DropdownIcon className="ml-1" 
													key={1} items={dropdownItems} icon={EditIcon}/>]}
						>
						Text
					</Editable>
				</>
}

const DataList: React.ElementType<DataComponent> = ({data}) => {
	const type: TimelineCategory | 'custom' = data != null ? data.content as TimelineCategory : 'custom';
	const timelineService = useService(TimelineService);
	const items = type != 'custom' ? timelineService.getItems(type) : null;
	const liItems = type == 'custom' && data?.properties ? data?.properties?.split('|') : ['Text']
	
	return <>
		{(type == 'custom') && <ul className="list-disc px-10">
			{type == 'custom' && liItems.map((x, i) => <li key={i}>{x}</li>)}
			{items != null && items.map((item, i) => <li key={i}>{item.text}</li>) }
		</ul>}
		{items != null && <TranslationMethodsContainer items={items} annotationCount={0}/>}
	</>
}

const EditableList: React.ElementType<EditableComponent> = ({onDelete, onEdit, data}) => {
	const type: TimelineCategory | 'custom' = data != null ? data.content as TimelineCategory : 'custom';
	const timelineService = useService(TimelineService);
	const items = type != 'custom' ? timelineService.getItems(type) : null;
	const dropdownItems: DropdownItem[] = [
		{
			label: 'Custom',
			handler: () => onEdit({content: 'custom', properties: null})
		},
		{
			label: 'Book of Mormon',
			handler: () => onEdit({content: 'Book of Mormon', properties: null})
		},
		{
			label: 'Book of Mormon Translation',
			handler: () => onEdit({content: 'Book of Mormon Translation', properties: null})
		},
	];

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
		<DropdownIcon className="ml-1" items={dropdownItems} icon={EditIcon} key={1}/>,
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

	const liItems = type == 'custom' && data?.properties ? data?.properties?.split('|') : ['Text']
	
	return <>
		{(!listItems[0]?.value || type == 'custom') && <Editable as="ul" className="list-disc px-10" editable={false}
			icons={editIcons}>
			{type == 'custom' && liItems.map((x, i) => <li key={i} contentEditable="true" onBlur={(e: React.FocusEvent<HTMLLIElement>) => editLiItem(e.target.innerHTML, i)}>{x}</li>)}
			{items != null && items.map((item, i) => <li key={i}>{item.text}</li>) }
		</Editable>}
		{listItems[0]?.value && items != null && <Editable as={TranslationMethodsContainer} icons={editIcons} items={items} annotationCount={0}/>}
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
		const {type, editable, ...rest} = props;
		return <Component.editable {...rest}></Component.editable>
	}
	
	const {type, editable, ...rest} = props;
	return <Component.component {...rest}></Component.component>
}

export default function AddComponent({onAdd}: {onAdd: (component: ComponentType) => void}) {
  const items: DropdownItem[] = components.map(comp => ({label: comp.label, handler: () => onAdd(comp.label)}))
	return (
		<Dropdown items={items}>
			+
		</Dropdown>
  )
}