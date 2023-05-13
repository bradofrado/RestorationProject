import React, { useEffect, useState } from 'react'
import Editable, { ButtonIcon } from './Editable'
import { type PolymorphicComponentProps } from '../types/polymorphic'
import CondensedTimeline from './Timeline/CondensedTimeline'
import { useService } from '../react-service-container'
import { type TimelineCategory, TimelineService, RestorationTimelineItem } from './Timeline/TimelineService'
import { AdjustIcon, ArchiveIcon, CheckIcon, DeleteIcon, EditIcon, IconComponent } from './icons/icons'
import Dropdown, { DropdownIcon, DropdownList, type DropdownItem, ListItem } from './Dropdown'
import Header from './base/baseComponents'
import { TranslationMethodsContainer } from './event-page/book-of-mormon-translation'

export interface onDeleteComponent {
	onDelete: () => void
}
interface Component {
	label: string,
	component: React.ElementType<onDeleteComponent>
}

const EditableCondensedTimeline: React.ElementType<onDeleteComponent> = ({onDelete}) => {
	const [category, setCategory] = useState<TimelineCategory>('Book of Mormon');
	const timelineService = useService(TimelineService);
	const items = timelineService.getItems(category);
	const dropdownItems: DropdownItem[] = [
		{
			label: 'Book of Mormon',
			handler: () => setCategory('Book of Mormon')
		},
		{
			label: 'Book of Mormon Translation',
			handler: () => setCategory('Book of Mormon Translation')
		}
	]
	
	return <>
	 				<Editable as={CondensedTimeline} items={items} 
						icons={[{icon: DeleteIcon, handler: onDelete}, 
											<DropdownIcon className="ml-1" 
													key={1} items={dropdownItems} icon={EditIcon}/>]}
						>
						Text
					</Editable>
				</>
}

const EditableList: React.ElementType<onDeleteComponent> = ({onDelete}) => {
	const [type, setType] = useState<TimelineCategory | 'custom'>('custom');
	const timelineService = useService(TimelineService);
	const [listItems, setListItems] = useState<ListItem[]>([{label: 'Group', value: false}])
	const items = type != 'custom' ? timelineService.getItems(type) : null;
	const dropdownItems: DropdownItem[] = [
		{
			label: 'Custom',
			handler: () => setType('custom')
		},
		{
			label: 'Book of Mormon',
			handler: () => setType('Book of Mormon')
		},
		{
			label: 'Book of Mormon Translation',
			handler: () => setType('Book of Mormon Translation')
		},
	]

	const editIcons: ButtonIcon[] = [
		{icon: DeleteIcon, handler: onDelete},
		<DropdownIcon className="ml-1" items={dropdownItems} icon={EditIcon} key={1}/>,
	];

	if (type != 'custom') {
		editIcons.push(<DropdownList className="ml-1" items={listItems} setItems={setListItems} icon={AdjustIcon} key={2} />)
	}
	
	return <>
		{(!listItems[0]?.value || type == 'custom') && <Editable as="ul" className="list-disc px-10" editable={type == 'custom'}
			icons={editIcons}>
			{type == 'custom' && <li></li>}
			{items != null && items.map((item, i) => <li key={i}>{item.text}</li>) }
		</Editable>}
		{listItems[0]?.value && items != null && <Editable as={TranslationMethodsContainer} icons={editIcons} items={items} annotationCount={0}/>}
	</>
}

const components: Component[] = [
	{
		label: 'Header',
		component: ({onDelete}) => <Editable as={Header} icons={[{icon: DeleteIcon, handler: onDelete}]}>
											Text
										</Editable>
	},
	{
		label: 'Paragraph',
		component: ({onDelete}) => <Editable as="p" icons={[{icon: DeleteIcon, handler: onDelete}]}>
											Text
										</Editable>
	},
	{
		label: 'Timeline',
		component: EditableCondensedTimeline
	},
	{
		label: 'List',
		component: EditableList
	}
]


export default function AddComponent({onAdd}: {onAdd: (component: React.ElementType<onDeleteComponent>) => void}) {
  const items: DropdownItem[] = components.map(comp => ({label: comp.label, handler: () => onAdd(comp.component)}))
	return (
		<Dropdown items={items}>
			+
		</Dropdown>
  )
}