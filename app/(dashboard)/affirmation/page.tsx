import { auth } from '@/lib/auth';
import Affirmation from './affirmation';
import { getAffirmations } from '@/lib/actions';

export default async function AffirmationPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const firstName = session?.user?.name?.split(' ')[0];
  const affirmations = (uid && (await getAffirmations(uid))) || [];

  return (
    <>
      {affirmations && uid && firstName && (
        <Affirmation
          firstName={firstName}
          uid={uid}
          affirmations={affirmations}
        />
      )}
    </>
  );
}
