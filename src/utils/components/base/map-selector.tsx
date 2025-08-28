import Image from 'next/image';
import { type FC } from 'react';
import { type MapImage, maps } from '~/utils/types/maps';

interface MapSelectorProps {
  value: string | null | undefined;
  onChange: (value: MapImage) => void;
}

export const MapSelector: FC<MapSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-row gap-2">
      {maps.map((map) => (
        <button
          className={`${value === map.name ? 'border-2 border-primary' : ''}`}
          key={map.name}
          onClick={() => onChange(map)}
        >
          <Image src={map.image} alt={map.name} width={100} height={100} />
        </button>
      ))}
    </div>
  );
};
