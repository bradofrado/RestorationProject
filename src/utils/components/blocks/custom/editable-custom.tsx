import { FC } from 'react';
import { EditableDataComponent } from '../utils/types';
import { EditableComponentContainer } from '../utils/editable-component-container';
import {
  CustomBlock,
  CUSTOM_COMPONENT_OPTIONS,
  type CustomComponentKey,
} from './custom';
import { PopoverIcon } from '../../base/popover';
import { AdjustIcon } from '../../icons/icons';
import { ButtonIcon } from '../../edit/editable';

export const EditableCustomBlock: FC<EditableDataComponent> = ({
  onEdit,
  data,
  ...rest
}) => {
  const selected = (
    data.content || CUSTOM_COMPONENT_OPTIONS[0]
  ) as CustomComponentKey;

  const icons: ButtonIcon[] = [
    <PopoverIcon icon={AdjustIcon} key={0}>
      <div className="flex flex-col gap-2 p-1">
        <p className="text-xs font-medium text-stone-500">Component</p>
        <select
          value={selected}
          onChange={(e) =>
            onEdit({ content: e.target.value, properties: data.properties })
          }
          className="rounded-md border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 focus:outline-none"
        >
          {CUSTOM_COMPONENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </PopoverIcon>,
  ];

  return (
    <EditableComponentContainer
      as={CustomBlock}
      icons={icons}
      data={{ ...data, content: selected }}
      {...rest}
    />
  );
};
