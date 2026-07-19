'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KanbanBoard } from '@prisma/client';
import {
  Trello,
  Plus,
  Pencil,
  Trash2,
  Columns3,
  Ticket,
  Flame,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { barlow } from '@/app/ui/fonts';
import Help from '@/components/common/Help';
import ExplanationBox from '@/components/ExplanationBox';
import {
  createKanbanBoard,
  updateKanbanBoard,
  deleteKanbanBoard
} from '@/lib/actions/kanban';

// ──────────────────────────────────────────────
// EMOJI INPUT
// ──────────────────────────────────────────────

function EmojiInput({
  value,
  onChange
}: {
  value: string;
  onChange: (emoji: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        // Take only the last grapheme (emoji) entered, so the field always holds exactly one
        const raw = e.target.value;
        const segments = Array.from(new Intl.Segmenter().segment(raw)).map(s => s.segment);
        const last = segments[segments.length - 1] ?? '📋';
        onChange(last);
      }}
      className="flex items-center justify-center h-10 w-10 rounded-lg border border-input bg-background text-center text-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
      title="Click to type or paste an emoji"
    />
  );
}

// ──────────────────────────────────────────────
// BOARD LIST
// ──────────────────────────────────────────────

type BoardWithStats = KanbanBoard & {
  columns: {
    id: string;
    _count: { tickets: number };
  }[];
};

interface BoardListProps {
  uid: string;
  initialBoards: BoardWithStats[];
}

