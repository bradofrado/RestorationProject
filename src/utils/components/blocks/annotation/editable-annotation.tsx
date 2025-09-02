import { FC } from 'react';
import { Annotation, AnnotationProps } from '../../Timeline/annotation';
import Popover from '../../base/popover';
import Input from '../../base/input';
import Button from '../../base/buttons/button';
import Label from '../../base/label';
import { TrashIcon } from '@heroicons/react/outline';

interface EditableAnnotationProps extends AnnotationProps {
  onEdit: (annotation: string) => void;
  onDelete: () => void;
}

export const EditableAnnotation: FC<EditableAnnotationProps> = ({
  onEdit,
  onDelete,
  ...rest
}) => {
  return (
    <Popover button={<Annotation {...rest} linkToAnnotation={false} />}>
      <Input value={rest.link} include={Label} label="Link" onBlur={onEdit} />
      <Button className="mt-2" onClick={onDelete} mode="secondary">
        <TrashIcon className="h-5 w-5" />
      </Button>
    </Popover>
  );
};
