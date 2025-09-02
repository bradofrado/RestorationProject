import { type EventPage } from '~/utils/types/page';
import { RenderBlocks } from '../blocks/render-blocks';

interface RenderPageProps {
  page: EventPage;
}
export const RenderPage = ({ page }: RenderPageProps) => {
  const { settings } = page;
  return (
    <div className="w-full px-2 py-6 sm:px-0">
      <RenderBlocks
        items={settings.map((setting, i) => ({
          type: setting.component,
          data: setting.data,
          id: i,
        }))}
      />
    </div>
  );
};
