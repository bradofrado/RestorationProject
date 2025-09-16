import { EditableData } from '~/utils/types/page';
import { EditableDeleteableComponentProps } from '../../edit/editable';
import z from 'zod';

export interface DataComponent {
  data: EditableData;
  className?: string;
}

export type EditableDataComponent =
  EditableDeleteableComponentProps<EditableData> &
    DataComponent & {
      onAdd: (component: ComponentType) => void;
    };

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: EditableData) => void;
}

const componentsTypes = [
  'Header',
  'Paragraph',
  'Timeline',
  'List',
  'Quote',
  'Image',
  'Footnotes',
] as const;

export type ComponentType = (typeof componentsTypes)[number];
export const ComponentTypeSchema = z.custom<ComponentType>((val) => {
  return (componentsTypes as ReadonlyArray<string>).includes(val as string);
});

export interface Component {
  label: string;
  editable: React.FC<EditableDataComponent>;
  component: React.FC<DataComponent>;
  confirmModal?: React.FC<ConfirmModalProps>;
}

export type EditableComponentType = {
  type: ComponentType;
  id: number;
} & EditableDataComponent;
export type DataComponentType = {
  type: ComponentType;
  id: number;
} & DataComponent;

export type ContentEditable = {
  contentEditable?: boolean | 'true' | 'false';
};
export type ContentEditableBlur = ContentEditable & {
  onBlur?: (value: string, index: number) => void;
};
