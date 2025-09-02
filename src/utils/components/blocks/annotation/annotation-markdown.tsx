import { FC, Fragment, ReactNode, useMemo } from 'react';
import { inlineAnnotationRegex } from './constants';
import { useAnnotationLink } from '../../event-page/annotation-provider';
import { useAnnotationComponent } from './annotation-component-provider';

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

    return nodes;
  }, [text, annotate]);

  return <Fragment>{content}</Fragment>;
};
