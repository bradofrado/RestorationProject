import React from 'react';
import Editable, { type EditableComponent, type EditableComponentProps } from '~/utils/components/edit/editable';
import {type ButtonIcon} from '~/utils/components/edit/editable';
import Button from '~/utils/components/base/button';
import {DeleteIcon} from '~/utils/components/icons/icons';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';
import { DirtyComponent } from '../edit/dirty-component';

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

type AddRemoveEditableProps<T> = {
	isDirty?: false,
} | {
	isDirty: true,
	isNewItem: (item: T) => boolean
}
export const AddRemoveEditable = <K,>({items, onAdd, ...rest}: Omit<AddRemoveProps<EditableComponentProps<K>>, 'onDelete'> & AddRemoveEditableProps<K>) => {
	return <>
		{items.map((item, i) => {
			const props: AddRemoveItemProps<EditableComponent<K>> = {...item.props, component: item.component};
			if (rest.isDirty) {
				const isNew = rest.isNewItem(item.props.data);
				return <DirtyComponent key={i} as={AddRemoveItem} {...props} dirty={isNew} overrideDelete={isNew} showCancel={!isNew} dataTestId={`dirty-component-${item.id}`}/>;
			}
			return <AddRemoveItem key={i} {...props}/>
		})}
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