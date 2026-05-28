import { auth } from '@/lib/auth';
import { getHouseholdDetails } from '@/lib/actions/household';
import SignInPrompt from '@/components/SignInPrompt';
import SettingsView from './settings-view';

export default async function SettingsPage() {
  const session = await auth();
  const uid = session?.user?.email;

  if (!uid) {
    return <SignInPrompt />;
  }

  const householdDetails = await getHouseholdDetails(uid);

  return (
    <SettingsView
      uid={uid}
      initialDetails={householdDetails}
    />
  );
}
