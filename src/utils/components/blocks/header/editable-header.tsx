import { FC } from 'react';
import { EditableDataComponent } from '../utils/types';
import { useParseSettings } from '../utils/parse-settings';
import { HeaderBlock, HeaderSettings, HeaderSettingsSchema } from './header';
import { ButtonIcon } from '../../edit/editable';
import { PopoverIcon } from '../../base/popover';
import { AdjustIcon } from '../../icons/icons';
import { EditableComponentContainer } from '../utils/editable-component-container';
import { SettingsComponentCallout } from '../utils/settings-callout';
import { NumberInput } from '../../base/input';
import { HeaderLevels } from '../../base/header';
import Label from '../../base/label';
import { AnnotationComponentProvider } from '../annotation/annotation-component-provider';

export const EditableHeaderBlock: FC<EditableDataComponent> = ({
  onEdit,
  data,
  ...rest
}) => {
  const settings = useParseSettings(data.properties, HeaderSettingsSchema, {
    level: 2,
  });
  const icons: ButtonIcon[] = [
    <PopoverIcon icon={AdjustIcon} key={0}>
      <HeaderSettingsComponent
        settings={settings}
        onEdit={(settings) =>
          onEdit({
            content: data.content,
            properties: JSON.stringify(settings),
          })
        }
      />
    </PopoverIcon>,
  ];
  return (
    <AnnotationComponentProvider
      value={data.content}
      onChange={(value) => onEdit({ ...data, content: value })}
    >
      {({ onBlur }) => (
        <EditableComponentContainer
          as={HeaderBlock}
          onBlur={onBlur}
          icons={icons}
          data={data}
          {...rest}
        />
      )}
    </AnnotationComponentProvider>
  );
};

type HeaderSettingsComponentProps = {
  settings?: HeaderSettings;
  onEdit: (settings: HeaderSettings) => void;
};
const HeaderSettingsComponent = ({
  settings = { margin: 0, color: '#000', level: 2 },
  onEdit,
}: HeaderSettingsComponentProps) => {
  return (
    <>
      <SettingsComponentCallout data={settings} onEdit={onEdit}>
        {({ level }, changeSetting) => (
          <>
            <NumberInput
              inputClass="w-[4rem] ml-1"
              value={level}
              onChange={(value) =>
                changeSetting('level', value as HeaderLevels)
              }
              min={1}
              max={6}
              include={Label}
              label="Level"
              sameLine
            />
          </>
        )}
      </SettingsComponentCallout>
    </>
  );
};
