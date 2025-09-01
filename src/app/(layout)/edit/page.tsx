import { type NextPage } from 'next';
import { redirect } from 'next/navigation';

const EditPage: NextPage = () => {
  redirect('/edit/essays');
};

export default EditPage;
