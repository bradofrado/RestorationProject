import { DateFormat, groupBy } from '~/utils/utils';
import { Annotation } from '../Timeline/annotation';
import { type RestorationTimelineItem } from '~/utils/types/timeline';
import {
  type ContentEditable,
  type ContentEditableBlur,
} from '../blocks/utils/types';
import React, { type CSSProperties, type ReactNode } from 'react';
import { useAnnotationLink } from './annotation-provider';
import { type PolymorphicComponentProps } from '~/utils/types/polymorphic';
import { AnnotationComponentProvider } from '../blocks/annotation/annotation-component-provider';
import { AnnotationMarkdown } from '../blocks/annotation/annotation-markdown';
import { type Annotation as AnnotationType } from '~/utils/types/annotation';

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
  onBlur,
  ...rest
}: DisplayListProps<T>) => {
  return (
    <>
      <ul className="list-disc px-10 py-2">
        {items.map((item, i) => {
          if (contentEditable === true || contentEditable === 'true') {
            return (
              <AnnotationComponentProvider
                key={i}
                value={item.text}
                onChange={(value) => onBlur?.(value, i)}
              >
                {({ onBlur: onAnnotationBlur }) => (
                  <ListComponent
                    item={item}
                    contentEditable={contentEditable}
                    onBlur={onAnnotationBlur}
                    {...rest}
                  />
                )}
              </AnnotationComponentProvider>
            );
          }
          return <ListComponent key={i} item={item} {...rest} />;
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
  props: { item: T; style?: CSSProperties } & ContentEditable & {
      onBlur?: (e: React.FocusEvent) => void;
    }
) => JSX.Element;

export const DisplayListItem: DisplayListItemComponent<{ text: string }> =
  function ({ item, contentEditable, onBlur, style }) {
    return (
      <li
        onBlur={onBlur}
        contentEditable={contentEditable}
        suppressContentEditableWarning
        style={style}
        key={item.text}
      >
        <AnnotationMarkdown text={item.text} />
      </li>
    );
  };

interface QuoteItem {
  text: string;
  subText: ReactNode;
  links: AnnotationType[];
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
          <Annotation link={link} key={i} linkNumber={annotate(link)} />
        ))}
      </span>
    </Component>
  );
};

export const RestorationQuote: DisplayListItemComponent<
  RestorationTimelineItem
> = ({ item, contentEditable: _, ...rest }) => {
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
