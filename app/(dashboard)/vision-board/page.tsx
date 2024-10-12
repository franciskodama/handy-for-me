import { auth } from '@/lib/auth';
import VisionBoard from './vision-board';
import { getVisualBoardItems } from '@/lib/actions';

export default async function VisionBoardPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const firstName = session?.user?.name?.split(' ')[0];
  const visualBoard = (uid && (await getVisualBoardItems(uid))) || [];

  return (
    <>
      {visualBoard && uid && firstName && (
        <VisionBoard uid={uid} visualBoard={visualBoard} />
      )}
    </>
  );
}
