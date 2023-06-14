import { useEventPagesMutation, useGetPage, useGetPageUrl } from "~/utils/services/EventPageService"; 
import { type EventPage } from "~/utils/types/page";
import {type ByRoleMatcher, getByRole, render, pages, mockPageService, mockTimelineService, categories} from '~/test/util';
import userEvent from '@testing-library/user-event';
import {EditPages, type EditPagesProps} from '~/pages/edit';
import { type ComponentType } from "~/utils/components/edit/add-component";
import { useGetCategories } from "~/utils/services/TimelineService";

const getCategories = () => categories;
const getPages = () => pages;

const getUrl = (pageId: string) => {
	return pageId;
}

jest.mock('src/utils/services/EventPageService', () => ({
    useEventPagesMutation: () => ({
        create: {
            mutate: (page: EventPage) => {return undefined},
            data: null
        },
        update: {
            mutate: (page: EventPage) => {return undefined},
            data: null
        },
        deletem: {
            mutate: (pageId: string) => {return undefined},
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
        setId: (id: string | undefined) => {return undefined}
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


const addAndDeleteItemToPage = async ({type, page, intermediate, ...rest}: AddItemToPageProps) => {
    const typeToRole: Record<ComponentType, ByRoleMatcher> = {
        "Header": "heading",
        "Paragraph": "paragraph",
        "List": "list",
        "Timeline": "list"
    }

    const {getByText, user, getByTestId, getAllByRole} = rest;
    const addButton = getByText(/\+/);
    expect(addButton).toBeInTheDocument();

    await user.click(addButton);
    
    const headerOption = getByTestId(`dropdown-item-${type}`);
    expect(headerOption).toBeInTheDocument();

    await user.click(headerOption);

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
            await addAndDeleteItemToPage({type: 'List', page, intermediate: async ({newComponent, user, getByTestId}) => {
                const editableButtons = newComponent.querySelectorAll('button');
                expect(editableButtons.length).toBe(3);

                const addListItem = editableButtons[2] as HTMLElement;
                expect(addListItem).toBeInTheDocument();
                await user.click(addListItem);

                // const customDropdownItem = getByTestId(`dropdown-item-custom`);
                // expect(customDropdownItem).toBeInTheDocument();
                // await user.click(customDropdownItem);
            }, ...await renderAndSelectPage(page)});
        })
    })
})

