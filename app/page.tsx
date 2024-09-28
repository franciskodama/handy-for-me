import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  return <div>{session ? redirect('/ai') : redirect('/login')}</div>;
}
