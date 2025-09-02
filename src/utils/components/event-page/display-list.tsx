import { DateFormat, groupBy } from '~/utils/utils';
import { Annotation } from '../Timeline/CondensedTimeline';
import { type RestorationTimelineItem } from '~/utils/types/timeline';
import { type ContentEditableBlur } from '../blocks/utils/types';
import React, { CSSProperties, FC, ReactNode } from 'react';
import { useAnnotationLink } from './annotation-provider';
import { PolymorphicComponentProps } from '~/utils/types/polymorphic';

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
  props: { item: T; index: number; style?: CSSProperties } & ContentEditableBlur
) => JSX.Element;

export const DisplayListItem: DisplayListItemComponent<{ text: string }> =
  function ({ item, index, contentEditable, onBlur, style }) {
    return (
      <li
        onBlur={(e: React.FocusEvent<HTMLLIElement>) =>
          onBlur && onBlur(e.target.innerHTML, index)
        }
        contentEditable={contentEditable}
        suppressContentEditableWarning
        style={style}
      >
        {item.text}
      </li>
    );
  };

interface QuoteItem {
  text: string;
  subText: ReactNode;
  links: string[];
}

export const Quote = <C extends React.ElementType>({
  item,
  as,
  ...rest
}: PolymorphicComponentProps<C, { item: QuoteItem }>) => {
  const { annotate } = useAnnotationLink();
  const Component = as || 'li';
  return (
    <Component {...rest}>
      <span className="italic">{item.text}</span>
      {item.subText}
      <span>
        {item.links.map((link, i) => (
          <Annotation link={link} key={i} id={annotate(link)} />
        ))}
      </span>
    </Component>
  );
};

export const RestorationQuote: DisplayListItemComponent<
  RestorationTimelineItem
> = ({ item, ...rest }) => {
  const [quote, name] = item.text.split('-');
  return (
    <Quote
      item={{
        text: quote || '',
        subText: name ? (
          <>
            <span className="font-medium">-{name}</span>
            {item.date && (
              <span className="">
                {' '}
                {DateFormat.fullTextRange(item.date, item.endDate)}
              </span>
            )}
          </>
        ) : null,
        links: item.links,
      }}
      {...rest}
    />
  );
};
