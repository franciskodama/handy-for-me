import { auth } from '@/lib/auth';
import { getAllSpinItems, getSpinLists } from '@/lib/actions';
import { SpinItem, SpinList } from '@/lib/types';
import MyWords from './my-words';

export default async function SpinPage() {
  const session = await auth();
  const uid = session?.user?.email;

  //   let myWords: MyWords[] = [];
  //   if (uid) {
  //     const fetchedMyWords = await getMyWords(uid);
  //     if (Array.isArray(fetchedMyWords)) {
  //       myWords = fetchedMyWords;
  //     }
  //   }

  const myWords = ['word', 'banana', 'caramelo', 'pizza', 'banana', 'caramelo'];

  return <>{uid && <MyWords uid={uid} myWords={myWords} />}</>;
}
