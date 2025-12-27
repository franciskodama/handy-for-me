import { auth } from '@/lib/auth';
import { getBucketListItems } from '@/lib/actions';
import BucketList from './bucket-list';
import SignInPrompt from '@/components/SignInPrompt';

export default async function BucketListPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const firstName = session?.user?.name?.split(' ')[0];
  const bucketList = (uid && (await getBucketListItems(uid))) || [];

  if (!uid || !firstName) {
    return <SignInPrompt />;
  }

  return <BucketList uid={uid} bucketList={bucketList} />;
}
