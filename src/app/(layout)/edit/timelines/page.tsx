import { type NextPage } from 'next';
import { EditTabs } from '../edit-tabs';
import { requireAuth } from '~/utils/components/page/protected-routes-hoc';

const EditTimelinesPage: NextPage = requireAuth(() => {
  return <EditTabs tab="timeline" />;
});

export default EditTimelinesPage;
