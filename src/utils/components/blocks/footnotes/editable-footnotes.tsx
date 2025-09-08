import { FC } from 'react';
import { FootnotesBlock, footnotesSettingsSchema } from './footnotes';
import { EditableDataComponent } from '../utils/types';
import { EditableComponentContainer } from '../utils/editable-component-container';
import { SettingsComponentCallout } from '../utils/settings-callout';
import { PopoverIcon } from '../../base/popover';
import { ButtonIcon } from '../../edit/editable';
import { AdjustIcon } from '../../icons/icons';
import { useParseSettings } from '../utils/parse-settings';
import Input, { NumberInput } from '../../base/input';
import Label from '../../base/label';

export const EditableFootnotesBlock: FC<EditableDataComponent> = ({
  onEdit,
  data,
  ...rest
}) => {
  const settings = useParseSettings(
    data.properties,
    footnotesSettingsSchema,
    {}
  );
  const icons: ButtonIcon[] = [
    <PopoverIcon icon={AdjustIcon} key={0}>
      <SettingsComponentCallout
        onEdit={(settings) =>
          onEdit({
            content: data.content,
            properties: JSON.stringify(settings),
          })
        }
        data={settings}
      >
        {({ title, headerLevel }, changeSetting) => (
          <>
            <Input
              inputClass="w-[7rem] ml-1"
              include={Label}
              label="Title"
              value={title}
              onChange={(value) => changeSetting('title', value)}
            />
            <NumberInput
              inputClass="w-[4rem] ml-1"
              include={Label}
              label="Header Level"
              value={headerLevel}
              sameLine
              onChange={(value) => changeSetting('headerLevel', value)}
              min={1}
              max={6}
            />
          </>
        )}
      </SettingsComponentCallout>
    </PopoverIcon>,
  ];
  return (
    <EditableComponentContainer
      icons={icons}
      {...rest}
      as={FootnotesBlock}
      data={data}
    />
  );
};
