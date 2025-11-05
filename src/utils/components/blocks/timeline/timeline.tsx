'use client';

import { HexColorSchema } from '~/utils/types/colors';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { type DataComponent } from '../utils/types';
import { useGetCategory } from '~/utils/services/TimelineService';
import { useParseSettings } from '../utils/parse-settings';
import { Placeholder } from '../utils/placeholder';
import { setStyleFromSettings } from '~/utils/utils';
import CondensedTimeline from '../../Timeline/CondensedTimeline';
import { type FC } from 'react';
import z from 'zod';

export const timelineBlockSettingsSchema =
  SettingsComponentSettingsSchema.extend({
    dotColor: HexColorSchema,
    timelineItemIds: z.optional(z.array(z.number())),
  });
export const TimelineBlock: FC<DataComponent> = ({ data, className }) => {
  const settings = useParseSettings(
    data.properties,
    timelineBlockSettingsSchema,
    { dotColor: '#ad643a' }
  );
  const query = useGetCategory(Number(data?.content));

  if (query.isLoading || query.isError) {
    return <Placeholder>Pick Timeline items</Placeholder>;
  }

  const items = query.data.items.filter((item) =>
    settings.timelineItemIds ? settings.timelineItemIds.includes(item.id) : true
  );

  return (
    <div style={setStyleFromSettings(settings)}>
      <CondensedTimeline
        items={items}
        className={className}
        color={settings.dotColor}
      />
    </div>
  );
};
