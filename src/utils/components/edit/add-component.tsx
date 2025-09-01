'use client';

import React, { useContext, useMemo } from 'react';
import Editable, {
  type EditableProps,
  type ButtonIcon,
  type EditableComponentProps,
  type DeletableComponentProps,
  type EditableDeleteableComponentProps,
  type EditableComponent,
} from './editable';
import CondensedTimeline from '../Timeline/CondensedTimeline';
import {
  AddIcon,
  AdjustIcon,
  DeleteIcon,
  DragMoveIcon,
  EditIcon,
} from '../icons/icons';
import Dropdown, { DropdownIcon, type DropdownItem } from '../base/dropdown';
import Header, {
  type HeaderLevels,
  type HeaderProps,
  type HeaderSettings,
  type SettingsComponentSettings,
  SettingsComponentSettingsSchema,
} from '../base/header';
import {
  DataGroupbyList,
  DisplayList,
  DisplayListItem,
  RestorationQuote,
} from '../event-page/book-of-mormon-translation';
import {
  type RestorationTimelineItem,
  type TimelineCategoryName,
} from '../../types/timeline';
import { type EditableData } from '../../types/page';
import { z } from 'zod';
import {
  useGetCategories,
  useGetCategory,
} from '../../services/TimelineService';
import { DirtyComponent } from './dirty-component';
import {
  useChangeProperty,
  type IfElse,
  jsonParse,
  setStyleFromSettings,
} from '~/utils/utils';
import {
  DirtyDraggableListComponent,
  DraggableListComponent,
} from '~/utils/components/base/draggable-list';
import { PopoverIcon } from '~/utils/components/base/popover';
import { NumberInput } from '../base/input';
import Label from '../base/label';
import ColorPicker from '../base/color-picker';
import { type HexColor, HexColorSchema } from '~/utils/types/colors';
import Paragraph, { type ParagraphProps } from '../base/paragraph';
import { HeaderSettingsSchema } from '~/utils/components/base/header';
import { CheckboxInput } from '~/utils/components/base/input';
import { type ComponentType } from './components';

const Placeholder = ({ children }: React.PropsWithChildren) => {
  return <div className="text-gray-400">{children}</div>;
};

const defaultColors: HexColor[] = ['#ad643a', '#f1635c', '#111827'];

type EditableDataComponent = EditableDeleteableComponentProps<EditableData> &
  DataComponent;
interface DataComponent {
  data: EditableData;
  className?: string;
}
interface Component {
  label: string;
  editable: React.ComponentType<EditableDataComponent>;
  component: React.ComponentType<DataComponent>;
}

const CondensedTimelineSettingsSchema = SettingsComponentSettingsSchema.extend({
  dotColor: HexColorSchema,
});
const DataCondensedTimeline: React.ElementType<DataComponent> = ({
  data,
  className,
  ...rest
}) => {
  const query = useGetCategory(data?.content || 'Book of Mormon');
  const settings = useParseSettings(
    data.properties,
    CondensedTimelineSettingsSchema,
    { dotColor: '#ad643a' }
  );
  if (query.isLoading || query.isError) {
    return <Placeholder>Pick Timeline items</Placeholder>;
  }

  const items = query.data.items;

  return (
    <div style={setStyleFromSettings(settings)}>
      <CondensedTimeline
        items={items}
        className={className}
        color={settings.dotColor}
        {...rest}
      />
    </div>
  );
};
const EditableCondensedTimeline: React.ElementType<EditableDataComponent> = ({
  onDelete,
  onEdit,
  data,
  ...rest
}) => {
  const query = useGetCategories();
  const settings = useParseSettings(
    data.properties,
    CondensedTimelineSettingsSchema,
    { dotColor: '#ad643a' }
  );

  const icons: ButtonIcon[] = useMemo(() => {
    const dropdownItems: DropdownItem<string>[] =
      query.data?.map((x) => ({
        id: x.name,
        name: x.name,
      })) ?? [];
    return [
      <DropdownIcon
        onChange={(item) =>
          onEdit({ content: item.id, properties: data.properties })
        }
        key={1}
        items={dropdownItems}
        icon={EditIcon}
      />,
      <PopoverIcon icon={AdjustIcon} key={0}>
        <SettingsComponentCallout
          data={settings}
          onEdit={(settings) =>
            onEdit({
              content: data.content,
              properties: JSON.stringify(settings),
            })
          }
        >
          {({ dotColor: color }, changeSetting) => (
            <>
              <Label label="Dot Color" sameLine>
                <ColorPicker
                  className="m-auto"
                  value={color}
                  onChange={(value) => changeSetting('dotColor', value)}
                  defaultColors={defaultColors}
                />
              </Label>
            </>
          )}
        </SettingsComponentCallout>
      </PopoverIcon>,
    ];
  }, [query.data, settings, onEdit, data.properties, data.content]);

  if (query.isLoading || query.isError) {
    return <></>;
  }

  return (
    <>
      <EditableComponentContainer
        as={DataCondensedTimeline}
        data={data}
        onDelete={onDelete}
        {...rest}
        icons={icons}
      >
        Text
      </EditableComponentContainer>
    </>
  );
};

