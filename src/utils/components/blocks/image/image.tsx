import { FC } from 'react';
import { DataComponent } from '../utils/types';
import z from 'zod';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import { useParseSettings } from '../utils/parse-settings';

export const imageSettingsSchema = SettingsComponentSettingsSchema.extend({
  alt: z.optional(z.string()),
  height: z.coerce.number(),
});
export type ImageSettings = z.infer<typeof imageSettingsSchema>;

export const ImageBlock: FC<DataComponent> = ({ data }) => {
  const settings = useParseSettings(data.properties, imageSettingsSchema, {
    alt: 'Image',
    height: 200,
  });
  if (!data.content || data.content === 'custom')
    return <div className="rounded-md bg-gray-100 p-4">No image</div>;
  return (
    <div className="py-2" style={{ height: settings.height }}>
      <img
        className="mx-auto h-full"
        src={data.content}
        alt={settings.alt ?? ''}
      />
    </div>
  );
};
