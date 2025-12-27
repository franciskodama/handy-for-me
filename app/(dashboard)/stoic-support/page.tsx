import { auth } from '@/lib/auth';
import StoicSupport from './stoic-support';
import SignInPrompt from '@/components/SignInPrompt';

export default async function StoicSupportPage() {
  const session = await auth();
  const name = session?.user?.name?.split(' ')[0];

  if (!name) {
    return <SignInPrompt />;
  }

  return <StoicSupport name={name} />;
}
