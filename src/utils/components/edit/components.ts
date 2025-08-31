import z from 'zod';

const componentsTypes = ['Header', 'Paragraph', 'Timeline', 'List'] as const;

export type ComponentType = (typeof componentsTypes)[number];
export const ComponentTypeSchema = z.custom<ComponentType>((val) => {
  return (componentsTypes as ReadonlyArray<string>).includes(val as string);
});
