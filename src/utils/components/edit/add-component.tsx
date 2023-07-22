import React, { useContext, useState } from 'react'
import Editable, { type EditableProps, type ButtonIcon, type EditableComponentProps, type DeletableComponentProps, EditableDeleteableComponent, EditableDeleteableComponentProps, EditableComponent } from './editable'
import CondensedTimeline from '../Timeline/CondensedTimeline'
import { AddIcon, AdjustIcon, DeleteIcon, DragMoveIcon, EditIcon } from '../icons/icons'
import Dropdown, { DropdownIcon, DropdownList, type DropdownItem, type ListItem } from '../base/dropdown'
import Header, { HeaderLevels, HeaderProps, HeaderSettings, SettingsComponentSettings, SettingsComponentSettingsSchema } from '../base/header'
import { DataGroupbyList, DisplayList, DisplayListItem, RestorationQuote } from '../event-page/book-of-mormon-translation'
import { type RestorationTimelineItem, type TimelineCategoryName } from '../../types/timeline'
import { type EditableData } from '../../types/page'
import { z } from 'zod'
import { useGetCategories, useGetCategory } from '../../services/TimelineService'
import { DirtyComponent } from './dirty-component'
import { useChangeProperty, type IfElse, jsonParse } from '~/utils/utils'
import {DirtyDraggableListComponent, DraggableListComponent} from '~/utils/components/base/draggable-list';
import {PopoverIcon} from '~/utils/components/base/popover';
import Input, { NumberInput } from '../base/input'
import Label from '../base/label';
import ColorPicker from '../base/color-picker'
import { HexColor, HexColorSchema } from '~/utils/types/colors'
import { PropsOf } from '~/utils/types/polymorphic'
import Paragraph, { ParagraphProps } from '../base/paragraph'
import {HeaderSettingsSchema} from '~/utils/components/base/header';

const Placeholder = ({children}: React.PropsWithChildren) => {
	return <div className="text-gray-400">{children}</div>
}

type EditableDataComponent = EditableDeleteableComponentProps<EditableData> & DataComponent;
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
			<EditableComponentContainer as={DataCondensedTimeline} data={data} onDelete={onDelete} {...rest}
				icons={[<DropdownIcon onChange={item => onEdit({content: item.id, properties: null})}
				key={1} items={dropdownItems} icon={EditIcon}/>]}
				>
				Text
			</EditableComponentContainer>
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
		//{icon: DeleteIcon, handler: onDelete},
		<DropdownIcon items={dropdownItems} icon={EditIcon} key={1} onChange={(item) => onEdit({content: item.id, properties: data?.properties || null})}/>,
	];

	if (type != 'custom') {
		editIcons.push(<DropdownList items={listItems} setItems={setListItems} icon={AdjustIcon} key={2} />)
	} else {
		editIcons.push({icon: AddIcon, handler: () => onEdit({content: 'custom', properties: data?.properties ? data?.properties + '|Text' : 'Text'})})
	}

	const editLiItem = (value: string, index: number) => {
		const vals = data?.properties ? data?.properties?.split('|') : ['Text'];
		vals[index] = value;
		onEdit({content: data?.content || 'custom', properties: vals.join('|')})
	}
	
	return <>
		<EditableComponentContainer as={DataList} icons={editIcons} data={data} onBlur={editLiItem} onDelete={onDelete} {...rest}/>
	</>
}

type EditableComponentContainerProps<C extends React.ElementType> = DeletableComponentProps & EditableProps<C>
const EditableComponentContainer = <C extends React.ElementType>(props: EditableComponentContainerProps<C>) => {
	const defaultIcons: ButtonIcon[] = [
		{icon: DeleteIcon, handler: props.onDelete},
		{icon: DragMoveIcon}
	];
	const allIcons = defaultIcons.concat(props.icons || []); 
	return <>
		<Editable {...props} icons={allIcons}/>
	</>
}

type HeaderSettingsComponentProps = {
	settings?: HeaderSettings,
	onEdit: (settings: HeaderSettings) => void
}
const HeaderSettingsComponent = ({settings={margin: 0, color: '#000', level: 2}, onEdit}: HeaderSettingsComponentProps) => {
	return <>
		<SettingsComponentCallout data={settings} onEdit={onEdit}>
			{({level}, changeSetting) => <>
				<NumberInput inputClass="w-[4rem] ml-1" value={level} onChange={value => changeSetting('level', value as HeaderLevels)} min={1} max={6}
					include={Label} label="Level" sameLine/>
			</>}
		</SettingsComponentCallout>
	</>
}

type SettingsComponentProps<T extends SettingsComponentSettings> = {
	settings: T
}

type SettingsComponentCalloutProps<T extends SettingsComponentSettings> = EditableComponentProps<T> & {
	children?: (rest: Omit<T, 'margin' | 'color'>, changeSetting: (key: keyof T, value: T[keyof T]) => T) => React.ReactNode
};
const SettingsComponentCallout = <T extends SettingsComponentSettings>({data, onEdit, children}: SettingsComponentCalloutProps<T>) => {
	const changeSetting = useChangeProperty<T>(onEdit);
	const {margin, color, ...rest} = data;
	return <>
		<div className="flex flex-col p-1 w-[8rem] gap-1">
			<Label label="Margin" sameLine>
				<NumberInput inputClass="w-[4rem]" value={margin} onChange={value => changeSetting(data, 'margin', value)} min={0}/>
			</Label>
			<Label label="Color" sameLine>
				<ColorPicker className="m-auto" value={color} onChange={value => changeSetting(data, 'color', value)}/>
			</Label>
			{children && children(rest, (key, value) => changeSetting(data, key, value))}
		</div>
	</>
}

