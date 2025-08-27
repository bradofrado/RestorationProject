import React from 'react';
import Editable from '~/utils/components/edit/editable';
import { type ButtonIcon } from '~/utils/components/edit/editable';
import Button from '~/utils/components/base/buttons/button';
import { DeleteIcon } from '~/utils/components/icons/icons';
import { type PolymorphicCustomProps } from '~/utils/types/polymorphic';
import { type IfElse } from '~/utils/utils';

export type RenderableComponent<T> = {
  component: React.ComponentType<T>;
  props: T;
  id: string;
};
type AddRemoveValueProps<T> = {
  items: T[];
  onAdd: () => void;
} & IfElse<
  'custom',
  {
    children: (
      item: T,
      index: number,
      component: typeof AddRemoveItem
    ) => React.ReactNode;
  },
  {
    children: (item: T, index: number) => React.ReactNode;
    onDelete: (index: number) => void;
  }
>;

type AddRemoveProps<
  C extends React.ElementType<React.PropsWithChildren>,
  T
> = PolymorphicCustomProps<C, AddRemoveValueProps<T>, { container?: C }>;

const AddRemove = <C extends React.ElementType, T>(
  props: AddRemoveProps<C, T>
) => {
  const { onAdd, children, items, container, onDelete, custom } = props;
  const Component = container || 'span';
  const itemElements = items.map((item, i) =>
    custom ? (
      children(item, i, AddRemoveItem)
    ) : (
      <AddRemoveItem key={i} onDelete={() => onDelete(i)}>
        {children(item, i)}
      </AddRemoveItem>
    )
  );
  const rendered = container ? (
    <Component {...props}>{itemElements}</Component>
  ) : (
    itemElements
  );
  return (
    <>
      <div className="flex flex-col gap-2">{rendered}</div>
      <div>
        <Button mode="secondary" className="my-1" onClick={onAdd}>
          +
        </Button>
      </div>
    </>
  );
};

type Props = {
  onDelete: () => void;
  children?: React.ReactNode;
  icons?: ButtonIcon[];
};
type AddRemoveItemProps<T extends React.ElementType> = PolymorphicCustomProps<
  T,
  Props,
  { component?: T }
>;
const AddRemoveItem = <T extends React.ElementType>({
  component,
  onDelete,
  children,
  icons: iconsProp,
  ...rest
}: AddRemoveItemProps<T>) => {
  const Component = component || 'span';
  const icons: ButtonIcon[] = [
    {
      icon: DeleteIcon,
      handler: onDelete,
    },
  ];
  iconsProp && icons.push(...iconsProp);
  return (
    <Editable icons={icons} editable="false">
      {children || <Component {...rest} />}
    </Editable>
  );
};

export default AddRemove;
