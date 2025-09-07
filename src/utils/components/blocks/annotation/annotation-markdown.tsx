import { type FC, Fragment, type ReactNode, useMemo } from 'react';
import { inlineAnnotationRegex } from './constants';
import { useAnnotationLink } from '../../event-page/annotation-provider';
import { useAnnotationComponent } from './annotation-component-provider';
import { decode } from 'entities';
import { jsonParse } from '~/utils/utils';
import {
  annotationSchema,
  type Annotation as AnnotationType,
} from '~/utils/types/annotation';

interface AnnotationMarkdownProps {
  text: string;
}

export const AnnotationMarkdown: FC<AnnotationMarkdownProps> = ({ text }) => {
  const { annotate } = useAnnotationLink();
  const { Annotation } = useAnnotationComponent();

  const content = useMemo(() => {
    const nodes = text.replaceWith<ReactNode>(
      inlineAnnotationRegex,
      (match, index) => {
        const result = jsonParse(annotationSchema).safeParse(match[1] || '');
        const annotation: AnnotationType = result.success
          ? result.data
          : { link: match[1] || '' };
        return (
          <Annotation
            key={index}
            link={annotation}
            linkNumber={annotate(annotation)}
            id={String(index)}
          />
        );
      }
    );

    // The text shows up in the db as "&amp;", so we need to decode it
    return nodes.map((c) => (typeof c === 'string' ? decode(c) : c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, annotate]);

  return <Fragment>{content}</Fragment>;
};
