import { auth } from '@/lib/auth';
import VisionBoard from './vision-board';
import { getVisualBoardItems } from '@/lib/actions';
import SignInPrompt from '@/components/SignInPrompt';

export default async function VisionBoardPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const firstName = session?.user?.name?.split(' ')[0];
  const visualBoard = (uid && (await getVisualBoardItems(uid))) || [];

  if (!uid || !firstName) {
    return <SignInPrompt />;
  }

  return <VisionBoard uid={uid} visualBoard={visualBoard} />;
}
