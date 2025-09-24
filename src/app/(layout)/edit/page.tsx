import { type NextPage } from 'next';
import { redirect } from 'next/navigation';
import { requireAuth } from '~/utils/components/page/protected-routes-hoc';

const EditPage: NextPage = requireAuth(() => {
  redirect('/edit/essays');
});

export default EditPage;
