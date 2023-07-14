import React, { useState } from 'react';
import Editable, { type EditableComponent, type EditableComponentProps } from '~/utils/components/edit/editable';
import {type ButtonIcon} from '~/utils/components/edit/editable';
import Button from '~/utils/components/base/button';
import {DeleteIcon} from '~/utils/components/icons/icons';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';
import { DirtyComponent } from '../edit/dirty-component';
import {DirtyDraggableListComponent, DraggableListComponent, DraggableListComponentProps, DraggableListItem, ReorderableDataProps} from '~/utils/components/base/draggable-list';

export type RenderableComponent<T> = {
	component: React.ComponentType<T>,
	props: T,
	id: string
}
type AddRemoveProps<T> = {
	items: RenderableComponent<T>[],
	onAdd: () => void,
	onDelete: (index: number) => void
}
const AddRemove = ({items, onAdd, onDelete}: AddRemoveProps<object>) => {
	return <>
		{items.map((item, i) => {
			return <AddRemoveItem key={i} component={item.component} onDelete={() => onDelete(i)} {...item.props}/>
		})}
		<div>
			<Button mode="secondary" className="my-1" onClick={onAdd}>
				+
			</Button>
		</div>
	</>
}

type IsDirtyProps<T> = {
	isDirty?: false,
} | {
	isDirty: true,
	isNewItem: (item: T) => boolean
}

type IsDraggableProps = {
	isDraggable?: boolean
}

type AddRemoveEditableProps<T extends ReorderableDataProps> = Omit<AddRemoveProps<EditableComponentProps<T>>, 'onDelete'> & IsDirtyProps<T> & IsDraggableProps
export const AddRemoveEditable = <T extends ReorderableDataProps>({items, onAdd, isDraggable=false, ...rest}:  AddRemoveEditableProps<T>) => {
	const onReorder = (newItems: DraggableListItem<T>[]) => {
		for (const item of items) {
			const reorderItem = newItems.find(x => x.id == item.props.data.id);
			if (!reorderItem) throw new Error(`Cannot find reorder item ${item.props.data.id}`);
			item.props.onEdit(reorderItem.data);
		}
	}

	const getElements = () => {
		return items.map((item, i) => {
			const props: AddRemoveItemProps<EditableComponent<T>> = {...item.props, component: item.component};
			if (rest.isDirty) {
				const isNew = rest.isNewItem(item.props.data);
				return <DirtyComponent key={i} as={AddRemoveItem} {...props} dirty={isNew} overrideDelete={isNew} showCancel={!isNew} dataTestId={`dirty-component-${item.id}`}/>
			}
			return <AddRemoveItem key={i} {...props}/>;
		});
	}

	const renderItems = () => {
		const elements = getElements();
		if (isDraggable) {
			const draggableItems: DraggableListItem<T>[] = elements.map((element, i) => ({id: i + 1, element, data: items[i]?.props.data as T}))
			const props: DraggableListComponentProps<T> = {
				items: draggableItems,
				onReorder
			}

			const DraggableComponent = rest.isDirty ? DirtyDraggableListComponent : DraggableListComponent;

			return <DraggableComponent {...props}/>
		}

		return elements;
	}

	return <>
		{renderItems()}
		<div>
			<Button mode="secondary" className="my-1" onClick={onAdd}>
				+
			</Button>
		</div>
	</>
}
type Props = {
	onDelete: () => void
}
type AddRemoveItemProps<T extends React.ElementType> = PolymorphicCustomProps<T, Props, {component?: T}>
const AddRemoveItem = <T extends React.ElementType>({component, onDelete, ...rest}: AddRemoveItemProps<T>) => {
	const Component = component || 'span';
	const icons: ButtonIcon[] = [
		{
			icon: DeleteIcon,
			handler: onDelete
		}
	];
	return <Editable icons={icons} editable="false"><Component {...rest}/></Editable>
}

export default AddRemove;