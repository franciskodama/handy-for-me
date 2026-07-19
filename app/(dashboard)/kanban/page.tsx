import { auth } from '@/lib/auth';
import { getKanbanBoards } from '@/lib/actions/kanban';
import BoardList from './board-list';
import SignInPrompt from '@/components/SignInPrompt';

export default async function KanbanPage() {
  const session = await auth();
  const user = session?.user;

  if (!session) {
    return <SignInPrompt />;
  }

  const initialBoards = await getKanbanBoards(user?.email ?? '');

  return <BoardList uid={user?.email ?? ''} initialBoards={initialBoards} />;
}
