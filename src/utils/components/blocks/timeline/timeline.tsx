import { HexColorSchema } from '~/utils/types/colors';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { DataComponent } from '../utils/types';
import { useGetCategory } from '~/utils/services/TimelineService';
import { useParseSettings } from '../utils/parse-settings';
import { Placeholder } from '../utils/placeholder';
import { setStyleFromSettings } from '~/utils/utils';
import CondensedTimeline from '../../Timeline/CondensedTimeline';
import { FC } from 'react';

export const timelineBlockSettingsSchema =
  SettingsComponentSettingsSchema.extend({
    dotColor: HexColorSchema,
  });
export const TimelineBlock: FC<DataComponent> = ({
  data,
  className,
  ...rest
}) => {
  const query = useGetCategory(Number(data?.content));
  const settings = useParseSettings(
    data.properties,
    timelineBlockSettingsSchema,
    { dotColor: '#ad643a' }
  );
  if (query.isLoading || query.isError) {
    return <Placeholder>Pick Timeline items</Placeholder>;
  }

  const items = query.data.items;

  return (
    <div style={setStyleFromSettings(settings)}>
      <CondensedTimeline
        items={items}
        className={className}
        color={settings.dotColor}
        {...rest}
      />
    </div>
  );
};
