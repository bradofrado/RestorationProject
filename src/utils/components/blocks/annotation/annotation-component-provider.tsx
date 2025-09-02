import { createContext, FC, ReactNode, useContext } from 'react';
import {
  Annotation as AnnotationComponent,
  AnnotationProps,
} from '../../Timeline/annotation';
import { EditableAnnotation } from './editable-annotation';
import { parseAnnotation } from './parse-annotation';
import { inlineAnnotationRegex } from './constants';

const AnnotationComponentContext = createContext<{
  Annotation: FC<AnnotationProps>;
}>({ Annotation: AnnotationComponent });

interface AnnotationComponentProviderProps {
  onChange: (annotation: string) => void;
  value: string;
  children: (props: { onBlur: (e: React.FocusEvent) => void }) => ReactNode;
}

export const AnnotationComponentProvider = ({
  children,
  value,
  onChange,
}: AnnotationComponentProviderProps) => {
  const onAnnotationEdit = (oldLinkIndex: number, annotation: string) => {
    const content = parseAnnotation(value);
    const newContent = content.replaceOccurance(
      inlineAnnotationRegex,
      `[${annotation}]`,
      oldLinkIndex
    );
    if (newContent !== value) {
      onChange(newContent);
    }
  };

  const onAnnotationDelete = (linkNumber: number) => {
    const content = parseAnnotation(value);
    const newContent = content.replaceOccurance(
      inlineAnnotationRegex,
      '',
      linkNumber
    );
    if (newContent !== value) {
      onChange(newContent);
    }
  };
  const Annotation = (props: AnnotationProps) => {
    return (
      <EditableAnnotation
        {...props}
        onEdit={(annotation) => onAnnotationEdit(Number(props.id), annotation)}
        onDelete={() => onAnnotationDelete(Number(props.id))}
      />
    );
  };

  const onAnnotationBlur = (e: React.FocusEvent) => {
    if (e.target.closest('[contenteditable="false"]')) return;

    const content = parseAnnotation(e.target.innerHTML).replaceAll(
      '&nbsp;',
      ' '
    );

    onChange(content);
  };

  return (
    <AnnotationComponentContext.Provider value={{ Annotation }}>
      {children({ onBlur: onAnnotationBlur })}
    </AnnotationComponentContext.Provider>
  );
};

export const useAnnotationComponent = () => {
  return useContext(AnnotationComponentContext);
};
