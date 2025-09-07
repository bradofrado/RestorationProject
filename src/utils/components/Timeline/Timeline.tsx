'use client';

import dayjs from 'dayjs';
import ScrollDrag from '../base/scroll-drag';
import {
  type ReactElement,
  type CSSProperties,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import Link from 'next/link';
import { PrimaryColor, type HexColor } from '~/utils/types/colors';
import React from 'react';
import {
  type RestorationTimelineItemDateType,
  type TimelineCategory,
  type TimelineItemStandalone,
} from '~/utils/types/timeline';
import { useGetPageUrl } from 'src/utils/services/EventPageService';
import Button from '../base/buttons/button';
import Label from '../base/label';
import Header from '../base/header';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { getPageUrl } from '~/utils/get-page-url';
import { Annotation } from './annotation';

const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

type EstimateTypes = Exclude<RestorationTimelineItemDateType, 'EXACT'>;

const getContainerSize = () => {
  if (typeof window === 'undefined') {
    return 0;
  }
  const sizeStr = getComputedStyle(document.body).getPropertyValue(
    '--container-zoom'
  );
  return Number(sizeStr.substring(0, sizeStr.length - 2));
};

export interface TimelineProps {
  categories: TimelineCategory[];
}
export const Timeline: React.FC<TimelineProps> = ({
  categories,
}: TimelineProps) => {
  const query = useGetPageUrl();
  const [filteredCategories, setFilteredCategories] = useState<
    TimelineCategory['id'][]
  >([]);
  const [scrollIndex, setScrollIndex] = useState<number>(-1);
  const [zoom, setZoom] = useState<number>(getContainerSize());

  const items = categories.reduce<TimelineItemStandalone[]>((prev, curr) => {
    const items: TimelineItemStandalone[] = curr.items
      .filter((item) => !!item.date)
      .map((item) => ({
        ...item,
        color: curr.color,
        pageId: curr.pageId,
        date: item.date || new Date(),
      }));
    prev = prev.concat(items);

    return prev;
  }, []);

  const unfilteredSorted = items.slice().sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else if (a.date > b.date) {
      return 1;
    }

    return 0;
  });
  const sorted = unfilteredSorted.filter(
    (x) => x.categoryId && filteredCategories.indexOf(x.categoryId) < 0
  );

  const lastDate = unfilteredSorted[unfilteredSorted.length - 1]?.date as Date;
  const firstDate = unfilteredSorted[0]?.date as Date;

  const yearDiff = lastDate.getFullYear() - firstDate.getFullYear() + 1;
  const monthMarkers = useMemo(() => {
    let timeItems: TimelineItem[] = [];
    const firstYear = firstDate.getFullYear();
    console.log(zoom);
    const restrict = (() => {
      if (zoom <= 50) {
        return 0;
      }

      if (zoom <= 100) {
        return 4;
      }

      if (zoom <= 300) {
        return 2;
      }

      return 1;
    })();

    for (let i = 0; i < yearDiff; i++) {
      timeItems = timeItems.concat(
        months
          .map((m, j) => {
            const item: TimelineItem = {
              graphDate: dayjs(new Date(firstYear + i, m, 1)).format('MMM'),
              x: 0,
              below: false,
              date: m === 0 ? (firstYear + i).toString() : undefined,
              color: PrimaryColor,
              year: firstYear + i,
              skip: m === 0 ? false : restrict === 0 || j % restrict !== 0,
              amount: 1,
            };

            return item;
          })
          .filter((x) => x !== null)
      );
    }

    return timeItems.slice().sort((a, b) => a.x - b.x);
  }, [firstDate, yearDiff, zoom]);

  const convertToTimelineItems = useCallback(
    (items: TimelineItemStandalone[]) => {
      if (typeof window === 'undefined') {
        return [];
      }
      const offset = zoom / 4;
      const firstYear = firstDate.getFullYear();
      const getYearOffset = (year: number) => {
        return year * months.length * offset;
      };
      const getMonthOffset = (month: number) => {
        return month * offset;
      };
      const getDayOffset = (day: number) => {
        return (day / 31.0) * offset;
      };
      let currDate: Date | null = null;
      let currDateCount = 0;

      const estimateItems = items.reduce<
        Record<EstimateTypes, Record<string, TimelineItemStandalone[]>>
      >(
        (prev, curr) => {
          if (curr.type === 'ESTIMATE_YEAR') {
            const year = curr.date.getFullYear();
            const currItems = prev['ESTIMATE_YEAR'][year];
            if (!currItems) {
              prev['ESTIMATE_YEAR'][year] = [curr];
            } else {
              currItems.push(curr);
            }
            return prev;
          } else if (curr.type === 'ESTIMATE_MONTH') {
            const year = curr.date.getFullYear();
            const month = curr.date.getMonth();
            const key = `${year}-${month}`;
            const currItems = prev['ESTIMATE_MONTH'][key];
            if (!currItems) {
              prev['ESTIMATE_MONTH'][key] = [curr];
            } else {
              currItems.push(curr);
            }
            return prev;
          }

          return prev;
        },
        {
          ESTIMATE_YEAR: {},
          ESTIMATE_MONTH: {},
        }
      );
      const itemsByDate = items.reduce<
        Record<string, TimelineItemStandalone[]>
      >((prev, curr) => {
        const date = curr.date.toISOString();
        const currItems = prev[date];
        if (currItems) {
          currItems.push(curr);
        } else {
          prev[date] = [curr];
        }

        return prev;
      }, {});

      for (const [type, typeItems] of Object.entries(estimateItems)) {
        for (const [key, items] of Object.entries(typeItems)) {
          const { dateStep, startDate } = (() => {
            if (type === 'ESTIMATE_YEAR') {
              const year = parseInt(key);
              const startYearDate = new Date(year, 0, 1);
              const endYearDate = new Date(year + 1, 0, 1);
              return {
                dateStep:
                  (endYearDate.getTime() - startYearDate.getTime()) /
                  (items.length + 1),
                startDate: startYearDate,
              };
            } else if (type === 'ESTIMATE_MONTH') {
              const [year, month] = key.split('-').map(Number);
              if (year === undefined || month === undefined) {
                throw new Error(`Invalid month key: ${key}`);
              }
              const startMonthDate = new Date(year, month, 1);
              const endMonthDate = new Date(year, month + 1, 1);
              return {
                dateStep:
                  (endMonthDate.getTime() - startMonthDate.getTime()) /
                  (items.length + 1),
                startDate: startMonthDate,
              };
            }
            throw new Error(`Invalid type: ${type}`);
          })();
          items.forEach((item, i) => {
            const newDate = new Date(startDate);
            newDate.setTime(newDate.getTime() + (i + 1) * dateStep);
            item.date = newDate;
          });
        }
      }

      const timeItems: TimelineItem[] = [];
      for (const [_, items] of Object.entries(itemsByDate)) {
        const item = items[0];
        if (!item) continue;

        if (
          !currDate ||
          item.date.getFullYear() != currDate.getFullYear() ||
          item.date.getMonth() - currDate.getMonth() > 1
        ) {
          currDate = item.date;
          currDateCount = 0;
        } else {
          currDateCount++;
        }

        if (item.color == undefined) {
          throw new Error(
            `item ${item.date.toDateString()} does not have color`
          );
        }

        const date =
          item.type === 'EXACT'
            ? dayjs(item.date).format('MMM D')
            : item.type === 'ESTIMATE_YEAR'
            ? `~ ${dayjs(item.date).format('YYYY')}`
            : `~ ${dayjs(item.date).format('MMM')}`;
        const index = timeItems.length;
        timeItems.push({
          date,
          x:
            getYearOffset(item.date.getFullYear() - firstYear) +
            getMonthOffset(item.date.getMonth()) +
            getDayOffset(item.date.getDate()),
          below: currDateCount % 2 === 0,
          content: (
            <TimelineItemContent
              items={items}
              onClick={() => setScrollIndex(index)}
              offset={offset}
            />
          ),
          color: item.color,
          year: item.date.getFullYear(),
          amount: items.length,
        });
      }

      return timeItems;
    },
    [firstDate, zoom]
  );

  const timeItems = useMemo(() => {
    const items = convertToTimelineItems(sorted);
    return items;
  }, [convertToTimelineItems, sorted]);

  const onCategoryClick = (i: TimelineCategory['id']) => {
    const copy = filteredCategories.slice();
    const index = copy.indexOf(i);
    if (index >= 0) {
      copy.splice(index, 1);
    } else {
      copy.push(i);
    }
    setScrollIndex(-1);
    setFilteredCategories(copy);
  };

  const onNextClick = () => {
    const newIndex = (scrollIndex + 1) % timeItems.length;
    setScrollIndex(newIndex);
  };

  const onPreviousClick = () => {
    let newIndex = scrollIndex - 1;
    newIndex = newIndex < 0 ? timeItems.length - 1 : newIndex;
    setScrollIndex(newIndex);
  };

  const onZoomInClick = () => {
    if (zoom >= 1500) {
      return;
    }

    const currentSize = getContainerSize();
    setZoom(currentSize + 50);
    document.documentElement.style.setProperty(
      '--container-zoom',
      `${currentSize + 50}px`
    );
  };

  const onZoomOutClick = () => {
    if (zoom <= 50) {
      return;
    }

    const currentSize = getContainerSize();
    document.documentElement.style.setProperty(
      '--container-zoom',
      `${currentSize - 50}px`
    );
    setZoom(currentSize - 50);
  };

  const categoriesWithDateItems = categories.filter(
    (x) => x.items.filter((item) => item.date).length > 0
  );

  if (query.isLoading || query.isError || items.length == 0) {
    return <>Loading</>;
  }

  return (
    <>
      <div className="w-full">
        <h1 className="mt-[20px] pb-5 text-center text-4xl font-bold tracking-tight text-gray-800 sm:mb-[100px] sm:mt-0">
          Timeline {firstDate.getFullYear()} - {lastDate.getFullYear()}
        </h1>
        <ScrollDrag
          rootClass="timeline-container mt-[20px] sm:mb-[100px] sm:mt-0"
          scrollPos={timeItems[scrollIndex]?.x}
        >
          <>
            {monthMarkers?.map((item, i) => (
              <TimelineItemComponent {...item} key={i} />
            ))}
            {timeItems?.map((item, i) => (
              <TimelineItemComponent {...item} key={i} />
            ))}
          </>
        </ScrollDrag>
        <div className="flex flex-col-reverse items-center sm:flex-row">
          <Label label="Categories" className="grow">
            <TimelineCategoryFilter
              categories={categoriesWithDateItems}
              filtered={filteredCategories}
              onChange={onCategoryClick}
              filterKey="id"
            />
          </Label>
          <div className="grow">
            <Header
              className={
                scrollIndex < 0 || !timeItems[scrollIndex] ? 'invisible' : ''
              }
            >
              {scrollIndex >= 0 && timeItems[scrollIndex]
                ? `${timeItems[scrollIndex]?.date || ''}, ${
                    timeItems[scrollIndex]?.year || ''
                  }`
                : 'Filler'}
            </Header>
            <div>
              <Button onClick={onPreviousClick}>Previous</Button>
              <Button onClick={onNextClick}>Next</Button>
            </div>
          </div>
          <div className="space-x-2">
            <Button mode="secondary" onClick={onZoomOutClick}>
              -
            </Button>
            <span>Zoom</span>
            <Button mode="secondary" onClick={onZoomInClick}>
              +
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

type TimelineCategoryFilterProps<T extends keyof TimelineCategory> = {
  categories: TimelineCategory[];
  filtered: TimelineCategory[T][];
  onChange: (key: TimelineCategory[T]) => void;
  filterKey: T;
};
export const TimelineCategoryFilter = <T extends keyof TimelineCategory>({
  categories,
  filtered,
  onChange,
  filterKey,
}: TimelineCategoryFilterProps<T>) => {
  return (
    <>
      {categories.map((category, i) => (
        <Button
          key={i}
          mode={
            filtered.indexOf(category[filterKey]) > -1 ? 'secondary' : 'other'
          }
          backgroundColor={category.color}
          onClick={() => onChange(category[filterKey])}
        >
          {category.name}
        </Button>
      ))}
    </>
  );
};

interface TimelineItemContentProps {
  items: TimelineItemStandalone[];
  onClick: () => void;
  offset: number;
}

const TimelineItemContent: React.FC<TimelineItemContentProps> = ({
  items,
  onClick,
  offset,
}: TimelineItemContentProps) => {
  const [page, setPage] = useState<number>(0);

  const query = useGetPageUrl();
  const item = items[page];
  if (!item) {
    return null;
  }
  const getUrl = (pageId: string) => {
    const result = query.data?.(pageId);
    if (!result) {
      throw new Error('No data found');
    }
    return getPageUrl(result);
  };

  const hoverState =
    item.text.length > offset
      ? 'hover:w-[300px] sm:hover:w-[500px] group/overflow'
      : '';

  const onNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (page < items.length - 1) {
      setPage(page + 1);
    } else {
      setPage(0);
    }
  };
  const onPreviousClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (page > 0) {
      setPage(page - 1);
    } else {
      setPage(items.length - 1);
    }
  };
  return (
    <button
      data-testid="timeline-item"
      className={`restoration-item group overflow-hidden hover:z-20 focus:z-20 ${hoverState} absolute h-[200px] transition-width ease-in-out`}
      onClick={onClick}
    >
      <div className="flex h-full flex-col justify-center">
        <p className="mt-3 overflow-hidden text-sm group-hover/overflow:overflow-auto group-hover:pb-1 md:text-base">
          {item.text}{' '}
          {item.links.map((link, i) => (
            <Annotation key={i} link={link} linkNumber={i + 1} portal />
          ))}
        </p>
      </div>
      {item.pageId && (
        <div className="flex h-5 justify-around">
          <Link
            className="hidden text-sm font-medium text-gray-800 hover:text-gray-700 group-hover:inline-block"
            href={getUrl?.(item.pageId)}
          >
            More
          </Link>
        </div>
      )}

      {items.length > 1 ? (
        <div className="hidden group-hover:block">
          <Button
            className="absolute left-0 top-[50%]"
            mode="secondary"
            onClick={onPreviousClick}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <Button
            className="absolute right-0 top-[50%]"
            mode="secondary"
            onClick={onNextClick}
          >
            <ArrowRightIcon className="size-4" />
          </Button>
          <div className="absolute right-2 top-0">
            <span>
              {page + 1} / {items.length}
            </span>
          </div>
        </div>
      ) : null}
    </button>
  );
};

