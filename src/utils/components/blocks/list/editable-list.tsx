import { FC, useMemo } from 'react';
import { EditableDataComponent } from '../utils/types';
import { useGetCategories } from '~/utils/services/TimelineService';
import { useParseSettings } from '../utils/parse-settings';
import { ListBlock, listSettingsSchema } from './list';
import { useChangeProperty } from '~/utils/utils';
import { DropdownIcon, DropdownItem } from '../../base/dropdown';
import { TimelineCategoryName } from '~/utils/types/timeline';
import { ButtonIcon } from '../../edit/editable';
import { AddIcon, AdjustIcon, EditIcon } from '../../icons/icons';
import { PopoverIcon } from '../../base/popover';
import { SettingsComponentCallout } from '../utils/settings-callout';
import Label from '../../base/label';
import { CheckboxInput } from '../../base/input';
import { EditableComponentContainer } from '../utils/editable-component-container';
import { useEffectEvent } from '../../hooks/effect-event';

export const EditableListBlock: FC<EditableDataComponent> = ({
  onEdit,
  data,
  ...rest
}) => {
  const query = useGetCategories();
  const settings = useParseSettings(data.properties, listSettingsSchema, {
    group: false,
    items: [],
  });
  const changeProperty = useChangeProperty<typeof settings>((settings) =>
    onEdit({ content: data.content, properties: JSON.stringify(settings) })
  );

  const type: TimelineCategoryName = data != null ? data.content : 'custom';
  const dropdownItems: DropdownItem<string>[] = useMemo(
    () =>
      [
        {
          name: 'Custom',
          id: 'custom',
        },
      ].concat(
        query.data?.map((x) => ({ id: String(x.id), name: x.name })) || []
      ),
    [query.data]
  );

  const editIcons: ButtonIcon[] = useMemo(() => {
    const icons: ButtonIcon[] = [
      <DropdownIcon
        items={dropdownItems}
        icon={EditIcon}
        key={1}
        onChange={(item) =>
          onEdit({ content: item.id, properties: data?.properties || null })
        }
      />,
    ];

    icons.push(
      <PopoverIcon icon={AdjustIcon}>
        <SettingsComponentCallout
          data={settings}
          onEdit={changeProperty.function}
        >
          {({ group }, changeSettings) => (
            <>
              {data.content != 'custom' && (
                <Label label="Group" sameLine>
                  <CheckboxInput
                    value={group}
                    onChange={(value) => changeSettings('group', value)}
                  />
                </Label>
              )}
            </>
          )}
        </SettingsComponentCallout>
      </PopoverIcon>
    );
    if (type == 'custom') {
      icons.push({
        icon: AddIcon,
        handler: () =>
          changeProperty(settings, 'items', settings.items.concat('Text')),
      });
    }

    return icons;
  }, [
    dropdownItems,
    settings,
    changeProperty,
    type,
    onEdit,
    data?.properties,
    data.content,
  ]);

  const editLiItem = useEffectEvent((value: string, index: number) => {
    const vals = [...settings.items];
    vals[index] = value;
    changeProperty(settings, 'items', vals);
  });

  if (query.isLoading || query.isError) {
    return <></>;
  }

  return (
    <>
      <EditableComponentContainer
        as={ListBlock}
        icons={editIcons}
        data={data}
        onBlur={editLiItem}
        {...rest}
      />
    </>
  );
};
