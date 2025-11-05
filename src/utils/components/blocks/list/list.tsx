'use client';

import z from 'zod';
import { type ContentEditableBlur } from '../utils/types';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { type DataComponent } from '../utils/types';
import { useGetCategory } from '~/utils/services/TimelineService';
import { useParseSettings } from '../utils/parse-settings';
import { type FC } from 'react';
import { setStyleFromSettings } from '~/utils/utils';
import { Placeholder } from '../utils/placeholder';
import {
  DataGroupbyList,
  DisplayList,
  DisplayListItem,
  RestorationQuote,
} from '../../event-page/display-list';

interface DataListProps extends DataComponent, ContentEditableBlur {}

export const listSettingsSchema = SettingsComponentSettingsSchema.extend({
  group: z.boolean(),
  items: z.array(z.string()),
  timelineItemIds: z.optional(z.array(z.number())),
});
export const ListBlock: FC<DataListProps> = ({ data, ...rest }) => {
  const query = useGetCategory(Number(data.content));
  const settings = useParseSettings(data.properties, listSettingsSchema, {
    group: false,
    items: [],
  });

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

  if (query.isLoading || query.isError) {
    return <></>;
  }

  const items = query.data.items.filter((item) =>
    settings.timelineItemIds ? settings.timelineItemIds.includes(item.id) : true
  );

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
