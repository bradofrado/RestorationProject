import { type RestorationTimelineItem } from '~/utils/types/timeline';
import { DateFormat } from '~/utils/utils';
import { type HexColor } from '~/utils/types/colors';
import { useEffect, useMemo, useRef } from 'react';
import { useAnnotationLink } from '../event-page/annotation-provider';
import { Annotation } from './annotation';

export interface CondensedTimelineProps {
  items: RestorationTimelineItem[];
  className?: string;
  color?: HexColor;
}

const CondensedTimeline: React.FC<CondensedTimelineProps> = ({
  items,
  className,
  color,
}: CondensedTimelineProps) => {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (color) {
      ref.current?.style.setProperty('--bom-color', color);
    }
  }, [color]);
  return (
    <>
      <ul
        className={`condensed-timeline-container ${className || ''}`}
        ref={ref}
      >
        {items.map((item, i) => (
          <TimelineRow item={item} key={i} />
        ))}
      </ul>
    </>
  );
};

interface TimelineRowProps {
  item: RestorationTimelineItem;
}
const TimelineRow: React.FC<TimelineRowProps> = ({
  item,
}: TimelineRowProps) => {
  const { annotate } = useAnnotationLink();
  const date = useMemo(() => {
    if (!item.date) return null;

    if (item.type === 'EXACT') {
      return DateFormat.fullTextRange(item.date, item.endDate);
    }

    if (item.type === 'ESTIMATE_MONTH') {
      return DateFormat.estimateMonth(item.date);
    }

    if (item.type === 'ESTIMATE_YEAR') {
      return DateFormat.estimateYear(item.date);
    }
  }, [item.date, item.endDate, item.type]);

  if (!date) return <></>;

  return (
    <>
      <li className="condensed-timeline-row">
        <div className="condensed-timeline-row-label">
          <p className="md:text-xl">{date}</p>
        </div>
        <div className="condensed-timeline-row-content">
          <p className="md:text-xl">
            <span>{item.text}</span>
            <span>
              {item.links.map((link, i) => (
                <Annotation link={link} key={i} linkNumber={annotate(link)} />
              ))}
            </span>
          </p>
        </div>
      </li>
    </>
  );
};

export default CondensedTimeline;
