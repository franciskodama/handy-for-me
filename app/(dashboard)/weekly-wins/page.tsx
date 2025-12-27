import { getWeeklyWins } from '@/lib/actions';
import { auth } from '@/lib/auth';
import WeeklyWins from './weekly-wins';
import SignInPrompt from '@/components/SignInPrompt';

export default async function WeeklyWinsPage() {
  const session = await auth();
  const uid = session?.user?.email;

  if (!uid) {
    return <SignInPrompt />;
  }

  const weeklyWins = (await getWeeklyWins(uid)) || [];

  return <WeeklyWins uid={uid} weeklyWins={weeklyWins} />;
}
