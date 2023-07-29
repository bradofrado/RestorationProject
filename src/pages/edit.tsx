import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import TabControl, { type TabItem } from "~/utils/components/base/tab";
import {requireRole, defaultGetServerProps} from '~/utils/components/page/protected-routes-hoc';
import { EditPages } from "~/utils/components/edit/edit-pages";
import { EditTimelineItems } from "~/utils/components/edit/edit-timeline-items";
import { Layout } from "~/utils/components/page/layout";

export const getServerSideProps = requireRole('edit')(defaultGetServerProps);

const Edit_page: NextPage = () => {
	const router = useRouter();
	
	const {id} = router.query;

	if (!router.isReady) {
		return <div>Loading...</div>
	}

	const setRoute = (id: string | undefined) => {
		id ? void router.push(`${router.basePath}?id=${id}`) : void router.push(`${router.basePath}`);
	}

	const tabItems: TabItem[] = [
		{
			label: "Page Items",
			component: <EditPages setId={setRoute} id={Array.isArray(id) ? id[0] : id}/>
		},
		{
			label: "Timeline Items",
			component: <EditTimelineItems/>,
		}
	]
	return <Layout>
		<div className="max-w-4xl px-4 mx-auto sm:px-24 mb-10 w-full">
			<Link href="/timeline" className="text-xs italic font-bold text-gray-600 no-underline uppercase hover:text-gray-800">&lt; Back to timeline</Link>
			<TabControl items={tabItems} className="w-full px-2 py-6 sm:px-0"/>
		</div>
	</Layout>
}

export default Edit_page;