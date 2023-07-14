import React from 'react';
import Editable from '~/utils/components/edit/editable';
import {type ButtonIcon} from '~/utils/components/edit/editable';
import Button from '~/utils/components/base/button';
import {DeleteIcon} from '~/utils/components/icons/icons';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';

export type RenderableComponent<T> = {
	component: React.ComponentType<T>,
	props: T,
	id: string
}
type AddRemoveValueProps<T> = {
	items: T[],
	onAdd: () => void,
} & IfElse<'custom', {children: (item: T, index: number, component: typeof AddRemoveItem) => React.ReactNode}, 
	{children: (item: T, index: number) => React.ReactNode, onDelete: (index: number) => void}>

type IfElse<PROPERTY extends string, IF, ELSE> = (Record<PROPERTY, true> & IF) | (Partial<Record<PROPERTY, false>> & ELSE)

type AddRemoveProps<C extends React.ElementType<React.PropsWithChildren>, T> = PolymorphicCustomProps<C, AddRemoveValueProps<T>, {container?: C}>

const AddRemove = <C extends React.ElementType, T>(props: AddRemoveProps<C, T>) => {
	const {onAdd, children, items, container, onDelete, custom} = props;
	const Component = container || 'span';
	const itemElements = items.map((item, i) => custom ? children(item, i, AddRemoveItem) : <AddRemoveItem key={i} onDelete={() => onDelete(i)}>{children(item, i)}</AddRemoveItem>);
	const rendered = container ? <Component {...props}>{itemElements}</Component> :
		itemElements
	return <>
		{rendered}
		<div>
			<Button mode="secondary" className="my-1" onClick={onAdd}>
				+
			</Button>
		</div>
	</>
}

type Props = {
	onDelete: () => void,
	children?: React.ReactNode
}
type AddRemoveItemProps<T extends React.ElementType> = PolymorphicCustomProps<T, Props, {component?: T}>
const AddRemoveItem = <T extends React.ElementType>({component, onDelete, children, ...rest}: AddRemoveItemProps<T>) => {
	const Component = component || 'span';
	const icons: ButtonIcon[] = [
		{
			icon: DeleteIcon,
			handler: onDelete
		}
	];
	return <Editable icons={icons} editable="false">{children || <Component {...rest}/>}</Editable>
}

export default AddRemove;