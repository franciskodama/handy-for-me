import { auth } from '@/lib/auth';
import InterviewPractice from './interview-practice';

export default async function InterviewPracticePage() {
  const session = await auth();
  const name = session?.user?.name || 'Guest';

  return <InterviewPractice name={name} />;
}
