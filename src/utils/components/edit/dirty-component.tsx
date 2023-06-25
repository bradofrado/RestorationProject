import { useEffect, useState } from 'react';
import {type EditableComponent, type EditableComponentProps} from '~/utils/components/edit/editable';
import { type PolymorphicComponentProps } from '~/utils/types/polymorphic';
import Button from '~/utils/components/base/button';
type DirtComponentOtherProps = {
    showCancel?: boolean,
    overrideDelete?: boolean,
    overrideEdit?: boolean,
    dirty?: boolean
}
type DirtyComponentProps<T,> = PolymorphicComponentProps<EditableComponent<T>, EditableComponentProps<T>> & DirtComponentOtherProps;
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

export const DirtyComponent = <T,>({as, onDelete: onDeleteProps, onEdit: onEditProps, data, dirty=false, overrideDelete, overrideEdit, showCancel=true}: DirtyComponentProps<T>) => {
    const [dirtyState, setDirtyState] = useState<DirtyState<T>>(dirty ? {state: true, type: 'edit', data} : {state: false});
    const [currData, setCurrData] = useState<T>(data);
    
    useEffect(() => setCurrData(data), [data]);

    const onDelete = () => {
        if (overrideDelete) {
            onDeleteProps();
        } else {
            setDirtyState({state: true, type: "delete"});
        }
    }

    const onEdit = (data: T) => {
        if (overrideEdit) {
            onEditProps(data);
        } else { 
            setDirtyState({state: true, type: "edit", data});
        }
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
        {dirtyState.state && dirtyState.type == 'delete' && <div className="absolute top-0 left-0 h-full w-full opacity-50 bg-red-200 rounded-xl z-10"></div>}
        <Component onDelete={onDelete} onEdit={onEdit} data={currData}/>
        {dirtyState.state && <div className="my-1 text-right mx-4 z-10 relative">
            {showCancel && <Button className="mx-1" mode="secondary" onClick={onCancel}>Cancel</Button>}
            <Button mode="primary" onClick={onSave}>Save</Button>
        </div>}
    </div>
}