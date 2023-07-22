import Link from 'next/link';
import React from 'react';
import {useEffect, useState} from 'react';
import {type DropdownItem} from '~/utils/components/base/dropdown';
import Button from '~/utils/components/base/button';
import {useComponentSettingsMutation, useEventPagesMutation, useGetPages} from '~/utils/services/EventPageService';
import {type EventPage, type ComponentSettings, type EditableData} from '~/utils/types/page';
import Input from '~/utils/components/base/input';
import EditItemsButtons from '~/utils/components/edit/edit-items-buttons';
import Editable from '~/utils/components/edit/editable';
import AddComponent, { type EditableComponentType } from '~/utils/components/edit/add-component';
import {type ComponentType, CustomComponents} from '~/utils/components/edit/add-component';
import Label from '~/utils/components/base/label';

export type EditPagesProps = {
	id: string | undefined,
	setId: (id: string | undefined) => void
}
export const EditPages = ({setId}: EditPagesProps) => {
	const [currPage, setCurrPage] = useState<EventPage>();
	const {create, update, deletem} = useEventPagesMutation();
	const {create: createSetting, update: updateSetting, deletem: deleteSetting, reorder: reorderSetting} = useComponentSettingsMutation();
	const query = useGetPages();

	let pages: EventPage[] | null = null;

	useEffect(() => {
		const data = create.data || update.data;
		if (data) {
			setId(data.id);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [create.data, update.data])

	if (query.isLoading) {
		return <div>Loading...</div>
	}

	if (query.isError) {
		return <div>Error: {query.error.message}</div>
	}
	
	pages = query.data;
	const items: DropdownItem<string>[] = pages.map(page => ({name: page.url, id: page.id }));

	const onChange = (item: DropdownItem<string>, index: number) => {
		setId(item.id);
		setCurrPage(pages && pages[index] || undefined);
	}

	const onAddPage = () => {
		setCurrPage({id: '', url: "new-url", title: "Book of Mormon Translation", description: "Text", settings: []});
	}

	const onSave = (isNew: boolean) => {
		if (currPage) {
			isNew ? create.mutate(currPage) : update.mutate(currPage)
			setId(currPage.id);
			alert("Page saved!")
		}
	}

	const onDelete = (isNew: boolean) => {
		if (currPage && !isNew) {
			deletem.mutate(currPage.id);
			setCurrPage(undefined);
			setId(undefined);
		}
	}

	const onClear = () => {
		setCurrPage(undefined);
	}

	const onNameChange = (value: string) => {
		if (currPage == undefined) return;
		const copy: EventPage = {...currPage};
		copy.url = value;
		setCurrPage(copy);
	}

	return <>
		<div>
			<EditItemsButtons items={items} value={currPage?.id} onChange={onChange}
				onAdd={onAddPage} onSave={onSave} onDelete={onDelete} onClear={onClear}>
				{({isNew}) => <>
						{currPage && <>
						<div className="py-1">
							<Input include={Label} label="Url" value={currPage.url} onChange={onNameChange} className="ml-1 my-1"/>
							<Button as={Link} href={`/${currPage.url}`} className="ml-1">Go</Button>
						</div>
						<EditablePage page={currPage} setPage={setCurrPage} isNew={isNew} 
							createSetting={createSetting.mutate} updateSetting={updateSetting.mutate} 
							deleteSetting={deleteSetting.mutate} reorderSettings={reorderSetting.mutate}
						/>
						</>}
					</>}
			</EditItemsButtons>
			
		</div>	
	</>
}

type ReorderSettingsParam = Pick<ComponentSettings, 'id' | 'order'>[]
type EditablePageProps = {
	page: EventPage, 
	setPage: (page: EventPage) => void, 
	isNew: boolean,
	createSetting: (setting: ComponentSettings) => void,
	updateSetting: (setting: ComponentSettings) => void,
	deleteSetting: (id: number) => void,
	reorderSettings: (params: ReorderSettingsParam) => void,
}
const EditablePage = ({page, setPage, isNew, createSetting, updateSetting, deleteSetting, reorderSettings}: EditablePageProps) => {
	const editSettings = (f: (settings: ComponentSettings[]) => void) => {
		const copy: EventPage = {...page};
		const settings = copy.settings.slice();
		f(settings);
		copy.settings = settings;
		setPage(copy);

		return copy;
	}

	const onAdd = (component: ComponentType) => {
		const maxId = page.settings.length > 0 ? 
			Math.max(...page.settings.map(x => Math.abs(x.id))) :
			0;
		editSettings(components => components.push({
			component, 
			data: {
				content: "custom", 
				properties: null
			}, 
			id: -1 * (maxId + 1), 
			pageId: page.id, 
			order: components.length
		}));
	}

	const onEdit = (data: EditableData, id: number) => {
		const page = editSettings(components => {
			const component = components.find(x => x.id == id);
			(component || {data: null}).data = data;
		});
		const setting = page.settings.find(x => x.id == id);
		if (!setting) {
			throw new Error("Cannot update setting");
		}
		if (setting.id >= 0) {
			!isNew && updateSetting(setting);
		} else {
			!isNew && createSetting(setting);
		}
	}

	const deleteComponent = (id: number) => {
		const index = page.settings.findIndex(x => x.id == id);
		if (index < -1) {
			throw new Error(`Cannot delete setting ${id}`);
		}
		editSettings(components => components.splice(index, 1));
		const setting = page.settings[index];
		if (!setting) {
			throw new Error("Cannot delete setting");
		}
		!isNew && setting.id >= 0 && deleteSetting(setting.id);
	}
	
	const onReorder = (items: EditableComponentType[]) => {
		const updateComponents = (components: ComponentSettings[]) => {
			for (let i = 0; i < items.length; i++) {
				const item = items[i] as EditableComponentType;
				const component = components.find(settings => settings.id == item.id);
				if (!component) {
					throw new Error(`Error updating reorder of component ${item.id}`);
				}
				component.order = i;
			}
		}
		const page = editSettings(updateComponents);
		!isNew && reorderSettings(page.settings);
	}

	const settings = page.settings;//.slice().sort((a, b) => a.order - b.order);
	return <>
			<Editable as="h1" className="mx-auto text-3xl font-bold my-5 text-bom" onBlur={(e: React.FocusEvent<HTMLHeadingElement>) => setPage({...page, title: e.target.innerHTML})}>
				{page.title}
			</Editable>
			<Editable as="p" onBlur={(e: React.FocusEvent<HTMLParagraphElement>) => setPage({...page, description: e.target.innerHTML})}>
				{page.description}
			</Editable>
			<CustomComponents isNew={isNew} editable={true} onReorder={onReorder}
				items={settings.map((editable: ComponentSettings) => ({id: editable.id, type: editable.component, onDelete: () => deleteComponent(editable.id), onEdit: (data: EditableData) => onEdit(data, editable.id), data: editable.data}))}/>
			<AddComponent onAdd={onAdd}/>
	</>
}