import { auth } from '@/lib/auth';
import In from './in';

export default async function InPage() {
  const session = await auth();
  const user = session?.user;

  return <>{session ? <In user={user} /> : null}</>;
}
