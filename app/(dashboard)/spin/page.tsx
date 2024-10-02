import { auth } from '@/lib/auth';
import Spin from './spin';

export default async function SpinPage() {
  const session = await auth();
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0];
  const uid = user?.email;

  return <>{firstName && uid && <Spin firstName={firstName} uid={uid} />}</>;
}
