import {ComponentSettings, EditableData} from '~/utils/types/page';

export interface ActionError {
	error: string
}

export enum ActionType {
	Add='add',
	Edit='edit',
	Delete='delete'
}

export enum ActionScope {
	Page='page',
	Component='component',
	Category='category',
	TimelineItem='timelineItem'
}

interface PageActionEdit {
	type: ActionType.Edit,
	payload: EditableData,
	id: number
}

interface PageActionAdd {
	type: ActionType.Add,
	payload: EditableData
}

interface PageActionDelete {
	type: ActionType.Delete,
	id: number
}

type ActionBase = {
	scope: ActionScope,
	type: ActionType,
	id?: number
}


export type ActionComponentEdit = {
	scope: ActionScope.Component,
	type: ActionType.Edit,
	payload: ComponentSettings,
}

export type ActionComponentAdd = {
	scope: ActionScope.Component,
	type: ActionType.Add,
	payload: ComponentSettings
}

export type ActionComponent = ActionComponentEdit | ActionComponentAdd;


export type Action = ActionComponent