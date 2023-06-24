import { useReducer, useState } from 'react';
import {EditableComponent, EditableComponentProps} from '~/utils/components/edit/editable';
import { PolymorphicComponentProps } from '~/utils/types/polymorphic';
import Button from '~/utils/components/base/button';
type DirtyComponentProps<T,> = PolymorphicComponentProps<EditableComponent<T>, EditableComponentProps<T>>;
type DirtyState<T> = {
    state: false
} | ({
    state: true
} & DirtyType<T>);

type DirtyType<T> = {
    type: "edit",
    data: T
} | {
    type: "delete"
}

export const DirtyComponent = <T,>({as, onDelete: onDeleteProps, onEdit: onEditProps, data}: DirtyComponentProps<T>) => {
    const [dirtyState, setDirtyState] = useState<DirtyState<T>>({state: false});
    const [currData, setCurrData] = useState<T | null>(data);
    const isNew = false;
    const disabled = false;
    const showCancel = true; //item.id > 0

    const onDelete = () => {
        setDirtyState({state: true, type: "delete"});
    }

    const onEdit = (data: T) => {
        setDirtyState({state: true, type: "edit", data});
        setCurrData(data);
    }

    const onSave = () => {
        if (!dirtyState.state) return;
        if (dirtyState.type == "edit") {
            onEditProps(dirtyState.data);
        } else {
            onDeleteProps();
        }
        setDirtyState({state: false});
    }

    const onCancel = () => {
        setCurrData(data);
        setDirtyState({state: false});
    }

    if (!as) {
        return <div></div>
    }
    const Component = as;
    return <div className="relative">
        <Component onDelete={onDelete} onEdit={onEdit} data={currData}/>
        {!isNew && (dirtyState.state || disabled) && <div className="my-1 text-right mx-4 z-20 relative">
            {showCancel && <Button className="mx-1" mode="secondary" onClick={onCancel}>Cancel</Button>}
            <Button mode="primary" onClick={onSave}>Save</Button>
        </div>}
    </div>
}