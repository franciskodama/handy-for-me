'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useSetBreadcrumbTitle } from '@/components/layout/header/breadcrumb-context';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  pointerWithin,
  rectIntersection,
  CollisionDetection
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn, KanbanTicket } from '@prisma/client';
import { ColumnContainer } from './column-container';
import { TicketCard } from './ticket-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Trello,
  Plus,
  HelpCircle,
  FolderPlus,
  AlertTriangle,
  Flame,
  Calendar,
  CheckSquare,
  Trash,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Check,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { barlow, kumbh_sans } from '@/app/ui/fonts';
import Help from '@/components/common/Help';
import ExplanationBox from '@/components/ExplanationBox';
import {
  createKanbanColumn,
  updateKanbanColumnTitle,
  deleteKanbanColumn,
  updateKanbanColumnsOrder,
  createKanbanTicket,
  updateKanbanTicket,
  deleteKanbanTicket,
  updateKanbanTicketsOrder
} from '@/lib/actions/kanban';

type ColumnWithTickets = KanbanColumn & { tickets: KanbanTicket[] };

interface KanbanViewProps {
  uid: string;
  boardId: string;
  boardTitle: string;
  boardEmoji: string;
  initialColumns: ColumnWithTickets[];
  allBoards?: Array<{ id: string; title: string; emoji: string }>;
}

const customCollisionDetection: CollisionDetection = (args) => {
  // First check pointerWithin (where mouse cursor actually is)
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  // Fallback to rectIntersection
  return rectIntersection(args);
};

const getPriorityWeight = (priority: string) => {
  switch (priority) {
    case 'Q1':
      return 1;
    case 'Q2':
      return 2;
    case 'Q3':
      return 3;
    case 'Q4':
      return 4;
    default:
      return 5;
  }
};

