import React, { useCallback, useEffect, useState } from 'react';
import {DraggableCollectionOptions, DroppableCollectionDropEvent, DroppableCollectionOptions, DroppableCollectionReorderEvent, ListDropTargetDelegate, ListKeyboardDelegate, mergeProps, useDraggableCollection, useDraggableItem, useDropIndicator, useDroppableCollection, useDroppableItem, useFocusRing, useListBox, useOption} from 'react-aria';
import {Node} from "@react-types/shared"
import {DraggableCollectionState, DraggableCollectionStateOptions, DroppableCollectionState, Item, ListProps, ListState, useDraggableCollectionState, useDroppableCollectionState, useListData, useListState} from 'react-stately';
import {Key} from 'react';

function ReorderableListBox<T>(props: ListProps<DraggableListItem<T>> & DroppableCollectionOptions & DraggableCollectionOptions) {
    // See useListBox docs for more details.
    const state = useListState(props);
    const ref = React.useRef(null);
    const { listBoxProps } = useListBox(
      {
        ...props,
        shouldSelectOnPressUp: true
      },
      state,
      ref
    );
  
    const dropState = useDroppableCollectionState({
      ...props,
      collection: state.collection,
      selectionManager: state.selectionManager
    });
  
    const { collectionProps } = useDroppableCollection(
      {
        ...props,
        keyboardDelegate: new ListKeyboardDelegate(
          state.collection,
          state.disabledKeys,
          ref
        ),
        dropTargetDelegate: new ListDropTargetDelegate(state.collection, ref)
      },
      dropState,
      ref
    );
  
    // Setup drag state for the collection.
    const dragState = useDraggableCollectionState({
      ...props,
      // Collection and selection manager come from list state.
      collection: state.collection,
      selectionManager: state.selectionManager,
      // Provide data for each dragged item. This function could
      // also be provided by the user of the component.
      getItems: ((keys) => {
        return [...keys].map((key) => {
          const item = state.collection.getItem(key);
  
          return {
            'text/plain': item?.textValue || item?.value?.id
          };
        });
      })
    });
  
    useDraggableCollection(props, dragState, ref);
  
    return (
      <ul
        {...mergeProps(listBoxProps, collectionProps)}
        ref={ref}
      >
        {[...state.collection].map((item) => (
          <ReorderableOption
            key={item.key}
            item={item}
            state={state}
            dragState={dragState}
            dropState={dropState}
          />
        ))}
      </ul>
    );
  }
  
  function ReorderableOption({ item, state, dragState, dropState }: {item: Node<object>, state: ListState<object>, dragState: DraggableCollectionState, dropState: DroppableCollectionState}) {
    // Setup listbox option as normal. See useListBox docs for details.
    const ref = React.useRef(null);
    const { optionProps } = useOption({ key: item.key }, state, ref);
    const { isFocusVisible, focusProps } = useFocusRing();

    // Register the item as a drop target.
    const { dropProps, isDropTarget } = useDroppableItem(
        {
        target: { type: 'item', key: item.key, dropPosition: 'on' }
        },
        dropState,
        ref
    );
  
    // Register the item as a drag source.
    const { dragProps } = useDraggableItem({
      key: item.key
    }, dragState);
    const dragging = dragState.isDragging(item.key);
    return (
      <>
        <DropIndicator
          target={{ type: 'item', key: item.key, dropPosition: 'before' }}
          dropState={dropState}
        />
        <li
          {...mergeProps(optionProps, dragProps, dropProps, focusProps)}
          ref={ref}
          className={`option ${isFocusVisible ? 'focus-visible' : ''} ${
            isDropTarget ? 'drop-target' : ''} 
          `}
        >
          {item.rendered}
        </li>
        {state.collection.getKeyAfter(item.key) == null &&
          (
            <DropIndicator
              target={{ type: 'item', key: item.key, dropPosition: 'after' }}
              dropState={dropState}
            />
          )}
      </>
    );
  }

function DropIndicator(props) {
  const ref = React.useRef(null);
  const { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(
    props,
    props.dropState,
    ref
  );
  if (isHidden) {
    return null;
  }

  return (
    <li
      {...dropIndicatorProps}
      role="option"
      ref={ref}
      className={`w-full ml-0 h-[2px] mb-[-2px] outline-none ${isDropTarget ? 'bg-primary' : 'bg-transparent'}`}
    />
  );
}

export type DraggableListItem<T> = {
  id: number | string,
  element: React.ReactElement,
  data: T
}
type DraggableListComponentProps<T> = {
  onReorder: (items: T[]) => void,
  items: DraggableListItem<T>[]
}

export type ReorderableDataProps = {
	id: string | number,
	order: number
}


export const DraggableListComponent = <T extends ReorderableDataProps>({items, onReorder: onReorderProps}: DraggableListComponentProps<T>) => {
  const [isReordering, setIsReordering] = useState(false);
  const list = useListData({
    initialItems: items,
  });

  const updateDataOrder = useCallback(() => {
    if (!isReordering) return;
    const dataItems = list.items.map(x => x.data);
    for (let i = 0; i < dataItems.length; i++) {
      dataItems[i] = {...dataItems[i], order: i} as T;
    }
    onReorderProps && onReorderProps(dataItems);
  }, [isReordering, list.items]);

  useEffect(() => {
    if (!isReordering) return;
    updateDataOrder();
    setIsReordering(false);
  }, [isReordering, updateDataOrder])
  
  const onReorder = (e: DroppableCollectionReorderEvent) => {
    if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, e.keys);
    } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, e.keys);
    }
    setIsReordering(true);
  };
  
  return (
    <ReorderableListBox
      aria-label="Favorite animals"
      selectionMode="multiple"
      selectionBehavior="replace"
      items={list.items}
      getDropOperation={() => 'move'}
      //onDrop={(e) => onReorder(e)}
      onReorder={(e) => onReorder(e)}
    >
      {(item) => <Item>{item.element}</Item>}
    </ReorderableListBox>
  );
}
