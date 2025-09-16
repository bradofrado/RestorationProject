import { list, ListBlobResult, put, PutBlobResult } from '@vercel/blob';

export const uploadImage = async (imageFile: File): Promise<PutBlobResult> => {
  const blob = await put(`restoration/${imageFile.name}`, imageFile, {
    access: 'public',
  });

  return blob;
};

export const getImages = async (): Promise<ListBlobResult> => {
  const images = await list({
    prefix: 'restoration/',
  });

  return images;
};
