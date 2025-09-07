'use client';

import { type IfElse } from '~/utils/utils';
import {
  type DataComponentType,
  type EditableComponentType,
} from './utils/types';
import {
  AnnotationLinkProvider,
  useAnnotationLink,
} from '../event-page/annotation-provider';
import { components } from './utils/components';
import { DirtyComponent } from '../edit/dirty-component';
import {
  DirtyDraggableListComponent,
  DraggableListComponent,
} from '../base/draggable-list';
import { type FC } from 'react';
import Header from '../base/header';

type RenderBlocksProps = { isNew?: boolean } & IfElse<
  'editable',
  {
    items: EditableComponentType[];
    onReorder: (items: EditableComponentType[]) => void;
  },
  { items: DataComponentType[] }
>;
export const RenderBlocks = ({ isNew = false, ...rest }: RenderBlocksProps) => {
  return (
    <AnnotationLinkProvider>
      {rest.editable ? (
        <RenderEditableBlocks
          items={rest.items}
          isNew={isNew}
          onReorder={rest.onReorder}
        />
      ) : (
        rest.items.map((item, i) => (
          <RenderBlock key={i} {...item} isNew={isNew} editable={false} />
        ))
      )}
      <Footnotes />
    </AnnotationLinkProvider>
  );
};

export const RenderBlock = (
  props: IfElse<'editable', EditableComponentType, DataComponentType> & {
    isNew: boolean;
  }
) => {
  const Component = components.find((x) => x.label == props.type);
  if (!Component) {
    throw new Error(`Component ${props.type} not found`);
  }
  if (props.editable) {
    const { type: _, editable: _a, id, ...rest } = props;
    const isNew = id < 0;
    return (
      <div
        data-testid={`custom-component-editable-${id}`}
        role="custom-component-editable"
      >
        {props.isNew ? (
          <Component.editable {...rest} />
        ) : (
          <DirtyComponent
            key={id}
            as={Component.editable}
            {...rest}
            dirty={isNew}
            overrideDelete={isNew}
            showCancel={!isNew}
          ></DirtyComponent>
        )}
      </div>
    );
  }

  const { type: _, editable: _a, id, ...rest } = props;
  return (
    <div data-testid={`custom-component-${id}`} role="custom-component">
      <Component.component {...rest}></Component.component>
    </div>
  );
};

type RenderEditableBlocksProps = {
  items: EditableComponentType[];
  isNew: boolean;
  onReorder: (items: EditableComponentType[]) => void;
};
const RenderEditableBlocks = ({
  items,
  isNew,
  onReorder,
}: RenderEditableBlocksProps) => {
  const Component = isNew
    ? DraggableListComponent
    : DirtyDraggableListComponent;
  return (
    <>
      <Component id="editable-components" items={items} onReorder={onReorder}>
        {(item) => <RenderBlock {...item} isNew={isNew} editable={true} />}
      </Component>
    </>
  );
};

const Footnotes: FC = () => {
  const { annotationLinks } = useAnnotationLink();

  return (
    <>
      <Header level={2}>Footnotes</Header>
      <ol className="list-decimal">
        {annotationLinks.map(({ link, note }) => (
          <li key={link}>
            {note ? (
              <span>
                {note} (
                <a
                  className="text-blue-500 underline"
                  href={link}
                  target="_blank"
                >
                  link
                </a>
                )
              </span>
            ) : (
              <a
                className="text-blue-500 underline"
                href={link}
                target="_blank"
              >
                {link}
              </a>
            )}
          </li>
        ))}
      </ol>
    </>
  );
};
