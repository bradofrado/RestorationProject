export interface AnnotationProps {
  id?: string;
  link: string;
  linkNumber: number;
  linkToAnnotation?: boolean;
}
export const Annotation: React.FC<AnnotationProps> = ({
  link,
  linkNumber,
  linkToAnnotation = true,
}) => {
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
          <span className="relative top-[-7px] text-[0.75em]">
            [<span className="underline">{linkNumber}</span>]
          </span>
        </Component>
      </span>
    </>
  );
};
