import z from 'zod';
import { type Annotation, annotationSchema } from '~/utils/types/annotation';

export const inlineAnnotationRegex = /\[([^\[\]]*)\]/g;
export const annotationLinkSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    return { link: val };
  }
  return val;
}, annotationSchema) as z.ZodType<Annotation>;
