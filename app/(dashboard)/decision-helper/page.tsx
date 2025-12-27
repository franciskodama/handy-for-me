import { auth } from '@/lib/auth';
import {
  getAllDecisionHelperItems,
  getDecisionHelperLists
} from '@/lib/actions';
import { DecisionHelperItem, DecisionHelperList } from '@/lib/types';
import DecisionHelper from './decision-helper';
import SignInPrompt from '@/components/SignInPrompt';

export default async function DecisionHelperPage() {
  const session = await auth();
  const uid = session?.user?.email;

  if (!uid) {
    return <SignInPrompt />;
  }

  let lists: DecisionHelperList[] = [];
  let items: DecisionHelperItem[] = [];

  const fetchedLists = await getDecisionHelperLists(uid);
  if (Array.isArray(fetchedLists)) {
    lists = fetchedLists;
  }
  const fetchedItems = await getAllDecisionHelperItems(uid);
  if (Array.isArray(fetchedItems)) {
    items = fetchedItems;
  }

  return (
    <DecisionHelper uid={uid} initialLists={lists} initialItems={items} />
  );
}
