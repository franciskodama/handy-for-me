import { getWeeklyWins } from '@/lib/actions';
import { auth } from '@/lib/auth';
import WeeklyWins from './weekly-wins';

export default async function WeeklyWinsPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const weeklyWins = (uid && (await getWeeklyWins(uid))) || [];

  return (
    <>{weeklyWins && uid && <WeeklyWins uid={uid} weeklyWins={weeklyWins} />}</>
  );
}
