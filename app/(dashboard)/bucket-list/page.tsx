import { auth } from '@/lib/auth';
import { getBucketListItems } from '@/lib/actions';
import BucketList from './bucket-list';

export default async function BucketListPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const firstName = session?.user?.name?.split(' ')[0];
  const bucketList = (uid && (await getBucketListItems(uid))) || [];

  return (
    <>
      {bucketList && uid && firstName && (
        <BucketList uid={uid} bucketList={bucketList} />
      )}
    </>
  );
}
