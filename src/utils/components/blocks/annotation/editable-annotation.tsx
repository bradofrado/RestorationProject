import { type FC } from 'react';
import {
  AnnotationBase,
  type AnnotationProps,
} from '../../Timeline/annotation';
import Popover from '../../base/popover';
import Input from '../../base/input';
import Button from '../../base/buttons/button';
import Label from '../../base/label';
import { TrashIcon } from '@heroicons/react/outline';
import { type Annotation as AnnotationType } from '~/utils/types/annotation';

interface EditableAnnotationProps extends AnnotationProps {
  onEdit: (annotation: AnnotationType) => void;
  onDelete: () => void;
}

export const EditableAnnotation: FC<EditableAnnotationProps> = ({
  onEdit,
  onDelete,
  ...rest
}) => {
  return (
    <Popover button={<AnnotationBase linkNumber={rest.linkNumber} />}>
      <Input
        value={rest.link.link}
        include={Label}
        label="Link"
        onBlur={(value) => onEdit({ ...rest.link, link: value })}
      />
      <Input
        value={rest.link.note}
        include={Label}
        label="Note"
        onBlur={(value) => onEdit({ ...rest.link, note: value })}
      />
      <Button className="mt-2" onClick={onDelete} mode="secondary">
        <TrashIcon className="h-5 w-5" />
      </Button>
    </Popover>
  );
};
