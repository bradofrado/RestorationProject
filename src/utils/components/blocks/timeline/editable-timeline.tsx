import { FC, useMemo } from 'react';
import { EditableDataComponent } from '../utils/types';
import { useGetCategories } from '~/utils/services/TimelineService';
import { useParseSettings } from '../utils/parse-settings';
import { TimelineBlock, timelineBlockSettingsSchema } from './timeline';
import { ButtonIcon } from '../../edit/editable';
import { DropdownIcon, DropdownItem } from '../../base/dropdown';
import { PopoverIcon } from '../../base/popover';
import { AdjustIcon, EditIcon } from '../../icons/icons';
import { SettingsComponentCallout } from '../utils/settings-callout';
import Label from '../../base/label';
import ColorPicker from '../../base/color-picker';
import { defaultColors } from '../utils/default-colors';
import { EditableComponentContainer } from '../utils/editable-component-container';

export const EditableTimelineBlock: FC<EditableDataComponent> = ({
  onDelete,
  onEdit,
  data,
  ...rest
}) => {
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
            </>
          )}
        </SettingsComponentCallout>
      </PopoverIcon>,
    ];
  }, [query.data, settings, onEdit, data.properties, data.content]);

  if (query.isLoading || query.isError) {
    return <></>;
  }

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
    </>
  );
};
