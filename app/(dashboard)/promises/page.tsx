import { auth } from '@/lib/auth';
import { getYearPromises } from '@/lib/actions/promises';
import PromisesView from './promises-view';
import SignInPrompt from '@/components/SignInPrompt';

export default async function PromisesPage() {
  const session = await auth();
  const user = session?.user;

  if (!session) {
    return <SignInPrompt />;
  }

  const promises = await getYearPromises(user?.email ?? '');

  return <PromisesView uid={user?.email ?? ''} initialPromises={promises} />;
}
