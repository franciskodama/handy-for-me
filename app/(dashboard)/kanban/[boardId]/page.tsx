import { auth } from '@/lib/auth';
import { getKanbanBoard } from '@/lib/actions/kanban';
import KanbanView from '../kanban-view';
import SignInPrompt from '@/components/SignInPrompt';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const session = await auth();
  const user = session?.user;

  if (!session) {
    return <SignInPrompt />;
  }

  const { boardId } = await params;
  const uid = user?.email ?? '';

  // Fetch board metadata for the title
  const board = await prisma.kanbanBoard.findUnique({
    where: { id: boardId }
  });

  if (!board || board.uid !== uid) {
    notFound();
  }

  const initialColumns = await getKanbanBoard(uid, boardId);

  return (
    <KanbanView
      uid={uid}
      boardId={boardId}
      boardTitle={board.title}
      boardEmoji={board.emoji}
      initialColumns={initialColumns}
    />
  );
}
