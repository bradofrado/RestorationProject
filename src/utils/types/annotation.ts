import z from 'zod';

export const annotationSchema = z.object({
  link: z.string(),
  note: z.string().optional(),
});

export type Annotation = z.infer<typeof annotationSchema>;
