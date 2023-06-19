import React from 'react';
import Button from '~/utils/components/base/button';
import {RemoveIcon} from '~/utils/components/icons/icons';
type RemoveFieldProps = {
	value: boolean,
	onRemove: () => void
} & React.PropsWithChildren
export const RemoveField = ({value, onRemove, children}: RemoveFieldProps) => {
	return <>
		<div className="flex items-center">
			{children}
			{value && <Button className="ml-1 py-2" mode="secondary" title="Remove" onClick={onRemove}>
				<RemoveIcon className="h-4 w-4"></RemoveIcon>
			</Button>}
		</div>
	</>
}