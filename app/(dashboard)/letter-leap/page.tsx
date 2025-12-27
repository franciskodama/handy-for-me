import { auth } from '@/lib/auth';
import LetterLeap from './letter-leap';
import SignInPrompt from '@/components/SignInPrompt';

export default async function LetterLeapPage() {
  const session = await auth();
  const name = session?.user?.name;

  if (!name) {
    return <SignInPrompt />;
  }

  return <LetterLeap name={name} />;
}
