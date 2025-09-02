import { type ComponentSettings, type EventPage } from '~/utils/types/page';
import {
  type ByRoleMatcher,
  getByRole,
  getByTestId as getByTestIdGlobal,
  render,
  pages,
  categories,
  getByText,
  getAllByRole,
  getAllByTestId,
  queryByRole,
  queryByText,
  getByTestId,
  queryByTestId,
} from '~/test/util';
import userEvent from '@testing-library/user-event';
import { type UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { RenderPage } from '~/utils/components/event-page/render-page';
import {
  type RestorationTimelineItem,
  type TimelineCategory,
} from '~/utils/types/timeline';
import { DateFormat, groupBy, jsonParse } from '~/utils/utils';
import { EditPages } from '~/utils/components/edit/edit-pages';
import { EditTimelineItems } from '~/utils/components/edit/edit-timeline-items';
import { ComponentType } from '~/utils/components/blocks/utils/types';
import { listSettingsSchema } from '~/utils/components/blocks/list/list';

const getCategories = () => categories;
const getPages = () => pages;

const getUrl = (pageId: string) => {
  return pageId;
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('src/utils/services/EventPageService', () => ({
  useEventPagesMutation: () => ({
    create: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    update: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    deletem: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
  }),
  useComponentSettingsMutation: () => ({
    create: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    update: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    deletem: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    reorder: {
      mutate: () => undefined,
      data: null,
    },
  }),
  useGetPages: () => ({
    data: getPages(),
    isLoading: false,
    isError: false,
  }),
  useGetPageUrl: () => ({
    isLoading: false,
    isError: false,
    data: getUrl,
  }),
}));

jest.mock('src/utils/services/TimelineService', () => ({
  useGetCategories: () => ({
    isLoading: false,
    isError: false,
    data: getCategories(),
  }),
  useGetCategory: (categoryId: string) => {
    const category = getCategories().find((x) => x.name == categoryId);
    if (category)
      return {
        data: category,
        isLoading: false,
        isError: false,
      };

    return { isLoading: false, isError: true };
  },
  useCategoryMutations: () => ({
    create: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    update: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    deletem: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
  }),
  useTimelineMutations: () => ({
    create: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    update: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
    deletem: {
      mutate: () => {
        return undefined;
      },
      data: null,
    },
  }),
}));

const renderPage = () => {
  return {
    user: userEvent.setup(),
    ...render(<EditPages />),
  };
};

const renderTimelineItems = () => {
  return {
    user: userEvent.setup(),
    ...render(<EditTimelineItems />),
  };
};

const renderAndSelectPage = async (page: EventPage) => {
  const props = renderPage();
  const { user, getByText, queryByText, getByRole, getAllByRole } = props;

  const dropdown = getByText('select');
  expect(dropdown).toBeInTheDocument();

  expect(queryByText(page.url)).toBeFalsy();
  await user.click(dropdown);

  const dropdownItem = getByText(page.url);

  expect(dropdownItem).toBeInTheDocument();

  await user.click(dropdownItem);
  await new Promise((r) => setTimeout(r, 100));

  expect(getByRole('textbox')).toBeInTheDocument();
  // expect(getByText(page.title)).toBeInTheDocument();
  // expect(getByText(page.description)).toBeInTheDocument();
  expect(getAllByRole('custom-component-editable').length).toBe(
    page.settings.length
  );

  return props;
};

const renderAndSelectTimelineCategory = async (category: TimelineCategory) => {
  const props = renderTimelineItems();
  const { user, getByText, queryByText, getAllByRole } = props;

  const dropdown = getByText('select');
  expect(dropdown).toBeInTheDocument();

  expect(queryByText(category.name)).toBeFalsy();
  await user.click(dropdown);

  const dropdownItem = getByText(category.name);

  expect(dropdownItem).toBeInTheDocument();

  await user.click(dropdownItem);

  const pages = getPages();
  const page = pages.find((x) => category.pageId == x.id);

  expect(getByText(category.name)).toBeInTheDocument();
  if (page) {
    expect(getByText(page.url)).toBeInTheDocument();
  } else {
    expect(getByText('No page')).toBeInTheDocument();
  }
  expect(getAllByRole('editable-timeline-item').length).toBe(
    category.items.length
  );

  return props;
};

type RenderProps = Awaited<ReturnType<typeof renderAndSelectPage>>;
interface AddItemToPageProps extends RenderProps {
  type: ComponentType;
  page: EventPage;
  callback?: (
    props: { newComponent: HTMLElement } & RenderProps
  ) => Promise<void>;
}

interface SelectionDropdownItemProps {
  type: string;
  user: UserEvent;
  container: HTMLElement;
}
const selectDropdownItem = async ({
  type,
  user,
  container,
}: SelectionDropdownItemProps) => {
  expect(container).toBeInTheDocument();
  const dropdownItem = getByTestIdGlobal(container, `dropdown-item-${type}`);
  expect(dropdownItem).toBeInTheDocument();
  await user.click(dropdownItem);
};

const addAndDeleteItemToPage = async ({
  type,
  page,
  callback,
  ...rest
}: AddItemToPageProps) => {
  const typeToRole: Record<ComponentType, ByRoleMatcher> = {
    Header: 'heading',
    Paragraph: 'paragraph',
    List: 'list',
    Timeline: 'list',
  };

  const { getByText, user, getAllByRole } = rest;
  const addButton = getByText(/\+/);
  expect(addButton).toBeInTheDocument();

  await user.click(addButton);

  await selectDropdownItem({ type, container: rest.container, user });

  const allItems = getAllByRole('custom-component-editable');
  expect(allItems.length).toBe(page.settings.length + 1);
  const newComponent = allItems[allItems.length - 1] as HTMLElement;

  if (callback) {
    await callback({ newComponent, ...rest });
  }

  expect(getByRole(newComponent, typeToRole[type])).toBeInTheDocument();

  await user.hover(newComponent);

  const deleteButton = newComponent.querySelector('button');
  if (!deleteButton) {
    fail('Could not find delete button');
  }
  expect(deleteButton).toBeInTheDocument();

  await user.click(deleteButton);

  expect(getAllByRole('custom-component-editable').length).toBe(
    page.settings.length
  );

  return rest;
};

const clickIconWithDropdown = async (props: {
  container: HTMLElement;
  user: UserEvent;
}) => {
  const { container, user } = props;
  expect(container).toBeInTheDocument();
  const containerButton = container.querySelector('button');
  if (!containerButton) {
    fail('Edit list item should have button');
  }
  await user.click(containerButton);
};

const liElementHasAnnotationNumber = (props: {
  liIndex: number;
  annotationNumber: number;
  container: HTMLElement;
}) => {
  const { liIndex, annotationNumber, container } = props;

  const firstBOMItem = container.children[liIndex] as HTMLElement;
  expect(firstBOMItem).toBeInTheDocument();
  const annotation = getByRole(firstBOMItem, 'annotation');
  expect(annotation).toBeInTheDocument();
  expect(getByText(annotation, `${annotationNumber}`));
};

type PageSettingTester = (
  props: { setting: ComponentSettings; container: HTMLElement } & RenderProps
) => void;
const simpleSettingTester: PageSettingTester = ({ setting, getByText }) => {
  expect(getByText(setting.data.content)).toBeInTheDocument();
};

const pageSettingTesters: Record<ComponentType, PageSettingTester> = {
  Header: simpleSettingTester,
  Paragraph: simpleSettingTester,
  Timeline: ({ setting, container }) => {
    const category = getCategories().find(
      (x) => x.name == setting.data?.content
    ) as TimelineCategory;
    expect(category).toBeTruthy();

    const timelineList = getByRole(container, 'list');
    expect(timelineList).toBeInTheDocument();
    const items = category.items.filter((x) => !!x.date);
    expect(timelineList.childElementCount).toBe(items.length);

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as RestorationTimelineItem;
      const element = timelineList.children[i] as HTMLElement;
      expect(queryByText(element, item.text)).toBeInTheDocument();
      if (!item.date) {
        fail('No date on item');
      }
      const dateText = DateFormat.fullTextRange(item.date, item.endDate);
      expect(queryByText(element, dateText));

      const annotations = getAllByRole(element, 'annotation');
      expect(annotations.length).toBe(item.links.length);
    }
  },
  List: ({ setting, container }) => {
    const settings = setting.data.properties
      ? jsonParse(listSettingsSchema).parse(setting.data.properties)
      : null;
    if (setting.data.content == 'custom' && settings) {
      const items = settings.items;
      const ulElement = getByRole(container, 'list');
      expect(ulElement).toBeInTheDocument();
      expect(ulElement.childElementCount).toBe(items.length);

      for (let i = 0; i < items.length; i++) {
        const element = ulElement.children[i] as HTMLElement;
        const item = items[i] as string;
        expect(queryByText(element, item)).toBeInTheDocument();
      }
    } else {
      const category = getCategories().find(
        (x) => x.name == setting.data.content
      ) as TimelineCategory;
      expect(category).toBeTruthy();

      const checkList = (props: {
        container: HTMLUListElement;
        items: RestorationTimelineItem[];
      }) => {
        const { container, items } = props;
        expect(container).toBeInTheDocument();
        expect(container.childElementCount).toBe(items.length);

        for (let i = 0; i < items.length; i++) {
          const element = container.children[i] as HTMLElement;
          const item = items[i] as RestorationTimelineItem;

          if (item.text.startsWith('"')) {
            const split = item.text.split('-');
            expect(split.length).toBe(2);
            const quote = split[0]?.trim() as string;
            const name = split[1]?.trim() as string;
            expect(queryByText(element, quote)).toBeInTheDocument();
            expect(queryByText(element, `-${name}`)).toBeInTheDocument();
            if (!item.date) {
              fail('Item .date needs to be truthy');
            }
            expect(
              queryByText(
                element,
                DateFormat.fullTextRange(item.date, item.endDate)
              )
            ).toBeInTheDocument();
          } else {
            expect(queryByText(element, item.text)).toBeInTheDocument();
          }

          const annotations = getAllByRole(element, 'annotation');
          expect(annotations.length).toBe(item.links.length);
        }
      };

      if (!settings || !settings.group) {
        const ulElement: HTMLUListElement = getByRole(container, 'list');
        checkList({ container: ulElement, items: category.items });
      } else {
        const groups = groupBy(category.items, 'subcategory');
        const groupNames = Object.keys(groups);
        const ulElements: HTMLUListElement[] = getAllByRole(container, 'list');
        expect(ulElements.length).toBe(groupNames.length + 1);

        for (let i = 0; i < groupNames.length; i++) {
          const nextUL: HTMLUListElement = ulElements[
            i + 1
          ] as HTMLUListElement;
          const name = groupNames[i] as string;
          const items = groups[name];
          if (!items) {
            fail('There are no items in the group');
          }
          expect(getByText(container, name)).toBeInTheDocument();
          checkList({ container: nextUL, items: items });
        }
      }
    }
  },
};

describe('Edit page', () => {
  describe('EditPages', () => {
    it('should be able to select page', async () => {
      await renderAndSelectPage(pages[0] as EventPage);
    });

    it('should be able to add and delete new header to page', async () => {
      const page = pages[0] as EventPage;
      await addAndDeleteItemToPage({
        type: 'Header',
        page,
        ...(await renderAndSelectPage(page)),
      });
    });

    it('should be able to add and delete new paragraph to page', async () => {
      const page = pages[0] as EventPage;
      await addAndDeleteItemToPage({
        type: 'Paragraph',
        page,
        ...(await renderAndSelectPage(page)),
      });
    });

    it('should be able to add and delete new list to page', async () => {
      const page = pages[0] as EventPage;
      await addAndDeleteItemToPage({
        type: 'List',
        page,
        callback: async ({ newComponent, user }) => {
          let editableButtons = getAllByTestId(
            newComponent,
            'editable-edit-icon'
          );
          expect(editableButtons.length).toBe(5);
          expect(queryByRole(newComponent, 'list')).toBeFalsy();

          //Add a list item
          const addListItem = editableButtons[4] as HTMLElement;
          expect(addListItem).toBeInTheDocument();
          await user.click(addListItem);

          //Make sure we just have one more item
          let ulElement = getByRole(newComponent, 'list');
          expect(ulElement).toBeInTheDocument();
          expect(ulElement.childElementCount).toBe(1);

          //Add another item
          await user.click(addListItem);
          expect(ulElement.childElementCount).toBe(2);

          //Change the list type to Book of Mormon
          const editListItem = editableButtons[2] as HTMLElement;
          await clickIconWithDropdown({ container: editListItem, user });
          expect(
            getAllByRole(editListItem, 'menuitem', { hidden: true }).length
          ).toBe(3);
          await selectDropdownItem({
            type: 'Book of Mormon',
            user,
            container: editListItem,
          });

          //Make sure we have all the timeline items
          ulElement = getByRole(newComponent, 'list');
          expect(ulElement).toBeInTheDocument();
          expect(ulElement.childElementCount).toBe(8);

          //Check annotations
          liElementHasAnnotationNumber({
            liIndex: 7,
            annotationNumber: 7,
            container: ulElement,
          });
          liElementHasAnnotationNumber({
            liIndex: 1,
            annotationNumber: 2,
            container: ulElement,
          });
          liElementHasAnnotationNumber({
            liIndex: 3,
            annotationNumber: 2,
            container: ulElement,
          });

          //Change to Book of Mormon Translation
          await clickIconWithDropdown({ container: editListItem, user });
          await selectDropdownItem({
            type: 'Book of Mormon Translation',
            user,
            container: editListItem,
          });

          //Click 'Group' from the adjust icon
          editableButtons = getAllByTestId(newComponent, 'editable-edit-icon');
          expect(editableButtons.length).toBe(4);
          const adjustIcon = editableButtons[3] as HTMLElement;
          expect(adjustIcon).toBeInTheDocument();
          //await user.click(adjustIcon);
          await clickIconWithDropdown({ container: adjustIcon, user });
          //Click the checkbox
          const checkbox: HTMLInputElement = getByRole(adjustIcon, 'checkbox', {
            hidden: true,
          });
          expect(checkbox.checked).toBeFalsy();
          await user.click(checkbox);
          expect(checkbox.checked).toBeTruthy();

          //Make sure that it split into groups
          expect(getAllByRole(newComponent, 'list').length).toBe(3);
          expect(
            getByText(newComponent, 'Seer stone in a hat')
          ).toBeInTheDocument();

          //Go back to custom
          await clickIconWithDropdown({ container: editListItem, user });
          await selectDropdownItem({
            type: 'custom',
            user,
            container: editListItem,
          });
        },
        ...(await renderAndSelectPage(page)),
      });
    });

    it('should be able to add and delete new timeline to page', async () => {
      const page = pages[0] as EventPage;
      await addAndDeleteItemToPage({
        type: 'Timeline',
        page,
        callback: async ({ newComponent, user }) => {
          //Starts out with placeholder
          const placeholder = getByText(newComponent, 'Pick Timeline items');
          expect(placeholder).toBeInTheDocument();

          //Only has four editable icons
          const editableButtons = getAllByTestId(
            newComponent,
            'editable-edit-icon'
          );
          expect(editableButtons.length).toBe(4);

          //Select Book of Mormon
          const editIcon = editableButtons[2] as HTMLElement;
          await clickIconWithDropdown({ container: editIcon, user });
          await selectDropdownItem({
            type: 'Book of Mormon',
            user,
            container: editIcon,
          });

          const timelineList = getByRole(newComponent, 'list');
          expect(timelineList).toBeInTheDocument();
          expect(timelineList.childElementCount).toBe(8);

          //Check annotations
          liElementHasAnnotationNumber({
            liIndex: 7,
            annotationNumber: 7,
            container: timelineList,
          });
          liElementHasAnnotationNumber({
            liIndex: 1,
            annotationNumber: 2,
            container: timelineList,
          });
          liElementHasAnnotationNumber({
            liIndex: 3,
            annotationNumber: 2,
            container: timelineList,
          });

          expect(
            queryByText(
              timelineList.children[0] as HTMLElement,
              'Joseph obtains the plates with Emma from the hill.'
            )
          ).toBeInTheDocument();
          expect(
            queryByText(
              timelineList.children[0] as HTMLElement,
              'Sep, 22, 1827'
            )
          ).toBeInTheDocument();
          expect(
            queryByText(
              timelineList.children[7] as HTMLElement,
              'Oliver Cowdery arrives and begins acting as the primary translation scribe. The majority of the Book of Mormon is translated.'
            )
          ).toBeInTheDocument();
          expect(
            queryByText(
              timelineList.children[7] as HTMLElement,
              'Apr, 7, 1829 to Jun, 1, 1829'
            )
          ).toBeInTheDocument();
        },
        ...(await renderAndSelectPage(page)),
      });
    });
  });

  describe('EditTimelineItems', () => {
    it('should be able to select timeline category', async () => {
      await renderAndSelectTimelineCategory(categories[0] as TimelineCategory);
    });

    it('should be able to select page', async () => {
      const category = categories[0] as TimelineCategory;
      const { getByText, user, container } =
        await renderAndSelectTimelineCategory(category);

      const page = getPages().find((x) => x.id == category.pageId);
      if (!page) {
        fail('Could not find page');
      }

      const dropdown = getByText(page.url);
      expect(dropdown).toBeInTheDocument();
      await user.click(dropdown);
      await selectDropdownItem({ user, type: page.id, container });

      expect(dropdown.innerHTML).toContain(page.url);
    });

    it('should be able to delete timeline item', async () => {
      const category = categories[0] as TimelineCategory;
      const {
        getByTestId,
        user,
        queryByTestId: queryByTestIdLocal,
      } = await renderAndSelectTimelineCategory(category);
      const timelineItem = category.items[0] as RestorationTimelineItem;

      //Get the first timeline item and its editable buttons
      const timelineItemElement = getByTestId(
        `dirty-component-${timelineItem.id}`
      );
      const editableButtons = getAllByTestId(
        timelineItemElement,
        'editable-edit-icon'
      );
      //expect(editableButtons.length).toBe(2 * timelineItem.links.length + 1);

      //We should not have a delete state initially
      expect(
        queryByTestId(timelineItemElement, 'dirty-state-delete')
      ).not.toBeInTheDocument();
      expect(
        queryByText(timelineItemElement, 'Cancel')
      ).not.toBeInTheDocument();
      expect(queryByText(timelineItemElement, 'Save')).not.toBeInTheDocument();

      //Get the delete button and click it. We should now have the delete state
      const deleteButton = editableButtons[
        editableButtons.length - 1
      ] as HTMLElement;
      await user.click(deleteButton);
      expect(
        queryByTestId(timelineItemElement, 'dirty-state-delete')
      ).toBeInTheDocument();
      expect(queryByText(timelineItemElement, 'Cancel')).toBeInTheDocument();
      expect(queryByText(timelineItemElement, 'Save')).toBeInTheDocument();

      //Cancel this deletion. The delete state should be gone
      const cancelButton = getByText(timelineItemElement, 'Cancel');
      await user.click(cancelButton);
      expect(
        queryByTestId(timelineItemElement, 'dirty-state-delete')
      ).not.toBeInTheDocument();
      expect(
        queryByText(timelineItemElement, 'Cancel')
      ).not.toBeInTheDocument();
      expect(queryByText(timelineItemElement, 'Save')).not.toBeInTheDocument();

      //Delete again
      await user.click(deleteButton);
      expect(
        queryByTestId(timelineItemElement, 'dirty-state-delete')
      ).toBeInTheDocument();
      expect(queryByText(timelineItemElement, 'Cancel')).toBeInTheDocument();
      expect(queryByText(timelineItemElement, 'Save')).toBeInTheDocument();

      //Save this
      const saveButton = getByText(timelineItemElement, 'Save');
      await user.click(saveButton);
      expect(
        queryByTestIdLocal(`dirty-component-${timelineItem.id}`)
      ).not.toBeInTheDocument();
    });

    it('should be able to add timeline item', async () => {
      const category = categories[0] as TimelineCategory;
      const {
        getAllByRole,
        user,
        getAllByText,
        getByTestId,
        queryByTestId: queryByTestIdLocal,
      } = await renderAndSelectTimelineCategory(category);

      const dirtyComponentId = `dirty-component--${
        (category.items[category.items.length - 1]?.id ?? 0) + 1
      }`;
      const addTimelineItem = async ({
        addButton,
      }: {
        addButton: HTMLElement;
      }) => {
        await user.click(addButton);

        expect(getAllByRole('editable-timeline-item').length).toBe(
          category.items.length + 1
        );

        const newTimelineItemElement = getByTestId(dirtyComponentId);
        expect(
          queryByText(newTimelineItemElement, 'Cancel')
        ).not.toBeInTheDocument();
        expect(queryByText(newTimelineItemElement, 'Save')).toBeInTheDocument();

        return newTimelineItemElement;
      };

      //Each timeline item has a + button for the links, so the outside add button is what we want
      const addButtons = getAllByText('+');
      expect(addButtons.length).toBe(category.items.length + 1);
      const addButton = addButtons[category.items.length] as HTMLElement;

      let newTimelineItemElement = await addTimelineItem({ addButton });

      //Get the delete button on this new item
      const editableButtons = getAllByTestId(
        newTimelineItemElement,
        'editable-edit-icon'
      );
      expect(editableButtons.length).toBe(1);
      expect(
        queryByTestId(newTimelineItemElement, 'dirty-state-delete')
      ).not.toBeInTheDocument();

      //After clicking delete, the component should be gone
      const deleteButton = editableButtons[0] as HTMLElement;
      await user.click(deleteButton);
      expect(queryByTestIdLocal(dirtyComponentId)).not.toBeInTheDocument();

      //Add another item and delete then save it.
      newTimelineItemElement = await addTimelineItem({ addButton });
      const saveButton = getByText(newTimelineItemElement, 'Save');
      await user.click(saveButton);
      expect(
        queryByText(newTimelineItemElement, 'Cancel')
      ).not.toBeInTheDocument();
      expect(
        queryByText(newTimelineItemElement, 'Save')
      ).not.toBeInTheDocument();
    });
  });

  describe('Display Page', () => {
    it('should display page with header, paragraph, timeline, and list', () => {
      const page = pages[1] as EventPage;
      const user = userEvent.setup();
      expect(page).toBeTruthy();
      const { container, ...rest } = render(<RenderPage page={page} />);
      const { getByText } = rest;

      expect(getByText(page.title)).toBeInTheDocument();
      expect(getByText(page.description)).toBeInTheDocument();

      for (let i = 0; i < page.settings.length; i++) {
        const settingContainer = getByTestId(
          container,
          `custom-component-${i}`
        );
        expect(settingContainer).toBeInTheDocument();
        const setting = page.settings[i];
        if (!setting) {
          fail('Setting is undefined');
        }
        pageSettingTesters[setting.component]({
          setting,
          user,
          container: settingContainer,
          ...rest,
        });
      }
    });
  });
});
