'use client';

import { type FC, useState } from 'react';
import Modal, { type ButtonInfo } from '../../base/modal';
import { UploadFile } from '../../base/upload-file';
import { type ConfirmModalProps } from '../utils/types';
import { uploadImage } from './upload-image';
import { type ImageUploadResponse } from '~/utils/types/image';
import { api } from '~/utils/api';

export const ImageUploadModal: FC<
  ConfirmModalProps & { multiple?: boolean }
> = ({ isOpen, onClose, onConfirm, multiple = false }) => {
  const utils = api.useUtils();
  const { data: images } = api.image.getImages.useQuery();

  const [data, setData] = useState<
    ImageUploadResponse | ImageUploadResponse[] | null
  >(multiple ? [] : null);

  const onUpload = async (file: File): Promise<void> => {
    const data = await uploadImage(file);
    setData((prev) => (Array.isArray(prev) ? [...(prev || []), data] : data));
    await utils.image.getImages.invalidate();
  };

  const onImageSelect = (image: string) => {
    setData((prev) =>
      Array.isArray(prev)
        ? prev.find((d) => d.url === image)
          ? prev.filter((d) => d.url !== image)
          : [...(prev || []), { url: image }]
        : { url: image }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      header="Upload Image"
      buttons={
        [
          { label: 'Cancel', mode: 'secondary', handler: onClose },
          data
            ? {
                label: 'Confirm',
                mode: 'primary',
                handler: () =>
                  onConfirm(
                    Array.isArray(data)
                      ? { content: '', properties: JSON.stringify(data) }
                      : { content: data.url, properties: null }
                  ),
              }
            : undefined,
        ].filter(Boolean) as ButtonInfo[]
      }
    >
      <div className="flex flex-wrap gap-2">
        {images?.map((image) => (
          <button
            className={`rounded-md p-1 hover:bg-gray-100 ${
              (
                Array.isArray(data)
                  ? data.some((d) => d.url === image)
                  : data?.url === image
              )
                ? 'border-2 border-primary'
                : ''
            }`}
            key={image}
            onClick={() => onImageSelect(image)}
          >
            <img src={image} className="h-24 w-24" alt="Image" />
          </button>
        ))}
      </div>
      <UploadFile onChange={onUpload} />
    </Modal>
  );
};
