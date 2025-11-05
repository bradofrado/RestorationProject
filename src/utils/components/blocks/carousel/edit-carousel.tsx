'use client';

import { type FC, useState } from 'react';
import { type EditableDataComponent } from '../utils/types';
import { EditableComponentContainer } from '../utils/editable-component-container';
import {
  CarouselBlock,
  type CarouselSettings,
  carouselSettingsSchema,
} from './carousel';
import { AdjustIcon, EditIcon } from '../../icons/icons';
import { type ButtonIcon } from '../../edit/editable';
import { useParseSettings } from '../utils/parse-settings';
import { ImageUploadModal } from '../image/image-upload-modal';
import { type EditableData } from '~/utils/types/page';
import { PopoverIcon } from '../../base/popover';
import { SettingsComponentCallout } from '../utils/settings-callout';
import Label from '../../base/label';
import { NumberInput } from '../../base/input';

export const EditableCarouselBlock: FC<EditableDataComponent> = ({
  onEdit,
  data,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useParseSettings(data.properties, carouselSettingsSchema, {
    images: [],
    height: 200,
    margin: 0,
    color: '#000',
  });

  const onConfirm = ({ properties }: EditableData) => {
    const imageSettings = properties
      ? (JSON.parse(properties) as CarouselSettings['images'])
      : [];

    onEdit({
      content: data.content,
      properties: JSON.stringify({
        ...settings,
        images: imageSettings.map((image) => ({
          url: image.url,
          alt: 'Image',
        })),
      }),
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
      <SettingsComponentCallout
        data={settings}
        onEdit={(settings) =>
          onEdit({
            content: data.content,
            properties: JSON.stringify(settings),
          })
        }
      >
        {({ height }, changeSetting) => (
          <>
            <Label label="Height" sameLine>
              <NumberInput
                inputClass="w-[4rem]"
                value={height}
                onChange={(value) => changeSetting('height', value)}
                min={0}
              />
            </Label>
          </>
        )}
      </SettingsComponentCallout>
    </PopoverIcon>,
  ];
  return (
    <>
      <EditableComponentContainer
        as={CarouselBlock}
        data={data}
        icons={icons}
        {...rest}
      />

      <ImageUploadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirm}
        multiple
      />
    </>
  );
};
