import {
  ImageUploadResponse,
  imageUploadResponseSchema,
} from '~/utils/types/image';

export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  return imageUploadResponseSchema.parse(await response.json());
};
