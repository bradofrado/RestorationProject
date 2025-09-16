import { uploadImage } from '~/server/dao/image';
import { ImageUploadResponse } from '~/utils/types/image';

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return new Response('No file uploaded', { status: 400 });
  }
  const response = await uploadImage(file);
  const data: ImageUploadResponse = {
    url: response.url,
  };
  return new Response(JSON.stringify(data), { status: 200 });
};
