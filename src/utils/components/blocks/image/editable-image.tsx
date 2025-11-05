'use client';

import { type FC, useState } from 'react';
import { ImageBlock, type ImageSettings, imageSettingsSchema } from './image';
import { type EditableDataComponent } from '../utils/types';
import { EditableComponentContainer } from '../utils/editable-component-container';
import { type ButtonIcon } from '../../edit/editable';
import { SettingsComponentCallout } from '../utils/settings-callout';
import Input, { NumberInput } from '../../base/input';
import Label from '../../base/label';
import { PopoverIcon } from '../../base/popover';
import { AdjustIcon, EditIcon } from '../../icons/icons';
import { useParseSettings } from '../utils/parse-settings';
import { ImageUploadModal } from './image-upload-modal';
import { type EditableData } from '~/utils/types/page';

export const EditableImageBlock: FC<EditableDataComponent> = ({
  onEdit,
  data,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useParseSettings(data.properties, imageSettingsSchema, {
    alt: 'Image',
    height: 200,
  });

  const onConfirm = (data: EditableData) => {
    onEdit({
      content: data.content,
      properties: JSON.stringify(settings),
    });
    setIsOpen(false);
  };

  const icons: ButtonIcon[] = [
    {
      icon: EditIcon,
      handler() {
        setIsOpen(true);
      },
    },
    <PopoverIcon icon={AdjustIcon} key={1}>
      <ImageSettingsComponent
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
    <>
      <EditableComponentContainer
        as={ImageBlock}
        data={data}
        icons={icons}
        {...rest}
      />
      <ImageUploadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirm}
      />
    </>
  );
};

type ImageSettingsComponentProps = {
  settings?: ImageSettings;
  onEdit: (settings: ImageSettings) => void;
};
const ImageSettingsComponent = ({
  settings = { margin: 0, color: '#000', alt: 'Image', height: 200 },
  onEdit,
}: ImageSettingsComponentProps) => {
  return (
    <>
      <SettingsComponentCallout data={settings} onEdit={onEdit}>
        {({ alt, height }, changeSetting) => (
          <>
            <Label label="Height" sameLine>
              <NumberInput
                inputClass="w-[4rem]"
                value={height}
                onChange={(value) => changeSetting('height', value)}
                min={0}
              />
            </Label>
            <Input
              inputClass="w-[7rem]"
              include={Label}
              label="Alt"
              value={alt}
              onChange={(value) => changeSetting('alt', value)}
            />
          </>
        )}
      </SettingsComponentCallout>
    </>
  );
};
