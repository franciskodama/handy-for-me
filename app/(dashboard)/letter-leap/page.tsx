import { auth } from '@/lib/auth';
import LetterLeap from './letter-leap';

export default async function LetterLeapPage() {
  const session = await auth();
  const name = session?.user?.name;

  return (
    <>
      <div>{name && <LetterLeap name={name} />}</div>
    </>
  );
}
