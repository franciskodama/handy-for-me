import { auth } from '@/lib/auth';
import StoicSupport from './stoic-support';

export default async function StoicSupportPage() {
  const session = await auth();
  const uid = session?.user?.email;

  return <>{uid && <StoicSupport uid={uid} />}</>;
}