export type ContentEditable = {
  contentEditable?: boolean | 'true' | 'false';
};
export type ContentEditableBlur = ContentEditable & {
  onBlur?: (value: string, index: number) => void;
};
interface DataListProps extends DataComponent, ContentEditableBlur {}

export const ListSettingsSchema = SettingsComponentSettingsSchema.extend({
  group: z.boolean(),
  items: z.array(z.string()),
});
const DataList: React.ElementType<DataListProps> = ({ data, ...rest }) => {
  const query = useGetCategories();
  const settings = useParseSettings(data.properties, ListSettingsSchema, {
    group: false,
    items: [],
  });
  if (query.isLoading || query.isError) {
    return <></>;
  }

  const style = setStyleFromSettings(settings);

  if (data.content == 'custom' && !settings.items.length) {
    return (
      <div style={style}>
        <Placeholder>List is empty</Placeholder>
      </div>
    );
  }
  if (data.content == 'custom') {
    const items = settings.items;
    return (
      <div style={style}>
        <DisplayList
          items={items.map((x) => ({ text: x }))}
          ListComponent={DisplayListItem}
          {...rest}
        />
      </div>
    );
  }

  const items: RestorationTimelineItem[] =
    query.data.find((x) => x.name == data.content)?.items || [];

  if (settings.group) {
    return (
      <div style={style}>
        <DataGroupbyList
          items={items}
          ListComponent={RestorationQuote}
          groupByKey="subcategory"
          {...rest}
        />
      </div>
    );
  }

  return (
    <div style={style}>
      <DisplayList items={items} ListComponent={RestorationQuote} {...rest} />
    </div>
  );
};

const EditableList: React.ElementType<EditableDataComponent> = ({
  onDelete,
  onEdit,
  data,
  ...rest
}) => {
  const query = useGetCategories();
  const settings = useParseSettings(data.properties, ListSettingsSchema, {
    group: false,
    items: [],
  });
  const changeProperty = useChangeProperty<typeof settings>((settings) =>
    onEdit({ content: data.content, properties: JSON.stringify(settings) })
  );

  const type: TimelineCategoryName = data != null ? data.content : 'custom';
  const dropdownItems: DropdownItem<string>[] = useMemo(
    () =>
      [
        {
          name: 'Custom',
          id: 'custom',
        },
      ].concat(query.data?.map((x) => ({ id: x.name, name: x.name })) || []),
    [query.data]
  );

  const editIcons: ButtonIcon[] = useMemo(() => {
    const icons: ButtonIcon[] = [
      <DropdownIcon
        items={dropdownItems}
        icon={EditIcon}
        key={1}
        onChange={(item) =>
          onEdit({ content: item.id, properties: data?.properties || null })
        }
      />,
    ];

    icons.push(
      <PopoverIcon icon={AdjustIcon}>
        <SettingsComponentCallout
          data={settings}
          onEdit={changeProperty.function}
        >
          {({ group }, changeSettings) => (
            <>
              {data.content != 'custom' && (
                <Label label="Group" sameLine>
                  <CheckboxInput
                    value={group}
                    onChange={(value) => changeSettings('group', value)}
                  />
                </Label>
              )}
            </>
          )}
        </SettingsComponentCallout>
      </PopoverIcon>
    );
    if (type == 'custom') {
      icons.push({
        icon: AddIcon,
        handler: () =>
          changeProperty(settings, 'items', settings.items.concat('Text')),
      });
    }

    return icons;
  }, [
    dropdownItems,
    settings,
    changeProperty,
    type,
    onEdit,
    data?.properties,
    data.content,
  ]);

  const editLiItem = (value: string, index: number) => {
    const vals = [...settings.items];
    vals[index] = value;
    changeProperty(settings, 'items', vals);
  };

  if (query.isLoading || query.isError) {
    return <></>;
  }

  return (
    <>
      <EditableComponentContainer
        as={DataList}
        icons={editIcons}
        data={data}
        onBlur={editLiItem}
        onDelete={onDelete}
        {...rest}
      />
    </>
  );
};

type EditableComponentContainerProps<C extends React.ElementType> =
  DeletableComponentProps & EditableProps<C>;
