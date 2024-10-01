import { auth } from '@/lib/auth';
import Spin from './spin';
import { getDrawLists } from '@/lib/actions';

export default async function SpinPage() {
  const user = auth();
  console.log('---  🚀 ---> | user:', user);

  // try {
  //   const data = await getDrawLists()
  // }

  return <Spin />;
}
