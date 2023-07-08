import React, { useState } from 'react';
import Editable, { type EditableComponent, type EditableComponentProps } from '~/utils/components/edit/editable';
import {type ButtonIcon} from '~/utils/components/edit/editable';
import Button from '~/utils/components/base/button';
import {DeleteIcon} from '~/utils/components/icons/icons';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';
import { DirtyComponent } from '../edit/dirty-component';
import {DraggableListComponent, DraggableListItem, ReorderableDataProps} from '~/utils/components/base/draggable-list';

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
export const AddRemoveEditable = <T extends ReorderableDataProps>({items, onAdd, ...rest}:  AddRemoveEditableProps<T>) => {
	const [reorderItems, setReorderItems] = useState<T[] | null>(null);
	const onReorder = (items: T[]) => {
		setReorderItems(items);
	}

	const onSaveReorder = () => {
		if (!reorderItems) return;
		for (const item of items) {
			const reorderItem = reorderItems.find(x => x.id == item.props.data.id);
			if (!reorderItem) throw new Error(`Cannot find reorder item ${item.props.data.id}`);
			item.props.onEdit(reorderItem);
		}
		setReorderItems(null);
	}

	const onCancelReorder = () => {
		setReorderItems(null);
	}

	const draggableItems: DraggableListItem<T>[] = items.map((item, i) => {
		const props: AddRemoveItemProps<EditableComponent<T>> = {...item.props, component: item.component};
		if (rest.isDirty) {
			const isNew = rest.isNewItem(item.props.data);
			return {
				id: i + 1, data: item.props.data,
				element: <DirtyComponent key={i} as={AddRemoveItem} {...props} dirty={isNew} overrideDelete={isNew} showCancel={!isNew} dataTestId={`dirty-component-${item.id}`}/>
			};
		}
		return {id: i, element: <AddRemoveItem key={i} {...props}/>, data: item.props.data};
	});

	return <>
		{reorderItems && <div>
				<Button className="mx-1" mode="primary" onClick={onSaveReorder}>Save Reorder</Button>
				<Button mode="secondary" onClick={onCancelReorder}>Cancel</Button>
			</div>
		}
		<DraggableListComponent items={draggableItems} onReorder={onReorder}/>
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