import { useEffect, useState } from "react";
import Dropdown, { type DropdownItem, type ItemAction } from "../base/dropdown";
import Button from "../base/buttons/button";
import ConfirmButton from "../base/buttons/confirmbutton";

type EditItemsAction = (isNew: boolean) => void;
type EditItemsButtonsProps<T> = {
	items: DropdownItem<T>[],
	value?: T | undefined
	onAdd: EditItemsAction,
	onSave: EditItemsAction,
	onClear: EditItemsAction,
	onDelete: EditItemsAction,
	onChange: ItemAction<T>,
	children?: React.ReactNode | ((props: {isNew: boolean}) => JSX.Element)
}
const EditItemsButtons = <T,>({items, value, onAdd, onSave, onClear, onDelete, onChange, children}: EditItemsButtonsProps<T>) => {
	const [isNew, setIsNew] = useState(value == undefined);

	useEffect(() => {
		const item = items.find(x => x.id == value);
		setIsNew(item == undefined);
	}, [items, value]);

	const onAction = (action: EditItemsAction, newIsNew: boolean) => {
		return () => {
			action(isNew);
			setIsNew(newIsNew);
		}
	}

	const onDropdownChange: ItemAction<T> = (item, index) => {
		onChange(item, index);
		setIsNew(false);
	}
	return <>
		<Dropdown items={items} onChange={onDropdownChange} initialValue={value}>select</Dropdown>
		<span className="mx-1">
			{value == undefined ? 
				<Button onClick={onAction(onAdd, true)} mode="secondary">Add</Button> : 
				(<>
					<Button className="mr-1" onClick={onAction(onSave, false)}>Save</Button>
					{!isNew && <ConfirmButton className="mr-1" onConfirm={onAction(onDelete, false)} mode="secondary" 
						header="Confirm deletion" message="Are you sure you want to delete this item?">Delete</ConfirmButton>}
					<Button onClick={onAction(onClear, false)} mode="secondary">Clear</Button>
				</>)}
		</span>
		{(typeof children == 'function' ? children({isNew}): children)}
	</>
}

export default EditItemsButtons;