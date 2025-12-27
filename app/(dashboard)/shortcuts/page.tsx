import { auth } from '@/lib/auth';
import { getShortcuts, getShortcutsCategories } from '@/lib/actions';
import { Shortcut, ShortcutCategory } from '@/lib/types';
import Shortcuts from './shortcuts';
import SignInPrompt from '@/components/SignInPrompt';

export default async function ShortcutsPage() {
  const session = await auth();
  const uid = session?.user?.email;

  if (!uid) {
    return <SignInPrompt />;
  }

  let categories: ShortcutCategory[] = [];
  let shortcuts: Shortcut[] = [];

  const fetchedShortcutCategories = await getShortcutsCategories(uid);
  if (Array.isArray(fetchedShortcutCategories)) {
    categories = fetchedShortcutCategories;
  }
  const fetchedShortcuts = await getShortcuts(uid);
  if (Array.isArray(fetchedShortcuts)) {
    shortcuts = fetchedShortcuts;
  }

  return <Shortcuts uid={uid} categories={categories} shortcuts={shortcuts} />;
}
