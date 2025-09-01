'use client';

import { useState } from 'react';
import {
  type RestorationTimelineItem,
  type TimelineCategory,
} from '~/utils/types/timeline';
import { TimelineCategoryFilter } from '../Timeline/Timeline';
import { Annotation } from '../Timeline/CondensedTimeline';
import {
  AnnotationLinkProvider,
  useAnnotationLink,
} from '../edit/add-component';
import { MapSelector } from '../base/map-selector';
import { maps, type MapImage } from '~/utils/types/maps';
import Image from 'next/image';
import Label from '../base/label';

interface MapProps {
  categories: TimelineCategory[];
}
export const Map: React.FunctionComponent<MapProps> = ({ categories }) => {
  const [mapImage, setMapImage] = useState<MapImage | undefined>(maps[0]);
  const [hoveredItem, setHoveredItem] = useState<RestorationTimelineItem>();
  const [filteredCategories, setFilteredCategories] = useState<
    TimelineCategory['id'][]
  >([]);
  const items = categories
    .filter((category) => !filteredCategories.includes(category.id))
    .reduce<(RestorationTimelineItem & { category: TimelineCategory })[]>(
      (prev, curr) =>
        prev.concat(curr.items.map((item) => ({ ...item, category: curr }))),
      []
    );
  const [filteredIds, setFilteredIds] = useState<number[]>([]);

  const filtered =
    filteredIds.length > 0
      ? items.filter((item) => filteredIds.includes(item.id))
      : items;

  const onSelect = (item: RestorationTimelineItem): void => {
    const copy = filteredIds.slice();
    const index = copy.indexOf(item.id);
    if (index > -1) {
      copy.splice(index, 1);
    } else {
      copy.push(item.id);
    }
    setFilteredIds(copy);
  };

  const onCategoryClick = (i: TimelineCategory['id']) => {
    const copy = filteredCategories.slice();
    const index = copy.indexOf(i);
    if (index >= 0) {
      copy.splice(index, 1);
    } else {
      copy.push(i);
    }
    setFilteredCategories(copy);
  };

  return (
    <AnnotationLinkProvider>
      <div className="grid grid-cols-4 gap-4">
        <EventList
          items={filtered}
          hoveredId={hoveredItem?.id}
          onSelect={onSelect}
          onHover={setHoveredItem}
        />
        <div className="relative col-span-2 h-fit">
          {items.map((item) =>
            item.x && item.y ? (
              <div
                key={item.id}
                className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ease-in-out hover:cursor-pointer ${
                  filteredIds.includes(item.id)
                    ? 'scale-[200%]'
                    : hoveredItem?.id === item.id
                    ? 'scale-[150%]'
                    : undefined
                }`}
                style={{
                  left: `${item.x * 100}%`,
                  top: `${item.y * 100}%`,
                  backgroundColor: item.category.color,
                }}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(undefined)}
                onClick={() => onSelect(item)}
              ></div>
            ) : null
          )}
          {mapImage ? (
            <Image src={mapImage.image} alt={mapImage.name} />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
        <div>
          <Label label="Categories">
            <TimelineCategoryFilter
              categories={categories}
              filtered={filteredCategories}
              onChange={onCategoryClick}
              filterKey="id"
            />
          </Label>
          {maps.length > 1 ? (
            <Label label="Maps">
              <MapSelector value={mapImage?.name} onChange={setMapImage} />
            </Label>
          ) : null}
        </div>
      </div>
    </AnnotationLinkProvider>
  );
};

const EventList: React.FunctionComponent<{
  items: (RestorationTimelineItem & { category: TimelineCategory })[];
  hoveredId: number | undefined;
  onSelect: (item: RestorationTimelineItem) => void;
  onHover: (item: RestorationTimelineItem | undefined) => void;
}> = ({ items, hoveredId, onSelect, onHover }) => {
  const { annotate } = useAnnotationLink();
  return (
    <div className="flex flex-1 flex-col gap-2">
      {items.map((item) =>
        item.x && item.y ? (
          <button
            key={item.id}
            className="flex items-center justify-start gap-2"
            onClick={() => onSelect(item)}
            onMouseEnter={() => onHover(item)}
            onMouseLeave={() => onHover(undefined)}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.category.color }}
            />
            <div
              className={`flex-1 text-sm ${
                item.id === hoveredId ? 'font-semibold' : ''
              }`}
            >
              {item.text}{' '}
              {item.links.map((link, i) => (
                <Annotation key={i} link={link} id={annotate(link)} />
              ))}
            </div>
          </button>
        ) : null
      )}
    </div>
  );
};
