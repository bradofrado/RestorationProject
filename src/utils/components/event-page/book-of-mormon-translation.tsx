import { DateFormat, groupBy } from '~/utils/utils';
import { Annotation } from '../Timeline/CondensedTimeline';
import { type RestorationTimelineItem } from '~/utils/types/timeline';
import { type ContentEditableBlur } from '../edit/add-component';
import React from 'react';
import { useAnnotationLink } from '~/utils/components/edit/add-component';

type DataGroupbyListProps<T extends ListItem> = {
  className?: string;
  groupByKey: keyof T;
} & DisplayListComponentPassthrough<T>;
export const DataGroupbyList = <T extends ListItem>({
  className,
  groupByKey,
  items,
  ...rest
}: DataGroupbyListProps<T>) => {
  return (
    <div className={className || ''}>
      <ul>
        {Object.entries<T[]>(groupBy(items, groupByKey)).map(
          ([title, items], i) => (
            <DisplayGroup items={items} title={title} key={i} {...rest} />
          )
        )}
      </ul>
    </div>
  );
};

type DisplayGroup<T extends ListItem> = {
  title: string;
} & DisplayListComponentPassthrough<T>;

const DisplayGroup = <T extends ListItem>(props: DisplayGroup<T>) => {
  const { title, ...rest } = props;
  return (
    <>
      <li>
        <h3 className="text-xl">{title}</h3>
        <DisplayList {...rest} />
      </li>
    </>
  );
};

type DisplayListProps<T extends ListItem> = DisplayListComponentPassthrough<T>;
export const DisplayList = <T extends ListItem>({
  items,
  ListComponent,
  contentEditable,
  ...rest
}: DisplayListProps<T>) => {
  return (
    <>
      <ul className="list-disc px-10 py-2">
        {items.map((item, i) => {
          return (
            <ListComponent
              key={i}
              index={i}
              item={item}
              contentEditable={contentEditable}
              {...rest}
            />
          );
        })}
      </ul>
    </>
  );
};

type ListItem = {
  text: string;
};

export type DisplayListComponentPassthrough<T extends ListItem> = {
  ListComponent: DisplayListItemComponent<T>;
  items: T[];
} & ContentEditableBlur;

type DisplayListItemComponent<T extends ListItem> = (
  props: { item: T; index: number } & ContentEditableBlur
) => JSX.Element;

export const DisplayListItem: DisplayListItemComponent<{ text: string }> =
  function ({ item, index, contentEditable, onBlur }) {
    return (
      <li
        onBlur={(e: React.FocusEvent<HTMLLIElement>) =>
          onBlur && onBlur(e.target.innerHTML, index)
        }
        contentEditable={contentEditable}
        suppressContentEditableWarning
      >
        {item.text}
      </li>
    );
  };

export const RestorationQuote: DisplayListItemComponent<
  RestorationTimelineItem
> = ({ item }) => {
  const { annotate } = useAnnotationLink();
  const [quote, name] = item.text.split('-');
  return (
    <li>
      <span className="italic">{quote}</span>
      {name && (
        <>
          <span className="font-medium">-{name}</span>
          {item.date && (
            <span className="">
              {' '}
              {DateFormat.fullTextRange(item.date, item.endDate)}
            </span>
          )}
        </>
      )}
      <span>
        {item.links.map((link, i) => (
          <Annotation link={link} key={i} id={annotate(link)} />
        ))}
      </span>
    </li>
  );
};
