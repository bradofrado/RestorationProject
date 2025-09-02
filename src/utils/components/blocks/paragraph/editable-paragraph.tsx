import { PopoverIcon } from '../../base/popover';
import { ButtonIcon, EditableComponent } from '../../edit/editable';
import { AdjustIcon } from '../../icons/icons';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentCallout } from '../utils/settings-callout';
import {
  SettingsComponentSettings,
  SettingsComponentSettingsSchema,
} from '../utils/settings-component';
import { EditableDataComponent } from '../utils/types';
import { EditableComponentContainer } from '../utils/editable-component-container';
import { ParagraphBlock } from './paragraph';
import { FC } from 'react';
import { AnnotationComponentProvider } from '../annotation/annotation-component-provider';

export const EditableParagraphBlock: FC<EditableDataComponent> = ({
  onEdit,
  data,
  ...rest
}) => {
  const settings = useParseSettings(
    data.properties,
    SettingsComponentSettingsSchema,
    {}
  );

  const icons: ButtonIcon[] = [
    <PopoverIcon icon={AdjustIcon} key={0}>
      <ParagraphSettingsCallout
        data={settings}
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
      onChange={(value) =>
        onEdit({ content: value, properties: data.properties })
      }
    >
      {({ onBlur }) => (
        <EditableComponentContainer
          as={ParagraphBlock}
          role="paragraph"
          data={data}
          icons={icons}
          onBlur={onBlur}
          {...rest}
        />
      )}
    </AnnotationComponentProvider>
  );
};

const ParagraphSettingsCallout: EditableComponent<
  SettingsComponentSettings
> = ({ data, onEdit }) => {
  return (
    <>
      <SettingsComponentCallout data={data} onEdit={onEdit} />
    </>
  );
};
