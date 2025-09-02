import { FC } from 'react';
import { DraggableComponent } from '../base/draggable-list';
import AddRemove from '../base/addremove';
import { DroppableContext } from '../base/draggable-list';
import { DragMoveIcon } from '../icons/icons';
import Input from '../base/input';

interface AnnotationListProps {
  links: string[];
  onAdd: () => void;
  onReorder: (links: string[]) => void;
  onDelete: (index: number) => void;
  onChange: (link: string, index: number) => void;
  id: string;
}

export const AnnotationList: FC<AnnotationListProps> = ({
  id,
  links,
  onAdd,
  onReorder,
  onDelete,
  onChange,
}) => {
  return (
    <AddRemove
      items={links}
      onAdd={onAdd}
      custom
      container={DroppableContext<string>}
      id={id}
      onReorder={onReorder}
      className="flex flex-col gap-2"
    >
      {(link, i, Wrapper) => (
        <DraggableComponent key={i} id={`${i}`} index={i}>
          <Wrapper
            onDelete={() => onDelete(i)}
            icons={[{ icon: DragMoveIcon }]}
          >
            <Input
              value={link}
              inputClass="w-full"
              onChange={(value) => onChange(value, i)}
            />
          </Wrapper>
        </DraggableComponent>
      )}
    </AddRemove>
  );
};
