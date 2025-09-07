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
  link: annotation,
  linkNumber,
  linkToAnnotation = true,
  portal = false,
}) => {
  if (annotation.note) {
    return (
      <Popover
        button={<AnnotationBase linkNumber={linkNumber} link={annotation} />}
        portal={portal}
      >
        <div className="min-w-[200px]">
          {annotation.note} (
          <a
            className="text-blue-500 underline"
            href={annotation.link}
            target="_blank"
          >
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
          href={linkToAnnotation ? annotation.link : undefined}
          target="_blank"
        >
          <AnnotationBase linkNumber={linkNumber} link={annotation} />
        </Component>
      </span>
    </>
  );
};

export const AnnotationBase: FC<{
  linkNumber: number;
  link: AnnotationType;
}> = ({ linkNumber, link }) => {
  return (
    <span
      data-annotation={JSON.stringify(link)}
      className="relative top-[-7px] text-[0.75em]"
    >
      [<span className="underline">{linkNumber}</span>]
    </span>
  );
};
