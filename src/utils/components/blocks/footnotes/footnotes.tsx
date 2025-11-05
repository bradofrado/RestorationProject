'use client';

import { type FC } from 'react';
import { type DataComponent } from '../utils/types';
import { useAnnotationLink } from '../../event-page/annotation-provider';
import Header, { HeaderLevelsSchema } from '../../base/header';
import { jsonParse, setStyleFromSettings } from '~/utils/utils';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import z from 'zod';
import { type Annotation, annotationSchema } from '~/utils/types/annotation';

export const footnotesSettingsSchema = SettingsComponentSettingsSchema.extend({
  title: z.string().default('Footnotes'),
  headerLevel: HeaderLevelsSchema.default(2),
});

export const FootnotesBlock: FC<DataComponent> = ({ data }) => {
  const { annotationLinksRef } = useAnnotationLink();
  const annotationLinks = Object.entries(
    annotationLinksRef.current || {}
  ).reduce<Annotation[]>((prev, [link, number]) => {
    const annotation = jsonParse(annotationSchema).parse(link);
    prev.splice(number, 0, annotation);
    return prev;
  }, []);

  const settings = useParseSettings(data.properties, footnotesSettingsSchema, {
    title: 'Footnotes',
    headerLevel: 2,
  });
  return (
    <div style={setStyleFromSettings(settings)}>
      <Header level={settings.headerLevel}>{settings.title}</Header>
      <ol className="list-decimal">
        {annotationLinks.map(({ link, note }) => (
          <li key={link}>
            {note ? (
              <span>
                {note} (
                <a
                  className="text-blue-500 underline"
                  href={link}
                  target="_blank"
                >
                  link
                </a>
                )
              </span>
            ) : (
              <a
                className="text-blue-500 underline"
                href={link}
                target="_blank"
              >
                {link}
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
