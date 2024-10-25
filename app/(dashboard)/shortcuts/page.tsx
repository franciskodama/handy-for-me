import { auth } from '@/lib/auth';
import { getShortcuts, getShortcutsCategories } from '@/lib/actions';
import { Shortcut, ShortcutCategory } from '@/lib/types';
import Shortcuts from './shortcuts';

export default async function ShortcutsPage() {
  const session = await auth();
  const uid = session?.user?.email;

  let categories: ShortcutCategory[] = [];
  let shortcuts: Shortcut[] = [];

  if (uid) {
    const fetchedShortcutCategories = await getShortcutsCategories(uid);
    if (Array.isArray(fetchedShortcutCategories)) {
      categories = fetchedShortcutCategories;
    }
    const fetchedShortcuts = await getShortcuts(uid);
    if (Array.isArray(fetchedShortcuts)) {
      shortcuts = fetchedShortcuts;
    }
  }

  return (
    <>
      {uid && (
        <Shortcuts uid={uid} categories={categories} shortcuts={shortcuts} />
      )}
    </>
  );
}
