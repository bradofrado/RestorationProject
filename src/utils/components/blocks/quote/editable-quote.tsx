import { type FC, useMemo } from 'react';
import { type EditableDataComponent } from '../utils/types';
import { EditableComponentContainer } from '../utils/editable-component-container';
import { QuoteBlock, quoteBlockSettingsSchema } from './quote';
import { type ButtonIcon } from '../../edit/editable';
import { PopoverIcon } from '../../base/popover';
import Input, { CheckboxInput } from '../../base/input';
import { AdjustIcon, EditIcon } from '../../icons/icons';
import Label from '../../base/label';
import { useParseSettings } from '../utils/parse-settings';
import { AnnotationList } from '../../edit/annotation-list';
import { SettingsComponentCallout } from '../utils/settings-callout';

export const EditableQuoteBlock: FC<EditableDataComponent> = ({
  data,
  onEdit,
  ...rest
}) => {
  const settings = useParseSettings(data.properties, quoteBlockSettingsSchema, {
    quote: '',
    reference: null,
    links: [],
  });
  const onAddLink = () => {
    onEdit({
      ...data,
      properties: JSON.stringify({
        ...settings,
        links: [...settings.links, 'new link'],
      }),
    });
  };
  const onReorder = (links: string[]) => {
    onEdit({ ...data, properties: JSON.stringify({ ...settings, links }) });
  };
  const onDelete = (index: number) => {
    onEdit({
      ...data,
      properties: JSON.stringify({
        ...settings,
        links: settings.links.filter((_, i) => i !== index),
      }),
    });
  };
  const onChange = (link: string, index: number) => {
    onEdit({
      ...data,
      properties: JSON.stringify({
        ...settings,
        links: settings.links.map((l, i) => (i === index ? link : l)),
      }),
    });
  };
  const icons: ButtonIcon[] = useMemo(
    () => [
      <PopoverIcon icon={EditIcon} key={0}>
        <Input
          include={Label}
          label="Quote"
          value={data.content}
          onChange={(value) => onEdit({ ...data, content: value })}
        />
        <Input
          include={Label}
          label="Reference"
          value={settings.reference || ''}
          onChange={(value) =>
            onEdit({
              ...data,
              properties: JSON.stringify({ ...settings, reference: value }),
            })
          }
        />
        <Label label="Is Verse" sameLine>
          <CheckboxInput
            value={settings.isVerse ?? false}
            onChange={(value) =>
              onEdit({
                ...data,
                properties: JSON.stringify({ ...settings, isVerse: value }),
              })
            }
          />
        </Label>
        <Label label="Links">
          <AnnotationList
            links={settings.links}
            onAdd={onAddLink}
            onReorder={onReorder}
            onDelete={onDelete}
            onChange={onChange}
            id={`links-${data.content}`}
          />
        </Label>
      </PopoverIcon>,
      <PopoverIcon icon={AdjustIcon} key={0}>
        <SettingsComponentCallout
          data={settings}
          onEdit={(settings) =>
            onEdit({ ...data, properties: JSON.stringify(settings) })
          }
        />
      </PopoverIcon>,
    ],
    [data, settings]
  );
  return (
    <EditableComponentContainer
      as={QuoteBlock}
      data={data}
      {...rest}
      icons={icons}
    />
  );
};
