import { type FC } from 'react';
import { type DataComponent } from '../utils/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../base/carousel';
import z from 'zod';
import { useParseSettings } from '../utils/parse-settings';
import { SettingsComponentSettingsSchema } from '../utils/settings-component';
import {
  ImageBlock,
  type ImageSettings,
  imageSettingsSchema,
} from '../image/image';

export const carouselSettingsSchema = SettingsComponentSettingsSchema.extend({
  images: z.array(
    z.object({
      url: z.string(),
      alt: z.string(),
    })
  ),
}).extend(imageSettingsSchema.shape);

export type CarouselSettings = z.infer<typeof carouselSettingsSchema>;

export const CarouselBlock: FC<DataComponent> = ({ data }) => {
  const settings = useParseSettings(data.properties, carouselSettingsSchema, {
    images: [],
    height: 200,
    margin: 0,
    color: '#000',
  });

  if (settings.images.length === 0) return <PlaceHolder />;

  return (
    <>
      <Carousel className="w-full">
        <CarouselContent>
          {settings.images.map(({ url, alt }, index) => (
            <CarouselItem key={index}>
              <ImageBlock
                data={{
                  content: url,
                  properties: JSON.stringify({
                    margin: settings.margin,
                    color: settings.color,
                    height: settings.height,
                    alt,
                  } satisfies ImageSettings),
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

const PlaceHolder: FC = () => {
  return <div className="rounded-md bg-gray-100 p-4">Select an Image</div>;
};
