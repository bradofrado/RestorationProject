import { type FC } from 'react';
import { DraggableComponent } from '../base/draggable-list';
import AddRemove from '../base/addremove';
import { DroppableContext } from '../base/draggable-list';
import { DragMoveIcon } from '../icons/icons';
import Input from '../base/input';
import { type Annotation } from '~/utils/types/annotation';

interface AnnotationListProps {
  links: Annotation[];
  onAdd: () => void;
  onReorder: (links: Annotation[]) => void;
  onDelete: (index: number) => void;
  onChange: (link: Annotation, index: number) => void;
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
      container={DroppableContext<Annotation>}
      id={id}
      onReorder={onReorder}
      className="flex flex-col gap-2"
    >
      {({ link, note }, i, Wrapper) => (
        <DraggableComponent key={i} id={`${i}`} index={i}>
          <Wrapper
            onDelete={() => onDelete(i)}
            icons={[{ icon: DragMoveIcon }]}
          >
            <Input
              value={link}
              inputClass="w-full"
              onChange={(value) => onChange({ link: value, note }, i)}
            />
            <Input
              value={note}
              type="textarea"
              placeholder="Note"
              inputClass="w-full"
              onChange={(value) => onChange({ link, note: value }, i)}
            />
          </Wrapper>
        </DraggableComponent>
      )}
    </AddRemove>
  );
};
