import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Fragment, useState, type PropsWithChildren, useEffect } from 'react';
import { CheckIcon, ChevronDown, type IconComponent } from '../icons/icons';
import { type AnchorProps } from '@headlessui/react/dist/internal/floating';

export interface DropdownItem<T> {
  name: React.ReactNode;
  id: T;
}
export type ItemAction<T> = (item: DropdownItem<T>, index: number) => void;
interface DropdownProps<T> extends PropsWithChildren {
  items: DropdownItem<T>[];
  initialValue?: T | null;
  className?: string;
  chevron?: boolean;
  onChange?: ItemAction<T>;
  anchor?: AnchorProps;
}

const Dropdown = <T,>({
  children,
  initialValue,
  onChange,
  items,
  chevron = true,
  className = 'inline-flex items-center w-full justify-center rounded-md bg-white shadow-sm px-3 py-1.5 border text-sm text-gray-900 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
  anchor,
}: DropdownProps<T>) => {
  const [value, setValue] = useState<DropdownItem<T> | undefined>(
    items.find((x) => x.id == initialValue)
  );
  useEffect(() => {
    const newValue = items.find((x) => x.id == initialValue);
    if (value !== newValue) {
      setValue(newValue);
    }
  }, [initialValue, items, value]);

  const onClick = (item: DropdownItem<T>, index: number) => {
    setValue(item);
    if (onChange) {
      onChange(item, index);
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className={className}>
            {initialValue && value ? value?.name : children}{' '}
            {chevron && (
              <ChevronDown className="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
            )}
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            anchor={anchor}
            className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="px-1 py-1 ">
              {items.map((item, i) => (
                <MenuItem key={i}>
                  {({ active }) => (
                    <button
                      data-testid={`dropdown-item-${String(item.id)}`}
                      className={`${
                        active ? 'bg-primary text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => onClick(item, i)}
                    >
                      {item.name}
                    </button>
                  )}
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </>
  );
};

export interface ListItem<T> {
  label: React.ReactNode;
  id: T;
  value: boolean;
}

interface ListItemProps<T> extends Omit<DropdownIconProps<T>, 'items'> {
  items: ListItem<T>[];
  setItems: (items: ListItem<T>[]) => void;
}

export const DropdownList = <T,>({
  items,
  setItems,
  ...rest
}: ListItemProps<T>) => {
  const copy = items.slice();
  const onSelect = (item: ListItem<T>) => {
    item.value = !item.value;
    setItems(copy);
  };
  const dropdownItems = copy.map((item) => ({
    name: (
      <span>
        {item.value && <CheckIcon className="inline h-3 w-3" />} {item.label}
      </span>
    ),
    id: item.id,
  }));
  return (
    <>
      <DropdownIcon
        items={dropdownItems}
        {...rest}
        onChange={(item, index) => onSelect(items[index] as ListItem<T>)}
      />
    </>
  );
};

type DropdownIconProps<T> = Omit<DropdownProps<T>, 'chevron'> & {
  icon: IconComponent;
};
export const DropdownIcon = <T,>({
  icon,
  className,
  ...rest
}: DropdownIconProps<T>) => {
  const Icon = icon;
  return (
    <>
      <Dropdown
        className={`rounded-md bg-slate-50 p-1 hover:bg-slate-300 ${
          className || ''
        }`}
        {...rest}
        chevron={false}
      >
        <Icon className="h-5 w-5" />
      </Dropdown>
    </>
  );
};

export default Dropdown;
