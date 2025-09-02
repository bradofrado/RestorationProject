import { setStyleFromSettings } from '~/utils/utils';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { DataComponent } from '../utils/types';
import { PropsOf } from '~/utils/types/polymorphic';
import { FC, ReactNode, useMemo } from 'react';
import {
  useAnnotationComponent,
  useAnnotationLink,
} from '../../event-page/annotation-provider';

export const inlineAnnotationRegex = /\[([^\[\]]*)\]/g;

export const ParagraphBlock: FC<DataComponent & PropsOf<'p'>> = ({
  data,
  ...rest
}) => {
  const { annotate } = useAnnotationLink();
  const { Annotation } = useAnnotationComponent();
  const settings = useParseSettings(
    data.properties,
    SettingsComponentSettingsSchema,
    {}
  );

  const content = useMemo(() => {
    const nodes = data.content.replaceWith<ReactNode>(
      inlineAnnotationRegex,
      (match, index) => (
        <Annotation
          link={match[1] || ''}
          linkNumber={annotate(match[1] || '')}
          id={String(index)}
        />
      )
    );

    return nodes;
  }, [data.content]);

  return (
    <>
      <p
        key={data.content}
        className="py-2"
        style={setStyleFromSettings(settings)}
        {...rest}
      >
        {content || 'Text'}
      </p>
    </>
  );
};
