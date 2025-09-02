import { useMemo } from 'react';
import Editable, {
  ButtonIcon,
  DeletableComponentProps,
  EditableProps,
} from '../../edit/editable';
import { DropdownItem } from '../../base/dropdown';
import { DeleteIcon, DragMoveIcon } from '../../icons/icons';
import { PlusIcon } from '@heroicons/react/outline';
import { PopoverIcon } from '../../base/popover';
import { components } from './components';
import { ComponentType } from './types';

export type EditableComponentContainerProps<C extends React.ElementType> =
  DeletableComponentProps &
    EditableProps<C> & {
      onAdd: (component: ComponentType) => void;
    };
export const EditableComponentContainer = <C extends React.ElementType>(
  props: EditableComponentContainerProps<C>
) => {
  const items: DropdownItem<ComponentType>[] = useMemo(
    () =>
      components.map((comp) => ({
        name: comp.label,
        id: comp.label,
      })),
    []
  );
  const defaultIcons: ButtonIcon[] = [
    { icon: DeleteIcon, handler: props.onDelete },
    { icon: DragMoveIcon },
    <PopoverIcon icon={PlusIcon} key={2}>
      <div className="flex w-[8rem] flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            className="rounded-md p-1 hover:bg-primary-light hover:text-white"
            onClick={() => props.onAdd(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </PopoverIcon>,
  ];
  const allIcons = defaultIcons.concat(props.icons || []);
  return (
    <>
      <Editable {...props} icons={allIcons} />
    </>
  );
};
