import { type Annotation as AnnotationType } from '~/utils/types/annotation';
import Popover from '../base/popover';
import { type FC } from 'react';

export interface AnnotationProps {
  id?: string;
  link: AnnotationType;
  linkNumber: number;
  linkToAnnotation?: boolean;
  portal?: boolean;
}
export const Annotation: React.FC<AnnotationProps> = ({
  link: { link, note },
  linkNumber,
  linkToAnnotation = true,
  portal = false,
}) => {
  if (note) {
    return (
      <Popover
        button={<AnnotationBase linkNumber={linkNumber} />}
        portal={portal}
      >
        <div data-annotation={JSON.stringify(link)} className="min-w-[200px]">
          {note} (
          <a className="text-blue-500 underline" href={link} target="_blank">
            link
          </a>
          )
        </div>
      </Popover>
    );
  }
  const Component = linkToAnnotation ? 'a' : 'span';
  return (
    <>
      <span className="relative font-normal" role="annotation">
        <Component
          className="no-underline"
          href={linkToAnnotation ? link : undefined}
          data-annotation={link}
          target="_blank"
        >
          <AnnotationBase linkNumber={linkNumber} />
        </Component>
      </span>
    </>
  );
};

export const AnnotationBase: FC<{ linkNumber: number }> = ({ linkNumber }) => {
  return (
    <span className="relative top-[-7px] text-[0.75em]">
      [<span className="underline">{linkNumber}</span>]
    </span>
  );
};
