'use client';

import { useMemo, type FC } from 'react';
import { type DataComponent } from '../utils/types';
import { Quote } from '../../event-page/display-list';
import z from 'zod';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { useParseSettings } from '../utils/parse-settings';
import { setStyleFromSettings } from '~/utils/utils';
import { Annotation } from '../../Timeline/annotation';
import { useAnnotationLink } from '../../event-page/annotation-provider';
import { annotationLinkSchema } from '../annotation/constants';
import { AnnotationMarkdown } from '../annotation/annotation-markdown';

export const quoteBlockSettingsSchema = SettingsComponentSettingsSchema.extend({
  quote: z.string(),
  reference: z.string().nullable(),
  links: z.array(annotationLinkSchema),
  isVerse: z.optional(z.boolean()).default(false),
});

export const QuoteBlock: FC<DataComponent> = ({ data }) => {
  const { annotate } = useAnnotationLink();
  const settings = useParseSettings(data.properties, quoteBlockSettingsSchema, {
    quote: '',
    reference: null,
    links: [],
  });

  const verses = useMemo(() => {
    if (!data.content) return [];
    // Split at every number, keeping the number at the start of each split
    // e.g. "1In the beginning2God created" => ["1In the beginning", "2God created"]
    // Use a regex to split at each number, but keep the number
    const parts = data.content.split(/(?=\b\d+)/g).filter(Boolean);
    return parts;
  }, [data.content]);

  if (settings.isVerse) {
    return (
      <p className="mx-5 py-2" style={setStyleFromSettings(settings)}>
        {verses.map((verse, i) => (
          <div className="my-1 italic" key={i}>
            <AnnotationMarkdown text={verse} />
          </div>
        ))}
        <span className="font-medium">- {settings.reference}</span>
        <span>
          {settings.links.map((link, i) => (
            <Annotation link={link} key={i} linkNumber={annotate(link)} />
          ))}
        </span>
      </p>
    );
  }

  return (
    <Quote
      as="p"
      className="mx-5 py-2"
      style={setStyleFromSettings(settings)}
      item={{
        text: data.content || '',
        subText: <span className="font-medium">- {settings.reference}</span>,
        links: settings.links,
      }}
    />
  );
};