const EditableComponentContainer = <C extends React.ElementType>(
  props: EditableComponentContainerProps<C>
) => {
  const defaultIcons: ButtonIcon[] = [
    { icon: DeleteIcon, handler: props.onDelete },
    { icon: DragMoveIcon },
  ];
  const allIcons = defaultIcons.concat(props.icons || []);
  return (
    <>
      <Editable {...props} icons={allIcons} />
    </>
  );
};

type HeaderSettingsComponentProps = {
  settings?: HeaderSettings;
  onEdit: (settings: HeaderSettings) => void;
};
const HeaderSettingsComponent = ({
  settings = { margin: 0, color: '#000', level: 2 },
  onEdit,
}: HeaderSettingsComponentProps) => {
  return (
    <>
      <SettingsComponentCallout data={settings} onEdit={onEdit}>
        {({ level }, changeSetting) => (
          <>
            <NumberInput
              inputClass="w-[4rem] ml-1"
              value={level}
              onChange={(value) =>
                changeSetting('level', value as HeaderLevels)
              }
              min={1}
              max={6}
              include={Label}
              label="Level"
              sameLine
            />
          </>
        )}
      </SettingsComponentCallout>
    </>
  );
};

export const useParseSettings = <T extends SettingsComponentSettings>(
  settings: string | undefined | null,
  schema: z.ZodType<T>,
  { margin = 0, color = '#000', ...rest }: Partial<T>
): T => {
  const settingsParsed: T = useMemo(
    () =>
      settings
        ? jsonParse(schema).parse(settings)
        : ({ margin, color, ...rest } as T),
    [settings, schema, margin, color, rest]
  );

  return settingsParsed;
};

type SettingsComponentCalloutProps<T extends SettingsComponentSettings> =
  EditableComponentProps<T> & {
    children?: (
      rest: Omit<T, 'margin' | 'color'>,
      changeSetting: (key: keyof T, value: T[keyof T]) => T
    ) => React.ReactNode;
  };
const SettingsComponentCallout = <T extends SettingsComponentSettings>({
  data,
  onEdit,
  children,
}: SettingsComponentCalloutProps<T>) => {
  const changeSetting = useChangeProperty<T>(onEdit);
  const { margin, color, ...rest } = data;
  return (
    <>
      <div className="flex w-[8rem] flex-col gap-1 p-1">
        <Label label="Margin" sameLine>
          <NumberInput
            inputClass="w-[4rem]"
            value={margin}
            onChange={(value) => changeSetting(data, 'margin', value)}
            min={0}
          />
        </Label>
        <Label label="Color" sameLine>
          <ColorPicker
            className="m-auto"
            value={color}
            onChange={(value) => changeSetting(data, 'color', value)}
            defaultColors={defaultColors}
          />
        </Label>
        {children &&
          children(rest, (key, value) => changeSetting(data, key, value))}
      </div>
    </>
  );
};

const EditableHeader: React.ComponentType<EditableDataComponent> = ({
  onDelete,
  onEdit,
  data,
}) => {
  const settings = useParseSettings(data.properties, HeaderSettingsSchema, {
    level: 2,
  });
  const onBlur = (e: React.FocusEvent<HTMLHeadingElement>) =>
    e.target.innerHTML !== data?.content &&
    onEdit({ content: e.target.innerHTML, properties: data.properties });
  const icons: ButtonIcon[] = [
    <PopoverIcon icon={AdjustIcon} key={0}>
      <HeaderSettingsComponent
        settings={settings}
        onEdit={(settings) =>
          onEdit({
            content: data.content,
            properties: JSON.stringify(settings),
          })
        }
      />
    </PopoverIcon>,
  ];
  return (
    <>
      <EditableComponentContainer
        as={DataHeader}
        onDelete={onDelete}
        onBlur={onBlur}
        icons={icons}
        data={data}
      />
    </>
  );
};

const DataHeader: React.ComponentType<
  DataComponent & Omit<HeaderProps, 'settings'>
> = ({ data, ...rest }) => {
  const settings = useParseSettings(data.properties, HeaderSettingsSchema, {
    level: 2,
  });
  return (
    <>
      <Header className="py-2" {...rest} settings={settings}>
        {data?.content || 'Text'}
      </Header>
    </>
  );
};

const ParagraphSettingsCallout: EditableComponent<
  SettingsComponentSettings
