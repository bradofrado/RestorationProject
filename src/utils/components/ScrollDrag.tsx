import { useRef, useState } from "react";

interface ScrollDragProps extends React.PropsWithChildren {
	rootClass: string | undefined,
}

interface ScrollPosition {
	left: number,
	x: number,
}

const ScrollDrag: React.FC<ScrollDragProps> = (props: ScrollDragProps) => {
	const [isScrolling, setIsScrolling] = useState(false);
	const [pos, setPos] = useState<ScrollPosition>({left: 0, x: 0});
	const ref = useRef<HTMLDivElement>(null);

	const {rootClass, children} = props;
	const onMouseDown = (e: React.MouseEvent) => {
		setPos({
			left: ref.current?.scrollLeft || 0,
			x: e.clientX,
		});
		setIsScrolling(true);
		ref.current && (ref.current.style.cursor = 'grabbing');
    ref.current && (ref.current.style.userSelect = 'none');
	}

	const onMouseUp = () => {
		setIsScrolling(false);
		ref.current && (ref.current.style.cursor = 'grab');
    ref.current?.style.removeProperty('user-select');
	}

	const onMouseMove = (e: React.MouseEvent) => {
		if (isScrolling) {
			// How far the mouse has been moved
			const dx = e.clientX - pos.x;
			
			ref.current && (ref.current.scrollLeft = pos.left - dx);
		}
	}
	return <div ref={ref} 
						onMouseDown={onMouseDown} 
						onMouseUp={onMouseUp} 
						onMouseMove={onMouseMove} 
						className={rootClass}>{children}</div>
}

export default ScrollDrag;