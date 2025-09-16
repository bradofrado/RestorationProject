import { FC, useState } from 'react';
import Modal, { ButtonInfo } from '../../base/modal';
import { UploadFile } from '../../base/upload-file';
import { ConfirmModalProps } from '../utils/types';
import { uploadImage } from './upload-image';
import { ImageUploadResponse } from '~/utils/types/image';
import { api } from '~/utils/api';

export const ImageUploadModal: FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const utils = api.useUtils();
  const { data: images } = api.image.getImages.useQuery();

  const [data, setData] = useState<ImageUploadResponse | null>(null);

  const onUpload = async (file: File): Promise<void> => {
    const data = await uploadImage(file);
    setData(data);
    await utils.image.getImages.invalidate();
  };

  const onImageSelect = (image: string) => {
    setData({ url: image });
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
                  onConfirm({ content: data.url, properties: null }),
              }
            : undefined,
        ].filter(Boolean) as ButtonInfo[]
      }
    >
      <div className="flex flex-wrap gap-2">
        {images?.map((image) => (
          <button
            className={`rounded-md p-1 hover:bg-gray-100 ${
              data?.url === image ? 'border-2 border-primary' : ''
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