> = ({ data, onEdit }) => {
  return (
    <>
      <SettingsComponentCallout data={data} onEdit={onEdit} />
    </>
  );
};
const EditableParagraph: React.ComponentType<EditableDataComponent> = ({
  onDelete,
  onEdit,
  data,
}) => {
  const settings = useParseSettings(
    data.properties,
    SettingsComponentSettingsSchema,
    {}
  );
  const onBlur = (e: React.FocusEvent<HTMLParagraphElement>) =>
    e.target.innerHTML !== data?.content &&
    onEdit({ content: e.target.innerHTML, properties: data.properties });
  const icons: ButtonIcon[] = [
    <PopoverIcon icon={AdjustIcon} key={0}>
      <ParagraphSettingsCallout
        data={settings}
        onEdit={(settings) =>
          onEdit({
            content: data.content,
            properties: JSON.stringify(settings),
          })
        }
      />
    </PopoverIcon>,
  ];
  return (
    <>
      <EditableComponentContainer
        as={DataParagraph}
        role="paragraph"
        onDelete={onDelete}
        data={data}
        icons={icons}
        onBlur={onBlur}
      />
    </>
  );
};

const DataParagraph: React.ComponentType<
  DataComponent & Omit<ParagraphProps, 'settings'>
> = ({ data, ...rest }) => {
  const settings = useParseSettings(
    data.properties,
    SettingsComponentSettingsSchema,
    {}
  );
  return (
    <>
      <Paragraph className="py-2" settings={settings} {...rest}>
        {data?.content || 'Text'}
      </Paragraph>
    </>
  );
};

function createComponents<
  T extends readonly Component[] & Array<{ label: V }>,
  V extends string
>(...args: T) {
  return args;
}

const components = createComponents(
  {
    label: 'Header',
    editable: EditableHeader,
    component: DataHeader,
  },
  {
    label: 'Paragraph',
    editable: EditableParagraph,
    component: DataParagraph,
  },
  {
    label: 'Timeline',
    editable: EditableCondensedTimeline,
    component: DataCondensedTimeline,
  },
  {
    label: 'List',
    editable: EditableList,
    component: DataList,
  }
);

export type EditableComponentType = {
  type: ComponentType;
  id: number;
} & EditableDataComponent;
export type DataComponentType = {
  type: ComponentType;
  id: number;
} & DataComponent;

const AnnotationLinkContext = React.createContext<Record<string, number>>({});

export const AnnotationLinkProvider = ({
  children,
}: React.PropsWithChildren) => {
  const annotationLinks = {};

  return (
    <AnnotationLinkContext.Provider value={annotationLinks}>
      {children}
    </AnnotationLinkContext.Provider>
  );
};

export const useAnnotationLink = () => {
  const annotationLinks = useContext(AnnotationLinkContext);
  const max = (vals: number[]) => {
    const sorted = vals.slice().sort((a, b) => b - a);
    return sorted[0] || 0;
  };
  const annotate = (link: string): number => {
    const curr = annotationLinks[link];
    if (curr) {
      return curr;
    }

    const nextVal: number = max(Object.values(annotationLinks)) + 1;
    annotationLinks[link] = nextVal;

    return nextVal;
  };

  return { annotate };
};

type CustomComponentsProps = { isNew?: boolean } & IfElse<
  'editable',
  {
    items: EditableComponentType[];
    onReorder: (items: EditableComponentType[]) => void;
  },
  { items: DataComponentType[] }
>;
export const CustomComponents = ({
  isNew = false,
  ...rest
}: CustomComponentsProps) => {
  return (
    <AnnotationLinkProvider>
      {rest.editable ? (
        <EditableComponentsList
          items={rest.items}
          isNew={isNew}
          onReorder={rest.onReorder}
        />
      ) : (
        rest.items.map((item, i) => (
          <CustomComponent key={i} {...item} isNew={isNew} editable={false} />
        ))
      )}
    </AnnotationLinkProvider>
  );
};

export const CustomComponent = (
  props: IfElse<'editable', EditableComponentType, DataComponentType> & {
    isNew: boolean;
  }
) => {
  const Component =
    components.find((x) => x.label == props.type) ||
    (components[0] as Component);
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

type EditableComponentsListProps = {
  items: EditableComponentType[];
  isNew: boolean;
  onReorder: (items: EditableComponentType[]) => void;
};
const EditableComponentsList = ({
  items,
  isNew,
  onReorder,
}: EditableComponentsListProps) => {
  const Component = isNew
    ? DraggableListComponent
    : DirtyDraggableListComponent;
  return (
    <>
      <Component id="editable-components" items={items} onReorder={onReorder}>
        {(item) => <CustomComponent {...item} isNew={isNew} editable={true} />}
      </Component>
    </>
  );
};

export default function AddComponent({
  onAdd,
}: {
  onAdd: (component: ComponentType) => void;
}) {
  const items: DropdownItem<ComponentType>[] = useMemo(
    () =>
      components.map((comp) => ({
        name: comp.label,
        id: comp.label,
      })),
    []
  );
  return (
    <Dropdown
      anchor="top start"
      items={items}
      chevron={false}
      onChange={(item) => onAdd(item.id)}
    >
      +
    </Dropdown>
  );
}
