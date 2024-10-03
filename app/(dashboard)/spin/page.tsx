import { auth } from '@/lib/auth';
import Spin from './spin';
import { getAllSpinItemsFromList, getSpinLists } from '@/lib/actions';
import { SpinItem, SpinList } from '@/lib/types';

export default async function SpinPage() {
  const session = await auth();
  const uid = session?.user?.email;

  let lists: SpinList[] = [];
  let items: SpinItem[] = [];
  if (uid) {
    const fetchedLists = await getSpinLists(uid);
    if (Array.isArray(fetchedLists)) {
      lists = fetchedLists;
    }
    const fetchedItems = await getAllSpinItemsFromList(uid);
    if (Array.isArray(fetchedItems)) {
      items = fetchedItems;
    }
  }

  return (
    <>{uid && <Spin uid={uid} initialLists={lists} initialItems={items} />}</>
  );
}
