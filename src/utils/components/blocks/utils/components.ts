import { CarouselBlock } from '../carousel/carousel';
import { EditableCarouselBlock } from '../carousel/edit-carousel';
import { EditableFootnotesBlock } from '../footnotes/editable-footnotes';
import { FootnotesBlock } from '../footnotes/footnotes';
import { EditableHeaderBlock } from '../header/editable-header';
import { HeaderBlock } from '../header/header';
import { EditableImageBlock } from '../image/editable-image';
import { ImageBlock } from '../image/image';
import { ImageUploadModal } from '../image/image-upload-modal';
import { EditableListBlock } from '../list/editable-list';
import { ListBlock } from '../list/list';
import { EditableParagraphBlock } from '../paragraph/editable-paragraph';
import { ParagraphBlock } from '../paragraph/paragraph';
import { EditableQuoteBlock } from '../quote/editable-quote';
import { QuoteBlock } from '../quote/quote';
import { EditableTimelineBlock } from '../timeline/editable-timeline';
import { TimelineBlock } from '../timeline/timeline';
import { Component } from './types';

function createComponents<
  T extends readonly Component[] & Array<{ label: V }>,
  V extends string
>(...args: T) {
  return args;
}

export const components = createComponents(
  {
    label: 'Header',
    editable: EditableHeaderBlock,
    component: HeaderBlock,
  },
  {
    label: 'Paragraph',
    editable: EditableParagraphBlock,
    component: ParagraphBlock,
  },
  {
    label: 'Timeline',
    editable: EditableTimelineBlock,
    component: TimelineBlock,
  },
  {
    label: 'List',
    editable: EditableListBlock,
    component: ListBlock,
  },
  {
    label: 'Quote',
    editable: EditableQuoteBlock,
    component: QuoteBlock,
  },
  {
    label: 'Image',
    editable: EditableImageBlock,
    component: ImageBlock,
    confirmModal: ImageUploadModal,
  },
  {
    label: 'Carousel',
    editable: EditableCarouselBlock,
    component: CarouselBlock,
  },
  {
    label: 'Footnotes',
    editable: EditableFootnotesBlock,
    component: FootnotesBlock,
  }
);
