import { FC } from 'react';
import { DataComponent } from '../utils/types';
import { Quote } from '../../event-page/display-list';
import z from 'zod';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { useParseSettings } from '../utils/parse-settings';
import { setStyleFromSettings } from '~/utils/utils';

export const quoteBlockSettingsSchema = SettingsComponentSettingsSchema.extend({
  quote: z.string(),
  reference: z.string().nullable(),
  links: z.array(z.string()),
});

export const QuoteBlock: FC<DataComponent> = ({ data }) => {
  const settings = useParseSettings(data.properties, quoteBlockSettingsSchema, {
    quote: '',
    reference: null,
    links: [],
  });

  return (
    <Quote
      as="div"
      style={setStyleFromSettings(settings)}
      item={{
        text: data.content || '',
        subText: <span className="font-medium">- {settings.reference}</span>,
        links: settings.links,
      }}
    />
  );
};
