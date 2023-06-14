import { useEventPagesMutation, useGetPage, useGetPageUrl } from "~/utils/services/EventPageService"; 
import { type EventPage } from "~/utils/types/page";
import {type ByRoleMatcher, getByRole, getByTestId as getByTestIdGlobal, render, pages, categories, getByText, getAllByRole, getAllByTestId, queryByRole} from '~/test/util';
import userEvent from '@testing-library/user-event';
import {EditPages, type EditPagesProps} from '~/pages/edit';
import { type ComponentType } from "~/utils/components/edit/add-component";
import { useGetCategories } from "~/utils/services/TimelineService";
import { type UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

const getCategories = () => categories;
const getPages = () => pages;

const getUrl = (pageId: string) => {
	return pageId;
}

jest.mock('src/utils/services/EventPageService', () => ({
    useEventPagesMutation: () => ({
        create: {
            mutate: () => {return undefined},
            data: null
        },
        update: {
            mutate: () => {return undefined},
            data: null
        },
        deletem: {
            mutate: () => {return undefined},
            data: null
        }
    }),
	useGetPages: () => ({
		data: getPages(),
		isLoading: false,
		isError: false
	}),
    useGetPageUrl: () => ({
		isLoading: false,
		isError: false,
		data: getUrl
	})
}))

jest.mock('src/utils/services/TimelineService', () => ({
    useGetCategories: () => ({
        isLoading: false,
        isError: false,
        data: getCategories()
    })
}))

const renderPage = (props?: EditPagesProps) => {
	const defaultProps: EditPagesProps = {
		id: "0",
        setId: () => {return undefined}
	}
	return {
		user: userEvent.setup(),
		...render(
			<EditPages {...defaultProps} {...props}/>
		)
	}
}

const renderAndSelectPage = async (page: EventPage) => {
    const props = renderPage();
    const {user, getByText, queryByText, getByRole, getAllByRole} = props;

    const dropdown = getByText('select');
    expect(dropdown).toBeInTheDocument();

    expect(queryByText(page.url)).toBeFalsy();
    await user.click(dropdown);

    const dropdownItem = getByText(page.url);

    expect(dropdownItem).toBeInTheDocument();

    await user.click(dropdownItem);

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByText(page.title)).toBeInTheDocument();
    expect(getByText(page.description)).toBeInTheDocument();
    expect(getAllByRole('custom-component-editable').length).toBe(page.settings.length);

    return props;
}

type RenderProps = Awaited<ReturnType<typeof renderAndSelectPage>>;
interface AddItemToPageProps extends RenderProps  {
    type: ComponentType,
    page: EventPage,
    intermediate?: (props: {newComponent: HTMLElement} & RenderProps) => Promise<void>
}

interface SelectionDropdownItemProps {
    type: string, 
    user: UserEvent, 
    container: HTMLElement
}
const selectDropdownItem = async ({type, user, container}: SelectionDropdownItemProps) => {
    expect(container).toBeInTheDocument();
    const dropdownItem = getByTestIdGlobal(container, `dropdown-item-${type}`);
    expect(dropdownItem).toBeInTheDocument();
    await user.click(dropdownItem);
}

const addAndDeleteItemToPage = async ({type, page, intermediate, ...rest}: AddItemToPageProps) => {
    const typeToRole: Record<ComponentType, ByRoleMatcher> = {
        "Header": "heading",
        "Paragraph": "paragraph",
        "List": "list",
        "Timeline": "list"
    }

    const {getByText, user, getAllByRole} = rest;
    const addButton = getByText(/\+/);
    expect(addButton).toBeInTheDocument();

    await user.click(addButton);
    
    await selectDropdownItem({type, container: rest.container, user});
    
    const allItems = getAllByRole('custom-component-editable');
    expect(allItems.length).toBe(page.settings.length + 1);
    const newComponent = allItems[allItems.length - 1] as HTMLElement;

    intermediate && await intermediate({newComponent, ...rest});

    expect(getByRole(newComponent, typeToRole[type])).toBeInTheDocument();

    await user.hover(newComponent);

    const deleteButton = newComponent.querySelector('button');
    if (!deleteButton) {
        fail('Could not find delete button');
    }
    expect(deleteButton).toBeInTheDocument();

    await user.click(deleteButton);

    expect(getAllByRole('custom-component-editable').length).toBe(page.settings.length);

    return rest;
}

