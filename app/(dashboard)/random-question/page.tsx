import { auth } from '@/lib/auth';
import RandomQuestion from './random-question';

export default async function RandomQuestionPage() {
  const session = await auth();
  const name = session?.user?.name || 'Guest';

  return <RandomQuestion name={name} />;
}
