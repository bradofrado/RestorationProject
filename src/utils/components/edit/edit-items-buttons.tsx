import { useEffect, useState } from "react";
import Dropdown, { type DropdownItem, type ItemAction } from "../base/dropdown";
import Button from "../base/button";

type EditItemsAction = (isNew: boolean) => void;
type EditItemsButtonsProps<T> = {
	items: DropdownItem<T>[],
	value?: string | undefined
	onAdd: EditItemsAction,
	onSave: EditItemsAction,
	onClear: EditItemsAction,
	onDelete: EditItemsAction,
	onChange: ItemAction<T>
}	
const EditItemsButtons = <T,>({items, value, onAdd, onSave, onClear, onDelete, onChange}: EditItemsButtonsProps<T>) => {
	const [isNew, setIsNew] = useState(value == undefined);

	useEffect(() => {
		setIsNew(value == undefined);
	}, [value]);

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
					{!isNew && <Button className="mr-1" onClick={onAction(onDelete, false)} mode="secondary">Delete</Button>}
					<Button onClick={onAction(onClear, false)} mode="secondary">Clear</Button>
				</>)}
		</span>
	</>
}

export default EditItemsButtons;