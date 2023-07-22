import React, {useEffect, useState } from 'react';
import Button from '~/utils/components/base/button';
import { Draggable, DragDropContext, Droppable, type DroppableProps, type DraggableProps, type DropResult } from "react-beautiful-dnd";
import { type Replace, type ReplaceWithName } from '~/utils/utils';

export const DroppableComponent = ({ children, ...props }: Replace<DroppableProps, 'children', React.ReactNode>) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>
    {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
      {children}
      {provided.placeholder}
      </div>
    )}
  </Droppable>;
};

type DraggableComponentProps = ReplaceWithName<Replace<DraggableProps, 'children', React.ReactNode>, 'draggableId', {id: string}> 
export const DraggableComponent = ({children, id, ...rest}: DraggableComponentProps) => {
  return <>
  <Draggable key={id} draggableId={`${id}`} {...rest}>
    {(provided) => (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
      {children}
      </div>
    )}
  </Draggable>
  </>
}

type DroppableContextProps<T> = {
  onReorder: (items: T[]) => void,
  id: string,
  children: React.ReactNode,
  items: T[]
}
export const DroppableContext = <T,>({onReorder, id, children, items}: DroppableContextProps<T>) => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const copy = [...items];
    const [orderedTodo] = copy.splice(result.source.index, 1);
    if (!orderedTodo) throw new Error("No ordered :(");
    copy.splice(result.destination.index, 0, orderedTodo);
    onReorder(copy);
  }
  return <>
  <DragDropContext onDragEnd={handleOnDragEnd}>
    <DroppableComponent droppableId={id}>
      {children}
    </DroppableComponent>
  </DragDropContext>
  </>
}

type DraggableListComponentProps<T> = Replace<DroppableContextProps<T>, 'children', (item: T, index: number) => React.ReactNode>
export const DraggableListComponent = <T extends {id: number} | string>({children, items, ...rest}: DraggableListComponentProps<T>) => {
  const getId = (item: T): string => {
    if (typeof item == 'string') {
      return item;
    }
    
    return `${item.id}`;
  }
  
  return <>
  <DroppableContext items={items} {...rest}>
    {items.map((item, i) => <DraggableComponent key={getId(item)} id={getId(item)} index={i}>
      {children(item, i)}
    </DraggableComponent>)}
  </DroppableContext>
    
  </>
}

type DirtyDraggableListComponentProps<T> = DraggableListComponentProps<T> & {
  onReordering?: () => void
}
export const DirtyDraggableListComponent = <T extends {id: number}>({children, items: itemsProps, onReorder: onReorderProps, onReordering, ...rest}: DirtyDraggableListComponentProps<T>) => {
  const [items, setItems] = useState(itemsProps.map(x => x.id));
  const [isDirty, setIsDirty] = useState(false);

  const sortItems = (_items: T[]) => _items.slice().sort((a, b) => {
    const aIndex = items.indexOf(a.id);
    const bIndex = items.indexOf(b.id);
    if (aIndex < 0 || bIndex < 0) {
      if (aIndex >= 0) {
        return -1;
      }

      if (bIndex >= 0) {
        return 1;
      }

      return Math.abs(a.id) - Math.abs(b.id);
    }

    return aIndex - bIndex;
  })
  
  const onReorder = (newItems: T[]) => {
    setItems(newItems.map(x => x.id));
    setIsDirty(true);
    onReordering && onReordering();
  }

  const onSave = () => {
    onReorderProps(sortItems(itemsProps));
    setIsDirty(false);
  }

  const onCancel = () => {
    setItems(itemsProps.map(x => x.id));
    setIsDirty(false);
  }

  const sortedItems = sortItems(itemsProps)

  return <>
    {isDirty && <div>
				<Button className="mx-1" mode="primary" onClick={onSave}>Save</Button>
				<Button mode="secondary" onClick={onCancel}>Cancel</Button>
			</div>
		}
    <div className='relative my-2'>
    {isDirty && <div className="absolute top-0 left-0 h-full w-full opacity-50 bg-red-200 rounded-xl" data-testid="dirty-state-delete"></div>}
    <DraggableListComponent items={sortedItems} onReorder={onReorder} {...rest}>
      {children}
    </DraggableListComponent>
    </div>
  </>
}
