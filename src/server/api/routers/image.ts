import { getImages } from '~/server/dao/image';
import { createTRPCRouter, editableProcedure } from '../trpc';

export const imageRouter = createTRPCRouter({
  getImages: editableProcedure.query(async () => {
    const result = await getImages();

    return result.blobs.map((blob) => blob.url);
  }),
});
