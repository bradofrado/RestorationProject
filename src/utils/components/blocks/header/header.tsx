import { setStyleFromSettings } from '~/utils/utils';
import Header, { HeaderLevelsSchema, HeaderProps } from '../../base/header';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { DataComponent } from '../utils/types';
import { z } from 'zod';
import { FC } from 'react';
import { AnnotationMarkdown } from '../annotation/annotation-markdown';

export const HeaderSettingsSchema = SettingsComponentSettingsSchema.extend({
  level: HeaderLevelsSchema,
});
export type HeaderSettings = z.infer<typeof HeaderSettingsSchema>;

export const HeaderBlock: FC<DataComponent & HeaderProps> = ({
  data,
  ...rest
}) => {
  const settings = useParseSettings(data.properties, HeaderSettingsSchema, {
    level: 2,
  });
  return (
    <Header
      className="py-2"
      level={settings.level}
      key={data?.content}
      style={setStyleFromSettings(settings)}
      {...rest}
    >
      {data?.content ? <AnnotationMarkdown text={data?.content} /> : 'Text'}
    </Header>
  );
};
