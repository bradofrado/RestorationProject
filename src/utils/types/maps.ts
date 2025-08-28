import { type StaticImageData } from 'next/image';
import mapNorthEastern from '~/assets/maps/north-eastern-us.jpg';

export type MapImage = {
  name: string;
  image: StaticImageData;
};

export const maps: MapImage[] = [
  {
    name: 'North Eastern America',
    image: mapNorthEastern,
  },
];
