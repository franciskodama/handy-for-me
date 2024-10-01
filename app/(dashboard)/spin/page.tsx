import { auth } from '@/lib/auth';
import Spin from './spin';

export default async function SpinPage() {
  // const user = auth();
  // console.log('---  🚀 ---> | user:', user);

  return <Spin />;
}
