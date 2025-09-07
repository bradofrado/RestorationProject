import { decode } from 'entities';

export const parseAnnotation = (content: string) => {
  const contents = decode(content).replaceWith(
    /\<div .*? data-annotation="(.*?)" .*?<\/div>/g,
    (match) => `[${match[1]}]`
  );

  return contents.join('');
};