const TimelineItemComponent: React.FC<TimelineItem> = (props: TimelineItem) => {
  const ref = useRef<HTMLDivElement>(null);
  const { date, x, content, below, graphDate, color, skip, amount } = props;

  let belowClass = below ? ' below' : '';
  const style: CSSProperties | undefined =
    x > 0 ? { left: `${x}px` } : undefined;
  if (x > 0) {
    belowClass += ' absolute';
  } else {
    belowClass += ' relative';
  }

  useEffect(() => {
    ref.current?.style.setProperty('--bom-color', color);
  }, [color]);

  return (
    <>
      <div
        className={'timeline-item' + belowClass}
        style={style}
        ref={ref}
        aria-label={`${x}`}
      >
        <div className="timeline-item-content">
          {date && !skip && (
            <div
              className={`date-indicator timeline-item-connector ${
                date.startsWith('~') ? 'estimate' : ''
              }`}
            >
              <div className="relative">
                {date}
                {amount > 1 && (
                  <span className="absolute -right-2 -top-6 size-5 rounded-full border-2 border-rose-500 bg-white text-xs text-black">
                    {amount}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="timeline-item-content">{content}</div>
        {graphDate && !skip && (
          <div className="circle">
            <span className="">{graphDate}</span>
          </div>
        )}
      </div>
    </>
  );
};

export interface TimelineItem {
  graphDate?: string;
  x: number;
  below: boolean;
  content?: ReactElement;
  date?: string;
  color: HexColor;
  year: number;
  skip?: boolean;
  amount: number;
}
