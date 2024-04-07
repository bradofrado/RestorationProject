import { useState } from "react"
import { RestorationTimelineItem, TimelineCategory } from "~/utils/types/timeline"
import { TimelineCategoryFilter } from "../Timeline/Timeline";
import { Annotation } from "../Timeline/CondensedTimeline";
import { AnnotationLinkProvider, useAnnotationLink } from "../edit/add-component";

interface MapProps {
    categories: TimelineCategory[]
}
export const Map: React.FunctionComponent<MapProps> = ({categories}) => {
    const [hoveredItem, setHoveredItem] = useState<RestorationTimelineItem>();
    const [filteredCategories, setFilteredCategories] = useState<TimelineCategory['id'][]>([]);
    const items = categories.filter(category => !filteredCategories.includes(category.id)).reduce<(RestorationTimelineItem & {category: TimelineCategory})[]>((prev, curr) => prev.concat(curr.items.map(item => ({...item, category: curr}))), [])
    const [filteredIds, setFilteredIds] = useState<number[]>([]);

    const filtered = filteredIds.length > 0 ? items.filter(item => filteredIds.includes(item.id)) : items;

    const onSelect = (item: RestorationTimelineItem): void => {
        const copy = filteredIds.slice();
        const index = copy.indexOf(item.id);
        if (index > -1) {
            copy.splice(index, 1);
        } else {
            copy.push(item.id);
        }
        setFilteredIds(copy);
    }

    const onCategoryClick = (i: TimelineCategory['id']) => {
		const copy = filteredCategories.slice();
		const index = copy.indexOf(i);
		if (index >= 0) {
			copy.splice(index, 1);
		} else {
			copy.push(i);
		}
		setFilteredCategories(copy);
	}

    return (
        <AnnotationLinkProvider>
            <div className="flex justify-start">
                <EventList items={filtered} hoveredId={hoveredItem?.id}/>
                <div className="relative h-fit">
                    {items.map(item => item.x && item.y ? <div key={item.id} className={`h-3 w-3 rounded-full absolute -translate-x-1/2 -translate-y-1/2 transition-all ease-in-out hover:cursor-pointer ${filteredIds.includes(item.id) ? 'scale-[200%]' : 'hover:scale-[150%]'}`} style={{left: `${item.x * 100}%`, top: `${item.y * 100}%`, backgroundColor: item.category.color}} onMouseEnter={() => setHoveredItem(item)} onMouseLeave={() => setHoveredItem(undefined)} onClick={() => onSelect(item)}>    
                        </div> : null)}
                    <img src="/map-israel.gif" />
                </div>
                <div>
                    <TimelineCategoryFilter categories={categories} filtered={filteredCategories} onChange={onCategoryClick} filterKey="id"/>
                </div>
            </div>
        </AnnotationLinkProvider>
    )
}

const EventList: React.FunctionComponent<{items: (RestorationTimelineItem & {category: TimelineCategory})[], hoveredId: number | undefined}> = ({items, hoveredId}) => {
    const {annotate} = useAnnotationLink();
    return (
        <div className="flex flex-col gap-2 flex-1">
            {items.map(item => item.x && item.y ? <div key={item.id} className="flex items-center justify-start gap-2">
                <div className="h-3 w-3 rounded-full" style={{backgroundColor: item.category.color}}/>
                <div className={`text-sm ${item.id === hoveredId ? 'font-semibold' : ''}`}>{item.text} {item.links.map((link, i) => <Annotation key={i} link={link} id={annotate(link)}/>)}</div>
            </div> : null)}
        </div>
    )
}