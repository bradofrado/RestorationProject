import { createContext, useContext, PropsWithChildren } from 'react';

const AnnotationLinkContext = createContext<Record<string, number>>({});

export const AnnotationLinkProvider = ({ children }: PropsWithChildren) => {
  const annotationLinks = {};

  return (
    <AnnotationLinkContext.Provider value={annotationLinks}>
      {children}
    </AnnotationLinkContext.Provider>
  );
};

export const useAnnotationLink = () => {
  const annotationLinks = useContext(AnnotationLinkContext);
  const max = (vals: number[]) => {
    const sorted = vals.slice().sort((a, b) => b - a);
    return sorted[0] || 0;
  };
  const annotate = (link: string): number => {
    const curr = annotationLinks[link];
    if (curr) {
      return curr;
    }

    const nextVal: number = max(Object.values(annotationLinks)) + 1;
    annotationLinks[link] = nextVal;

    return nextVal;
  };

  return { annotate };
};
