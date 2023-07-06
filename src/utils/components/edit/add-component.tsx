import React, { useContext } from 'react'
import Editable, { type ButtonIcon, type EditableComponentProps } from './editable'
import CondensedTimeline from '../Timeline/CondensedTimeline'
import { AddIcon, AdjustIcon, DeleteIcon, EditIcon } from '../icons/icons'
import Dropdown, { DropdownIcon, DropdownList, type DropdownItem, type ListItem } from '../base/dropdown'
import Header from '../base/header'
import { DataGroupbyList, DisplayList, DisplayListItem, RestorationQuote } from '../event-page/book-of-mormon-translation'
import { type RestorationTimelineItem, type TimelineCategoryName } from '../../types/timeline'
import { type EditableData } from '../../types/page'
import { z } from 'zod'
import { useGetCategories, useGetCategory } from '../../services/TimelineService'
import { DirtyComponent } from './dirty-component'

const Placeholder = ({children}: React.PropsWithChildren) => {
	return <div className="text-gray-400">{children}</div>
}

type EditableDataComponent = EditableComponentProps<EditableData> & DataComponent;
interface DataComponent {
	data: EditableData,
	className?: string
}
interface Component {
	label: string,
	editable: React.ComponentType<EditableDataComponent>,
	component: React.ComponentType<DataComponent>
}

const DataCondensedTimeline: React.ElementType<DataComponent> = ({data, className, ...rest}) => {
	const query = useGetCategory(data?.content || 'Book of Mormon');
	if (query.isLoading || query.isError) {
		return <Placeholder>Pick Timeline items</Placeholder>
	}

	const items = query.data.items;

	return <>
		<CondensedTimeline items={items} className={className} {...rest}/>
	</>
}
const EditableCondensedTimeline: React.ElementType<EditableDataComponent> = ({onDelete, onEdit, data, ...rest}) => {
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

	if (data.content == 'custom' && !data.properties) {
		return <Placeholder>List is empty</Placeholder>
	}
	if (data.content == 'custom') {
		const items = data.properties ? data.properties.split('|') : [];
		return <DisplayList items={items.map(x => ({text: x}))} ListComponent={DisplayListItem} {...rest}/>
	}

	const items: RestorationTimelineItem[] = query.data.find(x => x.name == data.content)?.items || [];

	if (data?.properties?.includes('Group')) {
		return <DataGroupbyList items={items} ListComponent={RestorationQuote} groupByKey='subcategory' {...rest}/>
	}

	return <DisplayList items={items} ListComponent={RestorationQuote} {...rest}/>
}

const EditableList: React.ElementType<EditableDataComponent> = ({onDelete, onEdit, data, ...rest}) => {
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

	const listItems: ListItem<string>[] = [
		{
			label: 'Group',
			value: !!data?.properties?.includes('Group'),
			id: 'group',
		}
	]

	const setListItems: (items: ListItem<string>[]) => void = (items) => {
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
			onBlur={(e: React.FocusEvent<HTMLHeadingElement>) => e.target.innerHTML !== data?.content && onEdit({content: e.target.innerHTML, properties: null})}>
											{data?.content || 'Text'}
										</Editable>) as React.ComponentType<EditableDataComponent>,
		component: (({data}) => <Header className="py-2">{data?.content || 'Text'}</Header>) as React.ComponentType<DataComponent>
	},
	{
		label: 'Paragraph',
		editable: (({onDelete, onEdit, data}) => <Editable as="p" role="paragraph" icons={[{icon: DeleteIcon, handler: onDelete}]} 
				onBlur={(e: React.FocusEvent<HTMLParagraphElement>) => e.target.innerHTML !== data?.content && onEdit({content: e.target.innerHTML, properties: null})}>
											{data?.content || 'Text'}
										</Editable>) as React.ComponentType<EditableDataComponent>,
		component: (({data}) => <p className="py-2">{data?.content || 'Text'}</p>) as React.ComponentType<DataComponent>
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

type EditableComponentType = {type: ComponentType, editable: true} & EditableDataComponent;
type DataComponentType = {type: ComponentType, editable?: false} & DataComponent;

const AnnotationLinkContext = React.createContext<Record<string, number>>({});

const AnnotationLinkProvider = ({children}: React.PropsWithChildren) => {
	const annotationLinks = {};

	return <AnnotationLinkContext.Provider value={annotationLinks}>
		{children}
	</AnnotationLinkContext.Provider>
}

export const useAnnotationLink = () => {
	const annotationLinks = useContext(AnnotationLinkContext);
	const max = (vals: number[]) => {
		const sorted = vals.slice().sort((a, b) => b - a);
		return sorted[0] || 0;
	}
	const annotate = (link: string): number => {
		const curr = annotationLinks[link];
		if (curr) {
			return curr;
		}

		const nextVal: number = max(Object.values(annotationLinks)) + 1;
		annotationLinks[link] = nextVal;

		return nextVal
	}

	return {annotate};
}

export const CustomComponents = ({items, isNew=false}: {items: CustomComponentType[], isNew?: boolean}) => {
	return <AnnotationLinkProvider>
		{items.map((item, i) => <CustomComponent key={i} {...item} isNew={isNew}/>)}
	</AnnotationLinkProvider>
}

type CustomComponentType = (EditableComponentType | DataComponentType) & {id: number};
export const CustomComponent = (props: CustomComponentType & {isNew: boolean}) => {
	const Component = components.find(x => x.label == props.type) || components[0];
	if (props.editable) {
		const {type: _, editable: _a, id, ...rest} = props;
		const isNew = id < 0;
		return <div data-testid={`custom-component-editable-${id}`} role="custom-component-editable">
			{props.isNew ? <Component.editable {...rest}/> : 
			<DirtyComponent as={Component.editable} {...rest} dirty={isNew} overrideDelete={isNew} showCancel={!isNew}></DirtyComponent>}
		</div>
	}
	
	const {type: _, editable: _a, id, ...rest} = props;
	return <div data-testid={`custom-component-${id}`} role="custom-component">
		<Component.component {...rest}></Component.component>
	</div>
}

export default function AddComponent({onAdd}: {onAdd: (component: ComponentType) => void}) {
  const items: DropdownItem<ComponentType>[] = components.map(comp => ({name: comp.label, id: comp.label}))
	return (
		<Dropdown items={items} chevron={false} onChange={item => onAdd(item.id)}>
			+
		</Dropdown>
  )
}