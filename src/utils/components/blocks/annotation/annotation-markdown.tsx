import { type FC, Fragment, type ReactNode, useMemo } from 'react';
import { inlineAnnotationRegex } from './constants';
import { useAnnotationLink } from '../../event-page/annotation-provider';
import { useAnnotationComponent } from './annotation-component-provider';
import { decode } from 'entities';

interface AnnotationMarkdownProps {
  text: string;
}

export const AnnotationMarkdown: FC<AnnotationMarkdownProps> = ({ text }) => {
  const { annotate } = useAnnotationLink();
  const { Annotation } = useAnnotationComponent();

  const content = useMemo(() => {
    const nodes = text.replaceWith<ReactNode>(
      inlineAnnotationRegex,
      (match, index) => (
        <Annotation
          key={index}
          link={match[1] || ''}
          linkNumber={annotate(match[1] || '')}
          id={String(index)}
        />
      )
    );

    // The text shows up in the db as "&amp;", so we need to decode it
    return nodes.map((c) => (typeof c === 'string' ? decode(c) : c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, annotate]);

  return <Fragment>{content}</Fragment>;
};
