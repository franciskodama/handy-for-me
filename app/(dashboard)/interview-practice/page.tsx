import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import InterviewPractice from './interview-practice';

export default async function InterviewPracticePage() {
  const session = await auth();

  if (session?.user?.email !== process.env.MY_UID) {
    redirect('/dashboard');
  }

  const name = session?.user?.name || 'Guest';

  return <InterviewPractice name={name} />;
}
