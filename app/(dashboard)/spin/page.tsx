import { auth } from '@/lib/auth';
import Spin from './spin';
import { getSpinLists } from '@/lib/actions';
import { SpinList } from '@/lib/types';

export default async function SpinPage() {
  const session = await auth();
  const uid = session?.user?.email;

  let lists: SpinList[] = [];
  if (uid) {
    const fetchedLists = await getSpinLists(uid);
    if (Array.isArray(fetchedLists)) {
      lists = fetchedLists;
    }
  }

  return <>{uid && <Spin uid={uid} lists={lists} />}</>;
}
