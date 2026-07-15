import { auth } from '@/lib/auth';
import { getKanbanBoard } from '@/lib/actions/kanban';
import KanbanView from './kanban-view';
import SignInPrompt from '@/components/SignInPrompt';

export default async function KanbanPage() {
  const session = await auth();
  const user = session?.user;

  if (!session) {
    return <SignInPrompt />;
  }

  const initialColumns = await getKanbanBoard(user?.email ?? '');

  return <KanbanView uid={user?.email ?? ''} initialColumns={initialColumns} />;
}
