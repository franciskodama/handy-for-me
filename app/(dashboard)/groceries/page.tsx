import { auth } from '@/lib/auth';
import { getGroceryItems } from '@/lib/actions/groceries';
import { getHouseholdDetails } from '@/lib/actions/household';
import GroceriesView from './groceries-view';
import SignInPrompt from '@/components/SignInPrompt';

export default async function GroceriesPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  if (!uid) {
    return <SignInPrompt />;
  }

  const [groceryData, householdDetails] = await Promise.all([
    getGroceryItems(uid),
    getHouseholdDetails(uid)
  ]);

  const activeItems = (groceryData && groceryData.active) || [];
  const archivedItems = (groceryData && groceryData.archived) || [];
  const staples = (groceryData && groceryData.staples) || [];

  return (
    <GroceriesView
      key={uid}
      uid={uid}
      userName={userName}
      currentUserImage={userImage}
      initialActiveItems={activeItems}
      initialArchivedItems={archivedItems}
      initialStaples={staples}
      householdDetails={householdDetails}
    />
  );
}
