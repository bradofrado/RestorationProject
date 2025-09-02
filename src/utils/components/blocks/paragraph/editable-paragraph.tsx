import Popover, { PopoverIcon } from '../../base/popover';
import { ButtonIcon, EditableComponent } from '../../edit/editable';
import { AdjustIcon } from '../../icons/icons';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentCallout } from '../utils/settings-callout';
import {
  SettingsComponentSettings,
  SettingsComponentSettingsSchema,
} from '../utils/settings-component';
import { EditableDataComponent } from '../utils/types';
import { EditableComponentContainer } from '../utils/editable-component-container';
import { inlineAnnotationRegex, ParagraphBlock } from './paragraph';
import { FC } from 'react';
import { AnnotationComponentProvider } from '../../event-page/annotation-provider';
import { Annotation, AnnotationProps } from '../../Timeline/annotation';
import Input from '../../base/input';
import Button from '../../base/buttons/button';
import { TrashIcon } from '@heroicons/react/outline';
import Label from '../../base/label';

export const EditableParagraphBlock: FC<EditableDataComponent> = ({
  onEdit,
  data,
  ...rest
}) => {
  const settings = useParseSettings(
    data.properties,
    SettingsComponentSettingsSchema,
    {}
  );
  const parseAnnotation = (content: string) => {
    const contents = content.replaceWith(
      /\<div .*? data-annotation="(.*?)".*?<\/div>/g,
      (match) => `[${match[1]}]`
    );

    return contents.join('');
  };

  const onBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
    if (e.target.closest('[contenteditable="false"]')) return;

    const content = parseAnnotation(e.target.innerHTML).replaceAll(
      '&nbsp;',
      ' '
    );
    if (content !== data?.content) {
      onEdit({ content, properties: data.properties });
    }
  };

  const onAnnotationEdit = (oldLinkIndex: number, annotation: string) => {
    const content = parseAnnotation(data.content);
    const newContent = content.replaceOccurance(
      inlineAnnotationRegex,
      `[${annotation}]`,
      oldLinkIndex
    );
    if (newContent !== data.content) {
      onEdit({ content: newContent, properties: data.properties });
    }
  };

  const onAnnotationDelete = (linkNumber: number) => {
    const content = parseAnnotation(data.content);
    const newContent = content.replaceOccurance(
      inlineAnnotationRegex,
      '',
      linkNumber
    );
    if (newContent !== data.content) {
      onEdit({ content: newContent, properties: data.properties });
    }
  };

  const icons: ButtonIcon[] = [
    <PopoverIcon icon={AdjustIcon} key={0}>
      <ParagraphSettingsCallout
        data={settings}
        onEdit={(settings) =>
          onEdit({
            content: data.content,
            properties: JSON.stringify(settings),
          })
        }
      />
    </PopoverIcon>,
  ];

  const Annotation = (props: AnnotationProps) => {
    return (
      <EditableAnnotation
        {...props}
        onEdit={(annotation) => onAnnotationEdit(Number(props.id), annotation)}
        onDelete={() => onAnnotationDelete(Number(props.id))}
      />
    );
  };

  return (
    <AnnotationComponentProvider Annotation={Annotation}>
      <EditableComponentContainer
        as={ParagraphBlock}
        role="paragraph"
        data={data}
        icons={icons}
        onBlur={onBlur}
        {...rest}
      />
    </AnnotationComponentProvider>
  );
};

interface EditableAnnotationProps extends AnnotationProps {
  onEdit: (annotation: string) => void;
  onDelete: () => void;
}

const EditableAnnotation: FC<EditableAnnotationProps> = ({
  onEdit,
  onDelete,
  ...rest
}) => {
  return (
    <Popover button={<Annotation {...rest} linkToAnnotation={false} />}>
      <Input value={rest.link} include={Label} label="Link" onBlur={onEdit} />
      <Button className="mt-2" onClick={onDelete} mode="secondary">
        <TrashIcon className="h-5 w-5" />
      </Button>
    </Popover>
  );
};

const ParagraphSettingsCallout: EditableComponent<
  SettingsComponentSettings
> = ({ data, onEdit }) => {
  return (
    <>
      <SettingsComponentCallout data={data} onEdit={onEdit} />
    </>
  );
};
