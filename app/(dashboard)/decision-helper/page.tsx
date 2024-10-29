import { auth } from '@/lib/auth';
import { getAllSpinItems, getSpinLists } from '@/lib/actions';
import { SpinItem, SpinList } from '@/lib/types';
import DecisionHelper from './decision-helper';

export default async function DecisionHelperPage() {
  const session = await auth();
  const uid = session?.user?.email;

  let lists: SpinList[] = [];
  let items: SpinItem[] = [];

  if (uid) {
    const fetchedLists = await getSpinLists(uid);
    if (Array.isArray(fetchedLists)) {
      lists = fetchedLists;
    }
    const fetchedItems = await getAllSpinItems(uid);
    if (Array.isArray(fetchedItems)) {
      items = fetchedItems;
    }
  }

  return (
    <>
      {uid && (
        <DecisionHelper uid={uid} initialLists={lists} initialItems={items} />
      )}
    </>
  );
}
