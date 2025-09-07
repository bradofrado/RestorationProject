import {
  createContext,
  useContext,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import { type Annotation, annotationSchema } from '~/utils/types/annotation';
import { jsonParse } from '~/utils/utils';

const AnnotationLinkContext = createContext<{
  annotationLinks: Annotation[];
  updateAnnotationLink: (link: Annotation) => number;
}>({ annotationLinks: [], updateAnnotationLink: () => 0 });

type AnnotationProviderProps = PropsWithChildren;

export const AnnotationLinkProvider = ({
  children,
}: AnnotationProviderProps) => {
  const annotationLinksRef = useRef<Record<string, number>>({});
  const [rerender, setRerender] = useState(0);

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
      setRerender((prev) => prev + 1);

      return nextVal;
    },
    [annotationLinksRef]
  );

  const sortedAnnotationLinks = useMemo(() => {
    return Object.entries(annotationLinksRef.current).reduce<Annotation[]>(
      (prev, [link, number]) => {
        const annotation = jsonParse(annotationSchema).parse(link);
        prev.splice(number, 0, annotation);
        return prev;
      },
      []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotationLinksRef, rerender]);

  return (
    <AnnotationLinkContext.Provider
      value={{ annotationLinks: sortedAnnotationLinks, updateAnnotationLink }}
    >
      {children}
    </AnnotationLinkContext.Provider>
  );
};

export const useAnnotationLink = () => {
  const { annotationLinks, updateAnnotationLink } = useContext(
    AnnotationLinkContext
  );

  return {
    annotate: updateAnnotationLink,
    annotationLinks,
  };
};
