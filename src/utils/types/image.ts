import z from 'zod';

export const imageUploadResponseSchema = z.object({
  url: z.string(),
});
export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>;
