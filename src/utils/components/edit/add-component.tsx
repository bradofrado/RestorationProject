'use client';

import React, { useMemo } from 'react';
import Dropdown, { type DropdownItem } from '../base/dropdown';
import { components } from '../blocks/utils/components';
import { ComponentType } from '../blocks/utils/types';

export default function AddComponent({
  onAdd,
}: {
  onAdd: (component: ComponentType) => void;
}) {
  const items: DropdownItem<ComponentType>[] = useMemo(
    () =>
      components.map((comp) => ({
        name: comp.label,
        id: comp.label,
      })),
    []
  );
  return (
    <Dropdown
      anchor="top start"
      items={items}
      chevron={false}
      onChange={(item) => onAdd(item.id)}
    >
      +
    </Dropdown>
  );
}
