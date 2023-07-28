import { Action, ActionComponentAdd, ActionComponentEdit, ActionError, ActionType } from "../types/action"
import {useComponentSettingsMutation} from '~/utils/services/EventPageService';
import {EventPage, ComponentSettings} from '~/utils/types/page';
import {useChangeProperty} from '~/utils/utils';
import { api } from "../api";

export const useCreateAction = () => {
    const createAction = api.action.createAction.useMutation();
    
    return createAction;
}

const usePageAction = (pages: EventPage[]) => {
	const {update, create} = useComponentSettingsMutation();
	const editComponent = useChangeProperty(update.mutate);

	const applyAction = (action: Action): EventPage[] | ActionError => {
		const applyEditComponent = (pages: EventPage[], action: ActionComponentEdit) => {
			const error = {error: 'Unable to edit componetn'};
			const payload = action.payload;
			const page = pages.find(x => x.id == payload.pageId);
			if (!page) {
				return error;
			}

			const componentIndex = page.settings.findIndex(x => x.id == payload.id);
			if (componentIndex < 0) {
				return error
			}

			const newComponent = editComponent(page.settings[componentIndex] as ComponentSettings, 'data', payload.data);
			page.settings[componentIndex] = newComponent;

			return pages;
		}

		const applyAddComponent = (pages: EventPage[], action: ActionComponentAdd) => {
			const error = {error: 'Unable to add component'};
			const payload = action.payload;
			const page = pages.find(x => x.id == payload.pageId);
			if (!page) {
				return error;
			}

			const settings = [...page.settings];
			create.mutate(action.payload);

			settings.push(action.payload);

			page.settings = settings;

			return pages;
		}

		if (action.type == ActionType.Edit) {
			return applyEditComponent(pages, action);
		} else if (action.type == ActionType.Add) {
			return applyAddComponent(pages, action);
		}

		return {error: "Invalid Action"};
	}

	return applyAction;
}