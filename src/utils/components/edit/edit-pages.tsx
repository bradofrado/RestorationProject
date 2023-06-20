import Link from 'next/link';
import React from 'react';
import {useEffect, useState} from 'react';
import {type DropdownItem} from '~/utils/components/base/dropdown';
import Button from '~/utils/components/base/button';
import {useEventPagesMutation, useGetPages} from '~/utils/services/EventPageService';
import {type EventPage, type ComponentSettings, type EditableData} from '~/utils/types/page';
import Input from '~/utils/components/base/input';
import EditItemsButtons from '~/utils/components/edit/edit-items-buttons';
import Editable from '~/utils/components/edit/editable';
import AddComponent from '~/utils/components/edit/add-component';
import {type ComponentType, CustomComponents} from '~/utils/components/edit/add-component';
import Label from '~/utils/components/base/label';

export type EditPagesProps = {
	id: string | undefined,
	setId: (id: string | undefined) => void
}
export const EditPages = ({setId}: EditPagesProps) => {
	const [currPage, setCurrPage] = useState<EventPage>();
	const {create, update, deletem} = useEventPagesMutation();
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
				onAdd={onAddPage} onSave={onSave} onDelete={onDelete} onClear={onClear}/>
			{currPage && <>
			<div className="py-1">
				<Input include={Label} label="Url" value={currPage.url} onChange={onNameChange} className="ml-1 my-1"/>
				<Button as={Link} href={`/${currPage.url}`} className="ml-1">Go</Button>
			</div>
			<EditablePage page={currPage} setPage={setCurrPage} />
			</>}
		</div>	
	</>
}



const EditablePage = ({page, setPage}: {page: EventPage, setPage: (page: EventPage) => void}) => {
	const editSettings = (f: (settings: ComponentSettings[]) => void) => {
		const copy: EventPage = {...page};
		const settings = copy.settings.slice();
		f(settings);
		copy.settings = settings;
		setPage(copy);
	}

	const onAdd = (component: ComponentType) => {
		editSettings(components => components.push({component: component, data: {content: "custom", properties: null}, id: -1, pageId: ""}));
	}

	const onEdit = (data: EditableData, i: number) => {
		editSettings(components => (components[i] || {data: null}).data = data);
	}

	const deleteComponent = (index: number) => {
		editSettings(components => components.splice(index, 1))
	}
	return <>
			<Editable as="h1" className="mx-auto text-3xl font-bold my-5 text-bom" onBlur={(e: React.FocusEvent<HTMLHeadingElement>) => setPage({...page, title: e.target.innerHTML})}>
				{page.title}
			</Editable>
			<Editable as="p" onBlur={(e: React.FocusEvent<HTMLParagraphElement>) => setPage({...page, description: e.target.innerHTML})}>
				{page.description}
			</Editable>
			<CustomComponents items={page.settings.map((editable: ComponentSettings, i: number) => ({editable: true, type: editable.component, onDelete: () => deleteComponent(i), onEdit: (data: EditableData) => onEdit(data, i), data: editable.data}))}/>
			<AddComponent onAdd={onAdd}/>
	</>
}