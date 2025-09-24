import { type NextPage } from 'next';
import { EditTabs } from '../edit-tabs';
import { requireAuth } from '~/utils/components/page/protected-routes-hoc';

const EditEssaysPage: NextPage = requireAuth(() => {
  return <EditTabs tab="page" />;
});

export default EditEssaysPage;
