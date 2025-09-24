import { type FC, useState } from 'react';
import Modal from '../../base/modal';
import { useGetCategory } from '~/utils/services/TimelineService';
import { CheckboxInput } from '../../base/input';
import { DateFormat } from '~/utils/utils';

interface SelectTimelineItemsModalProps {
  categoryId: number;
  selectedItems: number[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: number[]) => void;
}

export const SelectTimelineItemsModal: FC<SelectTimelineItemsModalProps> = ({
  categoryId,
  selectedItems: initialSelectedItems,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedItems, setSelectedItems] =
    useState<number[]>(initialSelectedItems);
  const query = useGetCategory(categoryId);
  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      header="Select Timeline Items"
      buttons={[
        { label: 'Close', handler: onClose, mode: 'secondary' },
        {
          label: 'Confirm',
          handler: () => onConfirm(selectedItems),
          mode: 'primary',
        },
      ]}
    >
      <div className="flex flex-col gap-4">
        {query.data?.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <CheckboxInput
              value={selectedItems.includes(item.id)}
              onChange={(value) =>
                setSelectedItems(
                  value
                    ? [...selectedItems, item.id]
                    : selectedItems.filter((x) => x !== item.id)
                )
              }
            />
            <div className="grid grid-cols-4 items-center gap-2">
              <div>
                {item.date
                  ? DateFormat.fullTextRange(item.date, item.endDate)
                  : ''}{' '}
              </div>
              <div className="col-span-3">{item.text}</div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
