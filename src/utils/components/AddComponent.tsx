import React, { useState } from 'react'
import Editable from './Editable'
import { type PolymorphicComponentProps } from '../types/polymorphic'
import CondensedTimeline from './Timeline/CondensedTimeline'
import { useService } from '../react-service-container'
import { type TimelineCategory, TimelineService } from './Timeline/TimelineService'
import { DeleteIcon, EditIcon } from './icons/icons'
import Dropdown, { type DropdownItem } from './Dropdown'
import Header from './base/baseComponents'

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
											<Dropdown className="rounded-md bg-slate-50 hover:bg-slate-300 p-1 ml-1" 
													key={1} items={dropdownItems}>
												<EditIcon className="h-5 w-5"/>
											</Dropdown>]}>
						Text
					</Editable>
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
]


export default function AddComponent({onAdd}: {onAdd: (component: React.ElementType<onDeleteComponent>) => void}) {
  const items: DropdownItem[] = components.map(comp => ({label: comp.label, handler: () => onAdd(comp.component)}))
	return (
		<Dropdown items={items}>
			+
		</Dropdown>
  )
}