export default function KanbanView({
  uid,
  boardId,
  boardTitle,
  boardEmoji,
  initialColumns,
  allBoards = []
}: KanbanViewProps) {
  useSetBreadcrumbTitle(boardEmoji ? `${boardEmoji} ${boardTitle}` : boardTitle);

  const [columns, setColumns] = useState<KanbanColumn[]>(
    initialColumns.map(({ tickets, ...col }) => col)
  );
  const [tickets, setTickets] = useState<KanbanTicket[]>(
    initialColumns.flatMap((col) => col.tickets)
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [openExplanation, setOpenExplanation] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Columns Dialogs / Inputs
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // Tickets Dialogs / Inputs
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<KanbanTicket | null>(null);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState('NONE');
  const [targetColumnId, setTargetColumnId] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  // HELPERS FOR COLUMN ACTION
  const handleAddColumn = async () => {
    const trimmed = newColumnTitle.trim();
    if (!trimmed) return;

    const order = columns.length;
    const res = await createKanbanColumn(uid, boardId, trimmed, order);
    if (res) {
      setColumns((prev) => [...prev, res]);
      setNewColumnTitle('');
      setIsAddColumnOpen(false);
      toast({
        title: 'Column Created! 📁',
        description: `"${trimmed}" column has been added to your board.`,
        variant: 'success'
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create column.',
        variant: 'destructive'
      });
    }
  };

  const handleMoveColumn = (id: string, direction: 'left' | 'right') => {
    const index = columns.findIndex((c) => c.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= columns.length) return;

    const newCols = arrayMove(columns, index, targetIndex);
    const reordered = newCols.map((c, idx) => ({ ...c, order: idx }));

    setColumns(reordered);

    const columnOrdersToPersist = reordered.map((c) => ({
      id: c.id,
      order: c.order
    }));

    startTransition(async () => {
      await updateKanbanColumnsOrder(uid, columnOrdersToPersist);
    });
  };

  const handleEditColumnTitle = async (id: string, title: string) => {
    const res = await updateKanbanColumnTitle(uid, id, title);
    if (res) {
      setColumns((prev) => prev.map((col) => (col.id === id ? res : col)));
      toast({
        title: 'Column Renamed',
        description: `Column was successfully renamed to "${title}".`
      });
    }
  };

  const handleDeleteColumn = async (id: string) => {
    const success = await deleteKanbanColumn(uid, id);
    if (success) {
      setColumns((prev) => prev.filter((col) => col.id !== id));
      setTickets((prev) => prev.filter((t) => t.columnId !== id));
      toast({
        title: 'Column Deleted',
        description: 'The column and all its tickets have been removed.',
        variant: 'destructive'
      });
    }
  };

  // HELPERS FOR TICKET ACTION
  const handleOpenAddTicket = (colId: string) => {
    setEditingTicket(null);
    setTicketTitle('');
    setTicketDescription('');
    setTicketPriority('NONE');
    setTargetColumnId(colId);
    setIsTicketDialogOpen(true);
  };

  const handleOpenEditTicket = (ticket: KanbanTicket) => {
    setEditingTicket(ticket);
    setTicketTitle(ticket.title);
    setTicketDescription(ticket.description ?? '');
    setTicketPriority(ticket.priority);
    setTargetColumnId(ticket.columnId);
    setIsTicketDialogOpen(true);
  };

  const handleSaveTicket = async () => {
    const trimmedTitle = ticketTitle.trim();
    if (!trimmedTitle) {
      toast({
        title: 'Validation Error',
        description: 'Ticket title is required.',
        variant: 'destructive'
      });
      return;
    }

    if (editingTicket) {
      // EDIT TICKET
      const res = await updateKanbanTicket(uid, editingTicket.id, {
        title: trimmedTitle,
        description: ticketDescription,
        priority: ticketPriority,
        columnId: targetColumnId
      });

      if (res) {
        setTickets((prev) =>
          prev.map((t) => (t.id === editingTicket.id ? res : t))
        );
        setIsTicketDialogOpen(false);
        toast({
          title: 'Ticket Updated ✨',
          description: `"${trimmedTitle}" was updated successfully.`
        });
      }
    } else {
      // ADD TICKET
      const sameColumnTickets = tickets.filter((t) => t.columnId === targetColumnId);
      const order = sameColumnTickets.length;
      const res = await createKanbanTicket(
        uid,
        targetColumnId,
        trimmedTitle,
        ticketPriority,
        order,
        ticketDescription
      );

      if (res) {
        setTickets((prev) => [...prev, res]);
        setIsTicketDialogOpen(false);
        toast({
          title: 'Ticket Added! 📝',
          description: `"${trimmedTitle}" has been added to the board.`,
          variant: 'success'
        });
      }
    }
  };

  const handleDeleteTicket = async (id: string) => {
    const success = await deleteKanbanTicket(uid, id);
    if (success) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: 'Ticket Deleted',
        description: 'The ticket was deleted successfully.'
      });
    }
  };

  // DRAG AND DROP HANDLERS
  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isColumnDragging = columns.some((c) => c.id === activeId);
    if (isColumnDragging) return;

    const activeTicket = tickets.find((t) => t.id === activeId);
    if (!activeTicket) return;

    // Dragging over a column
    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn) {
      if (activeTicket.columnId !== overColumn.id) {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, columnId: overColumn.id } : t
          )
        );
      }
      return;
    }

    // Dragging over a ticket
    const overTicket = tickets.find((t) => t.id === overId);
    if (overTicket && activeTicket.columnId !== overTicket.columnId) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, columnId: overTicket.columnId } : t
        )
      );
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 1. COLUMN REORDERING
    const isColumnDragging = columns.some((c) => c.id === activeId);
    if (isColumnDragging) {
      if (activeId !== overId) {
        const oldIndex = columns.findIndex((c) => c.id === activeId);
        const newIndex = columns.findIndex((c) => c.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newCols = arrayMove(columns, oldIndex, newIndex);
          const reordered = newCols.map((c, idx) => ({ ...c, order: idx }));
          setColumns(reordered);

          const columnOrdersToPersist = reordered.map((c) => ({
            id: c.id,
            order: c.order
          }));

          startTransition(async () => {
            await updateKanbanColumnsOrder(uid, columnOrdersToPersist);
          });
        }
      }
      return;
    }

    // 2. TICKET REORDERING
    const activeTicket = tickets.find((t) => t.id === activeId);
    if (!activeTicket) return;

    let targetColumnId = activeTicket.columnId;
    const overColumn = columns.find((c) => c.id === overId);
    const overTicket = tickets.find((t) => t.id === overId);

    if (overColumn) {
      targetColumnId = overColumn.id;
    } else if (overTicket) {
      targetColumnId = overTicket.columnId;
    }

    const columnTickets = tickets.filter(
      (t) => t.columnId === targetColumnId && t.id !== activeId
    );

    const isBacklog =
      columns.find((c) => c.id === targetColumnId)?.title.toLowerCase() ===
      'backlog';

    const sortedColumnTickets = [...columnTickets].sort((a, b) => {
      if (isBacklog) {
        const weightA = getPriorityWeight(a.priority);
        const weightB = getPriorityWeight(b.priority);
        if (weightA !== weightB) return weightA - weightB;
      }
      return a.order - b.order;
    });

    let insertIndex = sortedColumnTickets.length;
    if (overTicket) {
      insertIndex = sortedColumnTickets.findIndex((t) => t.id === overId);
    }

    sortedColumnTickets.splice(insertIndex, 0, {
      ...activeTicket,
      columnId: targetColumnId
    });

    const updatedTickets = tickets.map((t) => {
      if (t.id === activeId) {
        return { ...t, columnId: targetColumnId };
      }
      return t;
    });

    const targetColumnTicketsWithNewOrder = sortedColumnTickets.map(
      (t, idx) => ({
        ...t,
        order: idx
      })
    );

    const finalTickets = updatedTickets.map((t) => {
      const found = targetColumnTicketsWithNewOrder.find((nt) => nt.id === t.id);
      return found ? found : t;
    });

    setTickets(finalTickets);

    const ticketsToUpdate = targetColumnTicketsWithNewOrder.map((t) => ({
      id: t.id,
      columnId: t.columnId,
      order: t.order
    }));

    startTransition(async () => {
      await updateKanbanTicketsOrder(uid, ticketsToUpdate);
    });
  };

  const activeTicket = activeId ? tickets.find((t) => t.id === activeId) : null;
  const activeColumn = activeId ? columns.find((c) => c.id === activeId) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-border">
        <div>
          <Link
            href="/kanban"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            Back to Boards
          </Link>
          {allBoards.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-2 text-left focus:outline-none rounded-lg py-1 px-1.5 -ml-1.5 hover:bg-muted/60 transition-colors"
                >
                  <h1 className={`${barlow.className} text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2 group-hover:text-primary transition-colors`}>
                    <span className="text-2xl">{boardEmoji}</span>
                    <span>{boardTitle}</span>
                    <ChevronDown size={20} className="text-muted-foreground group-hover:text-primary transition-colors ml-0.5 mt-0.5" />
                  </h1>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2 rounded-xl shadow-lg border border-border bg-popover">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Switch Board
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allBoards.map((b) => (
                  <DropdownMenuItem
                    key={b.id}
                    asChild
                    className="p-0 focus:bg-transparent"
                  >
                    <Link
                      href={`/kanban/${b.id}`}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors w-full ${
                        b.id === boardId
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'hover:bg-accent hover:text-foreground text-foreground'
                      }`}
                    >
                      <span className="text-base">{b.emoji}</span>
                      <span className="flex-1 truncate">{b.title}</span>
                      {b.id === boardId && <Check size={16} className="text-primary ml-auto" />}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                  <Link
                    href="/kanban"
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
                  >
                    <LayoutGrid size={14} />
                    View All Boards Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <h1 className={`${barlow.className} text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2`}>
              <span className="text-2xl">{boardEmoji}</span>
              {boardTitle}
            </h1>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Drag & drop tickets to organize work. The <span className="font-semibold underline">Backlog</span> sorts by Eisenhower priority automatically!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddColumnOpen(true)}
            variant="outline"
            className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
          >
            <FolderPlus size={16} />
            Add Column
          </Button>

          <Help setOpenAction={setOpenExplanation} />
        </div>
      </div>

      {/* Explanation Box */}
      {openExplanation && (
        <ExplanationBox
          iconOne={<Flame className="h-6 w-6 text-rose-500" />}
          titleOne="Eisenhower Quadrants"
          contentOne={
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Prioritize your tasks using the Eisenhower Matrix:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-foreground">Q1:</strong> Do First (Urgent & Important)</li>
                <li><strong className="text-foreground">Q2:</strong> Schedule (Important, Not Urgent)</li>
                <li><strong className="text-foreground">Q3:</strong> Delegate (Urgent, Not Important)</li>
                <li><strong className="text-foreground">Q4:</strong> Eliminate (Neither)</li>
              </ul>
            </div>
          }
          iconTwo={<Sparkles className="h-6 w-6 text-indigo-500" />}
          titleTwo="Auto-Priority Sorting"
          contentTwo={
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                In the <strong className="text-foreground">Backlog</strong> column, tickets are automatically sorted by priority.
              </p>
              <p>
                Giving a ticket a badge like <span className="underline">Urgent & Important</span> will immediately move it to the top of your Backlog column.
              </p>
            </div>
          }
          iconThree={<Trello className="h-6 w-6 text-amber-500" />}
          titleThree="Customize Columns"
          contentThree={
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Double-click or click the edit icon next to any column title to rename it. Drag tasks between columns as your workflow progresses.
              </p>
            </div>
          }
          callToAction="Got it!"
          setOpenAction={setOpenExplanation}
        />
      )}

      {/* Kanban Board Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x select-none">
          <SortableContext
            items={columns.map((c) => c.id)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((col, idx) => {
              const columnTickets = tickets.filter((t) => t.columnId === col.id);
              const isBacklog = col.title.toLowerCase() === 'backlog';

              // Sort column tickets
              const sortedColumnTickets = [...columnTickets].sort((a, b) => {
                if (isBacklog) {
                  const weightA = getPriorityWeight(a.priority);
                  const weightB = getPriorityWeight(b.priority);
                  if (weightA !== weightB) return weightA - weightB;
                }
                return a.order - b.order;
              });

              return (
                <div key={col.id} className="snap-center flex-1 basis-0 min-w-[280px]">
                  <ColumnContainer
                    column={{ ...col, tickets: sortedColumnTickets }}
                    onAddTicket={handleOpenAddTicket}
                    onEditColumnTitle={handleEditColumnTitle}
                    onDeleteColumn={handleDeleteColumn}
                    onEditTicket={handleOpenEditTicket}
                    onDeleteTicket={handleDeleteTicket}
                    isSortingActive={isBacklog}
                    onMoveColumn={handleMoveColumn}
                    isFirst={idx === 0}
                    isLast={idx === columns.length - 1}
                  />
                </div>
              );
            })}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeColumn ? (
            <ColumnContainer
              column={{
                ...activeColumn,
                tickets: tickets
                  .filter((t) => t.columnId === activeColumn.id)
                  .sort((a, b) => a.order - b.order)
              }}
              onAddTicket={() => {}}
              onEditColumnTitle={() => {}}
              onDeleteColumn={() => {}}
              onEditTicket={() => {}}
              onDeleteTicket={() => {}}
              isSortingActive={false}
            />
          ) : activeTicket ? (
            <TicketCard
              ticket={activeTicket}
              isOverlay
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Column Creation Dialog */}
      <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
        <DialogContent className="w-[calc(100%-35px)] max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>Add Column</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="columnName" className="text-sm font-medium">
              Column Title
            </label>
            <Input
              id="columnName"
              placeholder="e.g. In Review, Later..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="mt-2"
              onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsAddColumnOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddColumn} className="bg-primary text-primary-foreground">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Create/Edit Dialog */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="w-[calc(100%-35px)] max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTicket ? 'Edit Ticket' : 'Create Ticket'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="ticketTitle" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="ticketTitle"
                placeholder="What needs to be done?"
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="ticketPriority" className="text-sm font-medium">
                Eisenhower Priority
              </label>
              <Select
                value={ticketPriority}
                onValueChange={setTicketPriority}
              >
                <SelectTrigger id="ticketPriority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No Priority Badge</SelectItem>
                  <SelectItem value="Q1">Q1: Urgent & Important</SelectItem>
                  <SelectItem value="Q2">Q2: Important & Not Urgent</SelectItem>
                  <SelectItem value="Q3">Q3: Urgent & Not Important</SelectItem>
                  <SelectItem value="Q4">Q4: Not Urgent & Not Important</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="ticketColumn" className="text-sm font-medium">
                Column
              </label>
              <Select
                value={targetColumnId}
                onValueChange={setTargetColumnId}
              >
                <SelectTrigger id="ticketColumn">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="ticketDesc" className="text-sm font-medium">
                Description / Notes
              </label>
              <textarea
                id="ticketDesc"
                placeholder="Add more details about this task..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="flex min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsTicketDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTicket} className="bg-primary text-primary-foreground">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
