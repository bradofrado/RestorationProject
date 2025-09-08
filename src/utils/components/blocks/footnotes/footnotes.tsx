import { FC } from 'react';
import { DataComponent } from '../utils/types';
import { useAnnotationLink } from '../../event-page/annotation-provider';
import Header, { HeaderLevelsSchema } from '../../base/header';
import { setStyleFromSettings } from '~/utils/utils';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import z from 'zod';

export const footnotesSettingsSchema = SettingsComponentSettingsSchema.extend({
  title: z.string().default('Footnotes'),
  headerLevel: HeaderLevelsSchema.default(2),
});

export const FootnotesBlock: FC<DataComponent> = ({ data }) => {
  const { annotationLinks } = useAnnotationLink();
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
