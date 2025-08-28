import { useEffect, useState } from 'react';
import Dropdown from '~/utils/components/base/dropdown';
import {
  type ItemAction,
  type DropdownItem,
} from '~/utils/components/base/dropdown';
import { useGetPages } from '~/utils/services/EventPageService';
import {
  useCategoryMutations,
  useGetCategories,
  useTimelineMutations,
} from '~/utils/services/TimelineService';
import {
  type RestorationTimelineItem,
  type TimelineCategory,
} from '~/utils/types/timeline';
import { useChangeProperty, groupByDistinct } from '~/utils/utils';
import Panel from '~/utils/components/base/panel';
import AddRemove from '~/utils/components/base/addremove';
import Input from '~/utils/components/base/input';
import EditItemsButtons from '~/utils/components/edit/edit-items-buttons';
import Label from '~/utils/components/base/label';
import ColorPicker from '~/utils/components/base/color-picker';
import { DateRangePicker } from '~/utils/components/base/calendar/date-picker';
import { RemoveField } from '../base/remove-field';
import { type EditableDeleteableComponentProps } from './editable';
import { DirtyComponent, defaultDirtyProps } from './dirty-component';
import {
  DraggableComponent,
  DroppableContext,
} from '~/utils/components/base/draggable-list';
import { DragMoveIcon } from '../icons/icons';
import Modal from '../base/modal';
import Button from '../base/buttons/button';
import { type HexColor } from '~/utils/types/colors';
import { MapSelector } from '../base/map-selector';
import { type MapImage, maps } from '~/utils/types/maps';
import Image from 'next/image';
import { TimelineDateType } from '@prisma/client';

type Position = { x: number; y: number };

export const EditTimelineItems = () => {
  const [category, setCategory] = useState<TimelineCategory>();
  const changeProperty = useChangeProperty<TimelineCategory>(setCategory);
  const { update, create, deletem } = useCategoryMutations();
  const {
    update: updateItem,
    create: createItem,
    deletem: deleteItem,
  } = useTimelineMutations();
  const pageQuery = useGetPages();
  const categoryQuery = useGetCategories();
  useEffect(() => {
    if (create.data != undefined) {
      setCategory(create.data);
    } else if (update.data != undefined) {
      setCategory(update.data);
    }
  }, [create.data, update.data]);

  if (
    pageQuery.isLoading ||
    pageQuery.isError ||
    categoryQuery.isLoading ||
    categoryQuery.isError
  ) {
    return <></>;
  }
  const pages = pageQuery.data;
  const categories = categoryQuery.data;
  const categoriesGroup = groupByDistinct(categories, 'id');
  const categoryNames: DropdownItem<number>[] = categories.map((x) => ({
    name: x.name,
    id: x.id,
  }));

  const onAdd = () => {
    const newCategory: TimelineCategory = {
      id: -1,
      name: 'New Category',
      pageId: pages[0]?.id || '',
      items: [],
      color: '#f1635c',
    };
    setCategory(newCategory);
  };

  const onSave = (isNew: boolean) => {
    if (!category) {
      return;
    }

    if (isNew) {
      create.mutate(category);
    } else {
      update.mutate(category);
    }
  };

  const onClear = () => {
    setCategory(undefined);
  };

  const onDelete = (isNew: boolean) => {
    if (category && !isNew) {
      deletem.mutate(category.id);
      setCategory(undefined);
    }
  };

  const onChange: ItemAction<number> = (item) => {
    const category = categoriesGroup[item.id];
    setCategory(category);
  };

  const onPageChange: ItemAction<string> = (value) => {
    if (!category) return;
    changeProperty(category, 'pageId', value.id);
  };

  const onPageRemove = () => {
    if (!category) return;
    changeProperty(category, 'pageId', null);
  };

  const onItemDelete = (i: number) => {
    if (!category) return;

    const item = category.items[i];
    if (!item) return;

    const copy = category.items.slice();
    copy.splice(i, 1);
    if (item.id > 0) {
      deleteItem.mutate(item.id);
    }
    changeProperty(category, 'items', copy);
  };

  const onItemAdd = () => {
    if (!category) return;
    const copy = category.items.slice();
    const maxId =
      category.items.length > 0
        ? Math.max(...category.items.map((x) => x.id))
        : 0;
    copy.push({
      id: -1 * (maxId + 1),
      text: 'new text',
      date: new Date(),
      endDate: null,
      links: [],
      subcategory: null,
      categoryId: category.id,
      type: 'EXACT',
      x: null,
      y: null,
      mapImage: null,
    });
    changeProperty(category, 'items', copy);
  };

  const saveItem = (item: RestorationTimelineItem, i: number) => {
    if (!category) return;
    const copy = category.items.slice();
    copy[i] = item;
    if (item.id < 0) {
      createItem.mutate(item);
    } else {
      updateItem.mutate(item);
    }
    changeProperty(category, 'items', copy);
  };

  return (
    <>
      <div>
        <EditItemsButtons
          items={categoryNames}
          value={category?.id}
          onChange={onChange}
          onAdd={onAdd}
          onSave={onSave}
          onClear={onClear}
          onDelete={onDelete}
        >
          {({ isNew }) => (
            <>
              {category && (
                <>
                  <div className="my-2">
                    <Input
                      include={Label}
                      label="Name"
                      className="my-1"
                      value={category.name}
                      onChange={(value) =>
                        changeProperty(category, 'name', value)
                      }
                    />
                    <Label label="Page" className="my-2">
                      <RemoveField
                        onRemove={onPageRemove}
                        value={!!category?.pageId}
                      >
                        <Dropdown
                          items={pages.map((x) => ({ name: x.url, id: x.id }))}
                          initialValue={category?.pageId}
                          onChange={onPageChange}
                        >
                          No page
                        </Dropdown>
                      </RemoveField>
                    </Label>
                    <Label label="Color" className="my-2">
                      <ColorPicker
                        value={category.color}
                        onChange={(color) =>
                          changeProperty(category, 'color', color)
                        }
                      />
                    </Label>
                  </div>
                  <AddRemove
                    custom={true}
                    items={category.items}
                    onAdd={onItemAdd}
                  >
                    {(item, i, AddRemoveItem) => {
                      const props = {
                        onDelete: () => onItemDelete(i),
                        component: EditRestorationItem,
                        data: item,
                        onEdit: (item: RestorationTimelineItem) =>
                          saveItem(item, i),
                      };
                      return isNew ? (
                        <AddRemoveItem {...props} category={category} />
                      ) : (
                        <DirtyComponent
                          id={`${item.id}`}
                          index={i}
                          {...defaultDirtyProps(item.id < 0)}
                          as={AddRemoveItem}
                          {...props}
                          category={category}
                          dataTestId={`dirty-component-${item.id}`}
                        />
                      );
                    }}
                  </AddRemove>
                </>
              )}
            </>
          )}
        </EditItemsButtons>
      </div>
    </>
  );
};

