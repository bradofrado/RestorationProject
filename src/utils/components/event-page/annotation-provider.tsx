import {
  createContext,
  useContext,
  type PropsWithChildren,
  useCallback,
} from 'react';

const AnnotationLinkContext = createContext<{
  annotationLinks: Record<string, number>;
}>({ annotationLinks: {} });

type AnnotationProviderProps = PropsWithChildren;

export const AnnotationLinkProvider = ({
  children,
}: AnnotationProviderProps) => {
  const annotationLinks = {};

  return (
    <AnnotationLinkContext.Provider value={{ annotationLinks }}>
      {children}
    </AnnotationLinkContext.Provider>
  );
};

export const useAnnotationLink = () => {
  const { annotationLinks } = useContext(AnnotationLinkContext);
  const max = (vals: number[]) => {
    const sorted = vals.slice().sort((a, b) => b - a);
    return sorted[0] || 0;
  };
  const annotate = useCallback(
    (link: string): number => {
      const curr = annotationLinks[link];
      if (curr) {
        return curr;
      }

      const nextVal: number = max(Object.values(annotationLinks)) + 1;
      annotationLinks[link] = nextVal;

      return nextVal;
    },
    [annotationLinks]
  );

  return { annotate };
};