describe('Edit page', () => {
    describe('EditPages', () => {
        it('should be able to select page', async () => {
            await renderAndSelectPage(pages[0] as EventPage);
        })

        it('should be able to add and delete new header to page', async () => {
            const page = pages[0] as EventPage;
            await addAndDeleteItemToPage({type: 'Header', page, ...await renderAndSelectPage(page)})
        })

        it('should be able to add and delete new paragraph to page', async () => {
            const page = pages[0] as EventPage;
            await addAndDeleteItemToPage({type: 'Paragraph', page, ...await renderAndSelectPage(page)});
        })

        it('should be able to add and delete new list to page', async () => {
            const page = pages[0] as EventPage;
            await addAndDeleteItemToPage({type: 'List', page, intermediate: async ({newComponent, user}) => {
                const clickIconWithDropdown = async (props: {container: HTMLElement, user: UserEvent}) => {
                    const {container} = props;
                    expect(container).toBeInTheDocument();
                    const containerButton = container.querySelector('button');
                    if (!containerButton) {
                        fail('Edit list item should have button');
                    }
                    await user.click(containerButton);
                }

                const liElementHasAnnotationNumber = (props: {liIndex: number, annotationNumber: number}) => {
                    const {liIndex, annotationNumber} = props;

                    const firstBOMItem = ulElement.children[liIndex] as HTMLElement;
                    expect(firstBOMItem).toBeInTheDocument();
                    const annotation = getByRole(firstBOMItem, 'annotation');
                    expect(annotation).toBeInTheDocument();
                    expect(getByText(annotation, `${annotationNumber}`));
                }

                let editableButtons = getAllByTestId(newComponent, 'editable-edit-icon');
                expect(editableButtons.length).toBe(3);
                expect(queryByRole(newComponent, 'list')).toBeFalsy();

                //Add a list item
                const addListItem = editableButtons[2] as HTMLElement;
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
                const editListItem = editableButtons[1] as HTMLElement;
                await clickIconWithDropdown({container: editListItem, user});
                expect(getAllByRole(editListItem, 'menuitem', {hidden: true}).length).toBe(3);
                await selectDropdownItem({type: 'Book of Mormon', user, container: editListItem});

                //Make sure we have all the timeline items
                ulElement = getByRole(newComponent, 'list');
                expect(ulElement).toBeInTheDocument();
                expect(ulElement.childElementCount).toBe(8);

                //Check annotations
                liElementHasAnnotationNumber({liIndex: 7, annotationNumber: 7});
                liElementHasAnnotationNumber({liIndex: 1, annotationNumber: 2});
                liElementHasAnnotationNumber({liIndex: 3, annotationNumber: 2});

                //Change to Book of Mormon Translation
                await clickIconWithDropdown({container: editListItem, user});
                await selectDropdownItem({type: 'Book of Mormon Translation', user, container: editListItem});

                //Click 'Group' from the adjust icon
                editableButtons = getAllByTestId(newComponent, 'editable-edit-icon');
                expect(editableButtons.length).toBe(3);
                const adjustIcon = editableButtons[2] as HTMLElement;
                expect(adjustIcon).toBeInTheDocument();
                await user.click(adjustIcon);
                await clickIconWithDropdown({container: adjustIcon, user});
                await selectDropdownItem({type: 'group', user, container: adjustIcon});

                //Make sure that it split into groups
                expect(getAllByRole(newComponent, 'list').length).toBe(3);
                expect(getByText(newComponent, 'Seer stone in a hat')).toBeInTheDocument();

                //Go back to custom
                await clickIconWithDropdown({container: editListItem, user});
                await selectDropdownItem({type: 'custom', user, container: editListItem});
            }, ...await renderAndSelectPage(page)});
        })
    })
})

