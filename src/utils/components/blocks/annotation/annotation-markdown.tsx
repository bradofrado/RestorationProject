'use client';

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
import { type AnnotationProps } from '../../Timeline/annotation';

interface AnnotationMarkdownProps {
  text: string;
}

interface MarkdownNode {
  regex: RegExp;
  Replacement: (match: RegExpMatchArray, index: number) => ReactNode;
}

const createMarkdownNodes = (
  Annotation: FC<AnnotationProps>,
  annotate: (annotation: AnnotationType) => number
): MarkdownNode[] => [
  {
    regex: inlineAnnotationRegex,
    Replacement: (match, index) => {
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
    },
  },
  {
    regex: /<b>(.*?)<\/b>/g,
    Replacement: (match, index) => <b key={index}>{match[1]}</b>,
  },
];

export const AnnotationMarkdown: FC<AnnotationMarkdownProps> = ({ text }) => {
  const { annotate } = useAnnotationLink();
  const { Annotation } = useAnnotationComponent();

  const content = useMemo(() => {
    const markdownNodes = createMarkdownNodes(Annotation, annotate);
    const nodes = markdownNodes.reduce<ReactNode[]>(
      (acc, node) => {
        return acc.flatMap((a) =>
          typeof a === 'string'
            ? a.replaceWith(node.regex, node.Replacement)
            : a
        );
      },
      [text]
    );

    // The text shows up in the db as "&amp;", so we need to decode it
    return nodes.map((c) => (typeof c === 'string' ? decode(c) : c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, annotate]);

  return <Fragment>{content}</Fragment>;
};
