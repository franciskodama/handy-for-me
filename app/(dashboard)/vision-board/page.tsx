import { auth } from '@/lib/auth';
import VisionBoard from './vision-board';
import { getAffirmations } from '@/lib/actions';

export default async function VisionBoardPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const firstName = session?.user?.name?.split(' ')[0];
  const affirmations = (uid && (await getAffirmations(uid))) || [];

  return (
    <>
      {affirmations && uid && firstName && (
        <VisionBoard uid={uid} affirmations={affirmations} />
      )}
    </>
  );
}
