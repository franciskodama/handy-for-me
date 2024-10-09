import { auth } from '@/lib/auth';
import Affirmation from './affirmation';
import { getAffirmations } from '@/lib/actions';

export default async function AffirmationPage() {
  const session = await auth();
  const uid = session?.user?.email;

  const affirmations = uid && (await getAffirmations(uid));

  return <>{affirmations && <Affirmation affirmations={affirmations} />}</>;
}