type EditRestorationItemProps =
  EditableDeleteableComponentProps<RestorationTimelineItem> & {
    category: TimelineCategory;
  };
const EditRestorationItem = ({
  data: propItem,
  onEdit: onSaveProp,
  category,
}: EditRestorationItemProps) => {
  const changePropertyItem =
    useChangeProperty<RestorationTimelineItem>(onSaveProp);
  const [show, setShow] = useState(false);

  const onLinkChange = (value: string, i: number) => {
    const links = propItem.links;
    links[i] = value;
    changePropertyItem(propItem, 'links', links);
  };

  const onAddLink = () => {
    const links = propItem.links.slice();
    links.push('new link');
    changePropertyItem(propItem, 'links', links);
  };

  const onDeleteLink = (i: number) => {
    const links = propItem.links.slice();
    links.splice(i, 1);
    changePropertyItem(propItem, 'links', links);
  };

  const onDateChange = (start: Date, end?: Date) => {
    const newItem = changePropertyItem(propItem, 'date', start);
    if (end) {
      changePropertyItem(newItem, 'endDate', end);
    }
  };

  const onDateRemove = () => {
    const newItem = changePropertyItem(propItem, 'date', null);
    changePropertyItem(newItem, 'endDate', null);
  };

  const onEditLocationClick = () => {
    setShow(true);
  };

  const pos: Position | undefined =
    propItem.x != null && propItem.y != null
      ? { x: propItem.x, y: propItem.y }
      : undefined;

  const onLocationEdit = (value: EditLocationValue) => {
    if (value.pos && value.pos !== pos) {
      let newItem = changePropertyItem(propItem, 'x', value.pos.x);
      newItem = changePropertyItem(newItem, 'y', value.pos.y);
      changePropertyItem(newItem, 'mapImage', value.mapImage);
    } else {
      changePropertyItem(propItem, 'mapImage', value.mapImage);
    }
    setShow(false);
  };

  const onLocationRemove = () => {
    let newItem = changePropertyItem(propItem, 'x', null);
    newItem = changePropertyItem(newItem, 'y', null);
    changePropertyItem(newItem, 'mapImage', null);
  };

  const mapImage = maps.find((m) => m.name === propItem.mapImage);

  return (
    <>
      <Panel className="my-1" role="editable-timeline-item">
        <Input
          include={Label}
          label="Text"
          type="textarea"
          value={propItem.text}
          inputClass="w-full"
          onChange={(value) => changePropertyItem(propItem, 'text', value)}
        />
        <Label label="Date" className="my-1 mr-1 inline-block">
          <RemoveField onRemove={onDateRemove} value={!!propItem.date}>
            <DateRangePicker
              start={propItem.date}
              end={propItem.endDate || propItem.date}
              onChange={onDateChange}
            />
          </RemoveField>
        </Label>
        <Label label="Date Type" className="my-1">
          <Dropdown
            items={Object.values(TimelineDateType).map((type) => ({
              name: type,
              id: type,
            }))}
            initialValue={propItem.type}
            onChange={(value) => changePropertyItem(propItem, 'type', value.id)}
          />
        </Label>
        <Input
          include={Label}
          label="Subcategory"
          className="my-1"
          value={propItem.subcategory || ''}
          inputClass="w-full"
          onChange={(value) =>
            changePropertyItem(propItem, 'subcategory', value || null)
          }
        />
        <Label label="Links" className="my-1">
          <AddRemove
            items={propItem.links}
            onAdd={onAddLink}
            custom
            container={DroppableContext<string>}
            id={`links-${propItem.id}`}
            onReorder={(links: string[]) =>
              changePropertyItem(propItem, 'links', links)
            }
            className="flex flex-col gap-2"
          >
            {(link: string, i: number, Wrapper) => (
              <DraggableComponent id={`${i}`} index={i}>
                <Wrapper
                  onDelete={() => onDeleteLink(i)}
                  icons={[{ icon: DragMoveIcon }]}
                >
                  <Input
                    value={link}
                    inputClass="w-full"
                    onChange={(value) => onLinkChange(value, i)}
                  />
                </Wrapper>
              </DraggableComponent>
            )}
          </AddRemove>
        </Label>
        <Label label="Location">
          <div className="flex gap-2">
            <RemoveField
              value={!!propItem.x || !!propItem.y}
              onRemove={onLocationRemove}
            >
              <>
                {propItem.x != null && <span>x: {propItem.x}</span>}
                {propItem.y != null && <span>y: {propItem.y}</span>}
              </>
            </RemoveField>
            <Button
              onClick={onEditLocationClick}
              mode={pos ? 'primary' : 'secondary'}
            >
              Edit
            </Button>
          </div>
          {mapImage ? (
            <Image
              src={mapImage.image}
              alt={mapImage.name}
              width={100}
              height={100}
            />
          ) : null}
        </Label>
      </Panel>
      <Modal isOpen={show} header="" buttons={[]} size="lg">
        <EditLocationMap
          key={propItem.id}
          value={{ pos, mapImage: propItem.mapImage || '' }}
          onChange={onLocationEdit}
          background={category.color}
          onClose={() => setShow(false)}
        />
      </Modal>
    </>
  );
};

