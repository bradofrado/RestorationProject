import z from 'zod';
import { ContentEditableBlur } from '../utils/types';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { DataComponent } from '../utils/types';
import { useGetCategories } from '~/utils/services/TimelineService';
import { useParseSettings } from '../utils/parse-settings';
import { FC } from 'react';
import { setStyleFromSettings } from '~/utils/utils';
import { Placeholder } from '../utils/placeholder';
import {
  DataGroupbyList,
  DisplayList,
  DisplayListItem,
  RestorationQuote,
} from '../../event-page/display-list';
import { RestorationTimelineItem } from '~/utils/types/timeline';

interface DataListProps extends DataComponent, ContentEditableBlur {}

export const listSettingsSchema = SettingsComponentSettingsSchema.extend({
  group: z.boolean(),
  items: z.array(z.string()),
});
export const ListBlock: FC<DataListProps> = ({ data, ...rest }) => {
  const query = useGetCategories();
  const settings = useParseSettings(data.properties, listSettingsSchema, {
    group: false,
    items: [],
  });
  if (query.isLoading || query.isError) {
    return <></>;
  }

  const style = setStyleFromSettings(settings);

  if (data.content == 'custom' && !settings.items.length) {
    return (
      <div style={style}>
        <Placeholder>List is empty</Placeholder>
      </div>
    );
  }
  if (data.content == 'custom') {
    const items = settings.items;
    return (
      <div style={style}>
        <DisplayList
          items={items.map((x) => ({ text: x }))}
          ListComponent={DisplayListItem}
          {...rest}
        />
      </div>
    );
  }

  const items: RestorationTimelineItem[] =
    query.data.find((x) => x.id == Number(data.content))?.items || [];

  if (items.length === 0) {
    return (
      <div style={style}>
        <Placeholder>List is empty</Placeholder>
      </div>
    );
  }

  if (settings.group) {
    return (
      <div style={style}>
        <DataGroupbyList
          items={items}
          ListComponent={RestorationQuote}
          groupByKey="subcategory"
          {...rest}
        />
      </div>
    );
  }

  return (
    <div style={style}>
      <DisplayList items={items} ListComponent={RestorationQuote} {...rest} />
    </div>
  );
};