const EditableHeader: React.ComponentType<EditableDataComponent> = ({onDelete, onEdit, data}) => {
	const settings = data.properties ? jsonParse(HeaderSettingsSchema).parse(data.properties) : undefined;
	const onBlur = (e: React.FocusEvent<HTMLHeadingElement>) => e.target.innerHTML !== data?.content && onEdit({content: e.target.innerHTML, properties: null})
	const icons: ButtonIcon[] = [
		<PopoverIcon icon={AdjustIcon} key={0}>
			<HeaderSettingsComponent settings={settings} onEdit={settings => onEdit({content: data.content, properties: JSON.stringify(settings)})}/>
		</PopoverIcon>
	]
	return <>
		<EditableComponentContainer as={DataHeader} onDelete={onDelete} onBlur={onBlur} icons={icons} data={data}/>
	</>
}

const DataHeader: React.ComponentType<DataComponent & Omit<HeaderProps, 'settings'>> = ({data, ...rest}) => {
	const settings = data.properties ? jsonParse(HeaderSettingsSchema).parse(data.properties) : undefined;
	return <>
		<Header className="py-2" {...rest} settings={settings}>{data?.content || 'Text'}</Header>
	</>
}


const ParagraphSettingsCallout: EditableComponent<SettingsComponentSettings> = ({data, onEdit}) => {
	return <>
		<SettingsComponentCallout data={data} onEdit={onEdit}/>
	</>
}
const EditableParagraph: React.ComponentType<EditableDataComponent> = ({onDelete, onEdit, data}) => {
	const settings = data.properties ? jsonParse(SettingsComponentSettingsSchema).parse(data.properties) : {margin: 0, color: '#000'} as const;
	const onBlur = (e: React.FocusEvent<HTMLParagraphElement>) => e.target.innerHTML !== data?.content && onEdit({content: e.target.innerHTML, properties: null});
	const icons: ButtonIcon[] = [
		<PopoverIcon icon={AdjustIcon} key={0}>
			<ParagraphSettingsCallout data={settings} onEdit={settings => onEdit({content: data.content, properties: JSON.stringify(settings)})}/>
		</PopoverIcon>
	]
	return <>
		<EditableComponentContainer as={DataParagraph} role="paragraph" onDelete={onDelete} data={data} icons={icons}
					onBlur={onBlur}/>
	</>
}

const DataParagraph: React.ComponentType<DataComponent & Omit<ParagraphProps, 'settings'>> = ({data, ...rest}) => {
	const settings = data.properties ? jsonParse(SettingsComponentSettingsSchema).parse(data.properties) : {margin: 0, color: '#000'} as const;
	return <>
		<Paragraph className="py-2" settings={settings} {...rest}>{data?.content || 'Text'}</Paragraph>
	</>
}

function createComponents<T extends readonly Component[] & Array<{label: V}>, V extends string>(...args: T) {
	return args
}

const components = createComponents(
	{
		label: 'Header',
		editable: EditableHeader,
		component: DataHeader
	},
	{
		label: 'Paragraph',
		editable: EditableParagraph,
		component: DataParagraph
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

export type EditableComponentType = {type: ComponentType, id: number} & EditableDataComponent;
export type DataComponentType = {type: ComponentType, id: number} & DataComponent;

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

type CustomComponentsProps = {isNew?: boolean} & 
	IfElse<'editable', {items: EditableComponentType[], onReorder: (items: EditableComponentType[]) => void}, 
		{items: DataComponentType[]}>
export const CustomComponents = ({isNew=false, ...rest}: CustomComponentsProps) => {
	return <AnnotationLinkProvider>
		{rest.editable ? <EditableComponentsList items={rest.items} isNew={isNew} onReorder={rest.onReorder}/> 
			: rest.items.map((item, i) => <CustomComponent key={i} {...item} isNew={isNew} editable={false}/>)}
	</AnnotationLinkProvider>
}

export const CustomComponent = (props: IfElse<'editable', EditableComponentType, DataComponentType> & {isNew: boolean}) => {
	const Component = components.find(x => x.label == props.type) || components[0] as Component;
	if (props.editable) {
		const {type: _, editable: _a, id, ...rest} = props;
		const isNew = id < 0;
		return <div data-testid={`custom-component-editable-${id}`} role="custom-component-editable">
			{props.isNew ? <Component.editable {...rest}/> : 
			<DirtyComponent key={id} as={Component.editable} {...rest} dirty={isNew} overrideDelete={isNew} showCancel={!isNew}></DirtyComponent>}
		</div>
	}
	
	const {type: _, editable: _a, id, ...rest} = props;
	return <div data-testid={`custom-component-${id}`} role="custom-component">
		<Component.component {...rest}></Component.component>
	</div>
}

type EditableComponentsListProps = {
	items: EditableComponentType[],
	isNew: boolean,
	onReorder: (items: EditableComponentType[]) => void
}
const EditableComponentsList = ({items, isNew, onReorder}: EditableComponentsListProps) => {
	const Component = isNew ? DraggableListComponent : DirtyDraggableListComponent;
	return <>
		<Component id="editable-components" items={items} onReorder={onReorder}>
			{item => <CustomComponent {...item} isNew={isNew} editable={true}/> }
		</Component>
	</>
}

export default function AddComponent({onAdd}: {onAdd: (component: ComponentType) => void}) {
  const items: DropdownItem<ComponentType>[] = components.map(comp => ({name: comp.label, id: comp.label}))
	return (
		<Dropdown items={items} chevron={false} onChange={item => onAdd(item.id)}>
			+
		</Dropdown>
  )
}