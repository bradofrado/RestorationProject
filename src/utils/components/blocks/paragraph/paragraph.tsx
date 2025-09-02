import { setStyleFromSettings } from '~/utils/utils';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { DataComponent } from '../utils/types';
import { PropsOf } from '~/utils/types/polymorphic';
import { FC } from 'react';
import { AnnotationMarkdown } from '../annotation/annotation-markdown';

export const ParagraphBlock: FC<DataComponent & PropsOf<'p'>> = ({
  data,
  ...rest
}) => {
  const settings = useParseSettings(
    data.properties,
    SettingsComponentSettingsSchema,
    {}
  );

  return (
    <>
      <p
        key={data.content}
        className="py-2"
        style={setStyleFromSettings(settings)}
        {...rest}
      >
        {data.content ? <AnnotationMarkdown text={data.content} /> : 'Text'}
      </p>
    </>
  );
};
