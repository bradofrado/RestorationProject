import { createContext, useContext, PropsWithChildren, FC } from 'react';
import {
  Annotation as AnnotationComponent,
  AnnotationProps,
} from '../Timeline/annotation';

const AnnotationLinkContext = createContext<{
  annotationLinks: Record<string, number>;
}>({ annotationLinks: {} });

interface AnnotationProviderProps<C extends AnnotationProps = AnnotationProps>
  extends PropsWithChildren {}

export const AnnotationLinkProvider = <
  C extends AnnotationProps = AnnotationProps
>({
  children,
}: AnnotationProviderProps<C>) => {
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

const AnnotationComponentContext = createContext<{
  Annotation: FC<AnnotationProps>;
}>({ Annotation: AnnotationComponent });

export const AnnotationComponentProvider = ({
  children,
  Annotation,
}: PropsWithChildren & { Annotation: FC<AnnotationProps> }) => {
  return (
    <AnnotationComponentContext.Provider value={{ Annotation }}>
      {children}
    </AnnotationComponentContext.Provider>
  );
};

export const useAnnotationComponent = () => {
  return useContext(AnnotationComponentContext);
};
