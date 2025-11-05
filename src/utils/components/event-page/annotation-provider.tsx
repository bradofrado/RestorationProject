'use client';

import {
  createContext,
  useContext,
  type PropsWithChildren,
  useCallback,
  useRef,
  type RefObject,
} from 'react';
import { type Annotation } from '~/utils/types/annotation';

const AnnotationLinkContext = createContext<{
  annotationLinksRef: RefObject<Record<string, number>>;
  updateAnnotationLink: (link: Annotation) => number;
}>({ annotationLinksRef: { current: {} }, updateAnnotationLink: () => 0 });

type AnnotationProviderProps = PropsWithChildren;

export const AnnotationLinkProvider = ({
  children,
}: AnnotationProviderProps) => {
  const annotationLinksRef = useRef<Record<string, number>>({});

  const updateAnnotationLink = useCallback(
    (annotation: Annotation) => {
      const max = (vals: number[]) => {
        const sorted = vals.slice().sort((a, b) => b - a);
        return sorted[0] || 0;
      };

      const link = JSON.stringify(annotation);

      if (annotationLinksRef.current[link]) {
        return annotationLinksRef.current[link];
      }

      const nextVal: number =
        max(Object.values(annotationLinksRef.current)) + 1;
      annotationLinksRef.current[link] = nextVal;

      return nextVal;
    },
    [annotationLinksRef]
  );

  return (
    <AnnotationLinkContext.Provider
      value={{ annotationLinksRef, updateAnnotationLink }}
    >
      {children}
    </AnnotationLinkContext.Provider>
  );
};

export const useAnnotationLink = () => {
  const { annotationLinksRef, updateAnnotationLink } = useContext(
    AnnotationLinkContext
  );

  return {
    annotate: updateAnnotationLink,
    annotationLinksRef,
  };
};