export default function BoardList({ uid, initialBoards }: BoardListProps) {
  const router = useRouter();
  const [boards, setBoards] = useState<BoardWithStats[]>(initialBoards);
  const [openExplanation, setOpenExplanation] = useState(false);

  // Create board dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardEmoji, setNewBoardEmoji] = useState('📋');

  // Edit board dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<BoardWithStats | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editEmoji, setEditEmoji] = useState('📋');

  const handleCreateBoard = async () => {
    const trimmed = newBoardTitle.trim();
    if (!trimmed) return;

    const res = await createKanbanBoard(uid, trimmed, newBoardEmoji);
    if (res) {
      setBoards((prev) => [
        ...prev,
        {
          ...res,
          columns: Array.from({ length: 5 }, (_, i) => ({
            id: `temp-${i}`,
            _count: { tickets: 0 }
          }))
        }
      ]);
      setNewBoardTitle('');
      setNewBoardEmoji('📋');
      setIsCreateOpen(false);
      toast({
        title: 'Board Created! 🎉',
        description: `"${trimmed}" board has been created with default columns.`,
        variant: 'success'
      });
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create board.',
        variant: 'destructive'
      });
    }
  };

  const handleOpenEdit = (board: BoardWithStats) => {
    setEditingBoard(board);
    setEditTitle(board.title);
    setEditEmoji(board.emoji);
    setIsEditOpen(true);
  };

  const handleEditBoard = async () => {
    if (!editingBoard) return;
    const trimmed = editTitle.trim();
    if (!trimmed) return;

    const hasChanges = trimmed !== editingBoard.title || editEmoji !== editingBoard.emoji;
    if (!hasChanges) {
      setIsEditOpen(false);
      return;
    }

    const res = await updateKanbanBoard(uid, editingBoard.id, {
      title: trimmed,
      emoji: editEmoji
    });
    if (res) {
      setBoards((prev) =>
        prev.map((b) =>
          b.id === editingBoard.id
            ? { ...b, title: res.title, emoji: res.emoji }
            : b
        )
      );
      setIsEditOpen(false);
      toast({
        title: 'Board Updated',
        description: `Board updated successfully.`
      });
    }
  };

  const handleDeleteBoard = async (id: string) => {
    const success = await deleteKanbanBoard(uid, id);
    if (success) {
      setBoards((prev) => prev.filter((b) => b.id !== id));
      toast({
        title: 'Board Deleted',
        description: 'The board and all its data have been removed.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-border">
        <div>
          <h1 className={`${barlow.className} text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2`}>
            <Trello className="h-7 w-7 text-primary" />
            Kanban Boards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize your work across multiple boards. Click a board to open it.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="outline"
            className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
          >
            <Plus size={16} />
            New Board
          </Button>

          <Help setOpenAction={setOpenExplanation} />
        </div>
      </div>

      {/* Explanation Box */}
      {openExplanation && (
        <ExplanationBox
          iconOne={<LayoutGrid className="h-6 w-6 text-blue-500" />}
          titleOne="Multiple Boards"
          contentOne={
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Create separate boards for different contexts:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-foreground">Work:</strong> Track tasks and sprints</li>
                <li><strong className="text-foreground">Personal:</strong> Household chores, errands</li>
                <li><strong className="text-foreground">Side Projects:</strong> Learning goals, ideas</li>
              </ul>
            </div>
          }
          iconTwo={<Flame className="h-6 w-6 text-rose-500" />}
          titleTwo="Eisenhower Priorities"
          contentTwo={
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Each board has full Eisenhower priority support. The <strong className="text-foreground">Backlog</strong> column auto-sorts by priority.
              </p>
            </div>
          }
          iconThree={<Sparkles className="h-6 w-6 text-amber-500" />}
          titleThree="Default Columns"
          contentThree={
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                New boards come with 5 default columns: Backlog, Waiting, In Progress, Review, and Done. Customize them as you like!
              </p>
            </div>
          }
          callToAction="Got it!"
          setOpenAction={setOpenExplanation}
        />
      )}

      {/* Board Cards Grid */}
      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trello className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            No boards yet
          </h2>
          <p className="text-sm text-muted-foreground/60 mb-6 max-w-md">
            Create your first board to start organizing your tasks.
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-primary text-primary-foreground">
            <Plus size={16} className="mr-2" />
            Create Your First Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {boards.map((board) => {
            const columnCount = board.columns.length;
            const ticketCount = board.columns.reduce(
              (sum, col) => sum + col._count.tickets,
              0
            );

            return (
              <div
                key={board.id}
                onClick={() => router.push(`/kanban/${board.id}`)}
                className="group relative flex flex-col justify-between bg-card hover:bg-accent/20 border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {/* Board Title */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0" role="img" aria-label="board icon">
                      {board.emoji}
                    </span>
                    <h3 className="font-bold text-foreground text-base truncate">
                      {board.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(board)}
                    >
                      <Pencil size={14} />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[calc(100%-35px)] max-w-md rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete &quot;{board.title}&quot;?</AlertDialogTitle>
                          <AlertDialogDescription>
                            <span className="text-destructive font-medium">
                              This will permanently delete the board, all {columnCount} column(s), and {ticketCount} ticket(s) inside it. This action cannot be undone.
                            </span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteBoard(board.id)}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          >
                            Delete Board
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Columns3 size={14} className="text-muted-foreground/60" />
                    <span>{columnCount} column{columnCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Ticket size={14} className="text-muted-foreground/60" />
                    <span>{ticketCount} ticket{ticketCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Created date */}
                <p className="text-[10px] text-muted-foreground/50 mt-3">
                  Created {new Date(board.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Board Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-[calc(100%-35px)] max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Icon</label>
              <div className="mt-2">
                <EmojiInput value={newBoardEmoji} onChange={setNewBoardEmoji} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Paste any emoji or press <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">⌘ Ctrl Space</kbd> to open the emoji picker.
              </p>
            </div>
            <div>
              <label htmlFor="boardName" className="text-sm font-medium">
                Board Title
              </label>
              <Input
                id="boardName"
                placeholder="e.g. Work, Personal, Side Project..."
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                className="mt-2"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your board will be created with 5 default columns that you can customize.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBoard} className="bg-primary text-primary-foreground">
              Create Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Board Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[calc(100%-35px)] max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Icon</label>
              <div className="mt-2">
                <EmojiInput value={editEmoji} onChange={setEditEmoji} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Paste any emoji or press <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">⌘ Ctrl Space</kbd> to open the emoji picker.
              </p>
            </div>
            <div>
              <label htmlFor="editBoardTitle" className="text-sm font-medium">
                Board Title
              </label>
              <Input
                id="editBoardTitle"
                placeholder="Board name..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-2"
                onKeyDown={(e) => e.key === 'Enter' && handleEditBoard()}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBoard} className="bg-primary text-primary-foreground">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
