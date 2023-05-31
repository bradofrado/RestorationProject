import React from 'react';
import Editable from '~/utils/components/edit/editable';
import {type ButtonIcon} from '~/utils/components/edit/editable';
import Button from '~/utils/components/base/button';
import {DeleteIcon} from '~/utils/components/icons/icons';
type AddRemoveProps = {
	items: React.ReactNode[],
	onDelete: (i: number) => void,
	onAdd: () => void
}
const AddRemove = ({items, onDelete, onAdd}: AddRemoveProps) => {
	return <>
		{items.map((item, i) => {
			const icons: ButtonIcon[] = [
				{
					icon: DeleteIcon,
					handler: () => onDelete(i)
				}
			]
			return <Editable icons={icons} key={i} editable="false">{item}</Editable>
		})}
		<div>
			<Button mode="secondary" className="my-1" onClick={onAdd}>
				+
			</Button>
		</div>
	</>
}

export default AddRemove;