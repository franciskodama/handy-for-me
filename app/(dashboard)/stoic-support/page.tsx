import { auth } from '@/lib/auth';
import StoicSupport from './stoic-support';

export default async function StoicSupportPage() {
  const session = await auth();
  const name = session?.user?.name?.split(' ')[0];

  return <>{name && <StoicSupport name={name} />}</>;
}
