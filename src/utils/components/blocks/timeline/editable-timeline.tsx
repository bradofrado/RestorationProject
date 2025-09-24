import { type FC, useMemo, useState } from 'react';
import { type EditableDataComponent } from '../utils/types';
import { useGetCategories } from '~/utils/services/TimelineService';
import { useParseSettings } from '../utils/parse-settings';
import { TimelineBlock, timelineBlockSettingsSchema } from './timeline';
import { type ButtonIcon } from '../../edit/editable';
import { DropdownIcon, type DropdownItem } from '../../base/dropdown';
import { PopoverIcon } from '../../base/popover';
import { AdjustIcon, EditIcon } from '../../icons/icons';
import { SettingsComponentCallout } from '../utils/settings-callout';
import Label from '../../base/label';
import ColorPicker from '../../base/color-picker';
import { defaultColors } from '../utils/default-colors';
import { EditableComponentContainer } from '../utils/editable-component-container';
import { SelectTimelineItemsModal } from './select-items-modal';
import Button from '../../base/buttons/button';

export const EditableTimelineBlock: FC<EditableDataComponent> = ({
  onDelete,
  onEdit,
  data,
  ...rest
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const query = useGetCategories();
  const settings = useParseSettings(
    data.properties,
    timelineBlockSettingsSchema,
    { dotColor: '#ad643a' }
  );

  const icons: ButtonIcon[] = useMemo(() => {
    const dropdownItems: DropdownItem<string>[] =
      query.data?.map((x) => ({
        id: String(x.id),
        name: x.name,
      })) ?? [];
    return [
      <DropdownIcon
        onChange={(item) =>
          onEdit({ content: item.id, properties: data.properties })
        }
        key={1}
        items={dropdownItems}
        icon={EditIcon}
      />,
      <PopoverIcon icon={AdjustIcon} key={0}>
        <SettingsComponentCallout
          data={settings}
          onEdit={(settings) =>
            onEdit({
              content: data.content,
              properties: JSON.stringify(settings),
            })
          }
        >
          {({ dotColor: color }, changeSetting) => (
            <>
              <Label label="Dot Color" sameLine>
                <ColorPicker
                  className="m-auto"
                  value={color}
                  onChange={(value) => changeSetting('dotColor', value)}
                  defaultColors={defaultColors}
                />
              </Label>
              <Button onClick={() => setIsModalOpen(true)} mode="secondary">
                Edit Items
              </Button>
            </>
          )}
        </SettingsComponentCallout>
      </PopoverIcon>,
    ];
  }, [query.data, settings, onEdit, data.properties, data.content]);

  const onEditTimeline = (items: number[]) => {
    onEdit({
      content: data.content,
      properties: JSON.stringify({ ...settings, timelineItemIds: items }),
    });
    setIsModalOpen(false);
  };

  if (query.isLoading || query.isError) {
    return <></>;
  }

  const category = query.data?.find((x) => x.id === Number(data.content));
  const selectedItems =
    settings.timelineItemIds ?? category?.items.map((x) => x.id) ?? [];

  return (
    <>
      <EditableComponentContainer
        as={TimelineBlock}
        data={data}
        onDelete={onDelete}
        {...rest}
        icons={icons}
      >
        Text
      </EditableComponentContainer>
      <SelectTimelineItemsModal
        key={selectedItems.join(',')}
        selectedItems={selectedItems}
        categoryId={Number(data.content)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onEditTimeline}
      />
    </>
  );
};
