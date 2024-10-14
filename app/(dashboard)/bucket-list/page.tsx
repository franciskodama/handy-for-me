import { auth } from '@/lib/auth';
import { getVisualBoardItems } from '@/lib/actions';
import BucketList from './bucket-list';

export default async function BucketListPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const firstName = session?.user?.name?.split(' ')[0];
  const visualBoard = (uid && (await getVisualBoardItems(uid))) || [];

  return (
    <>
      {visualBoard && uid && firstName && (
        <BucketList uid={uid} visualBoard={visualBoard} />
      )}
    </>
  );
}
