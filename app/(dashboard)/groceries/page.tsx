import { auth } from '@/lib/auth';
import { getGroceryItems } from '@/lib/actions/groceries';
import { getHouseholdDetails } from '@/lib/actions/household';
import GroceriesView from './groceries-view';
import SignInPrompt from '@/components/SignInPrompt';

export default async function GroceriesPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const userName = session?.user?.name;

  if (!uid) {
    return <SignInPrompt />;
  }

  const [groceryData, householdDetails] = await Promise.all([
    getGroceryItems(uid),
    getHouseholdDetails(uid)
  ]);

  const activeItems = (groceryData && groceryData.active) || [];
  const archivedItems = (groceryData && groceryData.archived) || [];

  return (
    <GroceriesView
      uid={uid}
      userName={userName}
      initialActiveItems={activeItems}
      initialArchivedItems={archivedItems}
      householdDetails={householdDetails}
    />
  );
}
