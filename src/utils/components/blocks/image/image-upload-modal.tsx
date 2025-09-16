import { FC, useState } from 'react';
import Modal, { ButtonInfo } from '../../base/modal';
import { UploadFile } from '../../base/upload-file';
import { ConfirmModalProps } from '../utils/types';
import { uploadImage } from './upload-image';
import { ImageUploadResponse } from '~/utils/types/image';

export const ImageUploadModal: FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [data, setData] = useState<ImageUploadResponse | null>(null);
  const onUpload = async (file: File): Promise<void> => {
    const data = await uploadImage(file);
    setData(data);
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
      <UploadFile onChange={onUpload} />
    </Modal>
  );
};
