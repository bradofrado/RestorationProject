import { type FC } from 'react';
import { type DataComponent } from '../utils/types';
import BomHeatmap from './bom-heatmap-names';

const CUSTOM_COMPONENTS = {
  'BOM Names Heatmap': BomHeatmap,
} as const;

export type CustomComponentKey = keyof typeof CUSTOM_COMPONENTS;
export const CUSTOM_COMPONENT_OPTIONS = Object.keys(
  CUSTOM_COMPONENTS
) as CustomComponentKey[];

export const CustomBlock: FC<DataComponent> = ({ data }) => {
  const key = (data.content ||
    CUSTOM_COMPONENT_OPTIONS[0]) as CustomComponentKey;
  const Component =
    CUSTOM_COMPONENTS[key] ?? CUSTOM_COMPONENTS[CUSTOM_COMPONENT_OPTIONS[0]!];
  return <Component />;
};
