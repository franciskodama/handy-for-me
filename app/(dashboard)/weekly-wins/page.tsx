import { auth } from '@/lib/auth';

export default async function WeeklyWinsPage() {
  const session = await auth();
  const uid = session?.user?.email;
  const firstName = session?.user?.name?.split(' ')[0];
  //   const weeklyWins = (uid && (await getWeeklyWins(uid))) || [];

  return (
    <>
      {/* {weeklyWins && uid && firstName && (
        <WeeklyWins uid={uid} weeklyWins={weeklyWins} />
      )} */}
    </>
  );
}