interface EditLocationValue {
  pos: Position | undefined;
  mapImage: string;
}

interface EditLocationMapProps {
  value: EditLocationValue;
  onChange: (value: EditLocationValue) => void;
  onClose: () => void;
  background: HexColor;
}
const EditLocationMap: React.FunctionComponent<EditLocationMapProps> = ({
  onChange,
  value,
  background,
  onClose,
}) => {
  const [mapImage, setMapImage] = useState<MapImage | undefined>(
    maps.find((m) => m.name === value.mapImage)
  );
  const [pos, setPos] = useState<Position | undefined>(value.pos);
  const onImageClick: React.MouseEventHandler<HTMLImageElement> = (e) => {
    const target = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - target.left;
    const y = e.clientY - target.top;

    setPos({ x: x / target.width, y: y / target.height });
  };

  return (
    <>
      {maps.length > 1 ? (
        <Label label="Map">
          <MapSelector
            value={mapImage?.name ?? ''}
            onChange={(value) => {
              setMapImage(value);
            }}
          />
        </Label>
      ) : null}
      <Label label="Location">
        <div className="relative" onClick={onImageClick}>
          {pos ? (
            <div
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${pos.x * 100}%`,
                top: `${pos.y * 100}%`,
                backgroundColor: background,
              }}
            />
          ) : null}
          {mapImage ? (
            <Image
              src={mapImage.image}
              alt={mapImage.name}
              fill
              style={{ position: undefined }}
            />
          ) : null}
        </div>
      </Label>
      <div className="flex items-center justify-end">
        <Button mode="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onChange({ pos, mapImage: value.mapImage })}>
          Save
        </Button>
      </div>
    </>
  );
};
