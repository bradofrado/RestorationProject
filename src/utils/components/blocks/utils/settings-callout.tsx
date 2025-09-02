import { useChangeProperty } from '~/utils/utils';
import { EditableComponentProps } from '../../edit/editable';
import { SettingsComponentSettings } from './settings-component';
import { NumberInput } from '../../base/input';
import Label from '../../base/label';
import ColorPicker from '../../base/color-picker';
import { defaultColors } from './default-colors';

type SettingsComponentCalloutProps<T extends SettingsComponentSettings> =
  EditableComponentProps<T> & {
    children?: (
      rest: Omit<T, 'margin' | 'color'>,
      changeSetting: (key: keyof T, value: T[keyof T]) => T
    ) => React.ReactNode;
  };
export const SettingsComponentCallout = <T extends SettingsComponentSettings>({
  data,
  onEdit,
  children,
}: SettingsComponentCalloutProps<T>) => {
  const changeSetting = useChangeProperty<T>(onEdit);
  const { margin, color, ...rest } = data;
  return (
    <>
      <div className="flex w-[8rem] flex-col gap-1 p-1">
        <Label label="Margin" sameLine>
          <NumberInput
            inputClass="w-[4rem]"
            value={margin}
            onChange={(value) => changeSetting(data, 'margin', value)}
            min={0}
          />
        </Label>
        <Label label="Color" sameLine>
          <ColorPicker
            className="m-auto"
            value={color}
            onChange={(value) => changeSetting(data, 'color', value)}
            defaultColors={defaultColors}
          />
        </Label>
        {children &&
          children(rest, (key, value) => changeSetting(data, key, value))}
      </div>
    </>
  );
};
