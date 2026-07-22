import { useState, useRef, useEffect } from 'react';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanColumn, KanbanTicket } from '@prisma/client';
import { TicketCard } from './ticket-card';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  GripVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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

interface ColumnContainerProps {
  column: KanbanColumn & { tickets: KanbanTicket[] };
  onAddTicket: (columnId: string) => void;
  onEditColumnTitle: (id: string, title: string) => void;
  onDeleteColumn: (id: string) => void;
  onEditTicket: (ticket: KanbanTicket) => void;
  onDeleteTicket: (id: string) => void;
  isSortingActive: boolean;
  onMoveColumn?: (id: string, direction: 'left' | 'right') => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function ColumnContainer({
  column,
  onAddTicket,
  onEditColumnTitle,
  onDeleteColumn,
  onEditTicket,
  onDeleteTicket,
  isSortingActive,
  onMoveColumn,
  isFirst,
  isLast
}: ColumnContainerProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== column.title) {
      onEditColumnTitle(column.id, trimmed);
    } else {
      setTitleInput(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitleInput(column.title);
      setIsEditing(false);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col w-full bg-muted/20 border-2 border-dashed border-primary/40 rounded-xl p-4 h-[70vh] max-h-[75vh] opacity-40"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex flex-col w-full bg-muted/40 border border-border rounded-xl p-4 h-[70vh] max-h-[75vh] transition-all duration-200 shadow-sm hover:shadow-md'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex items-center gap-1.5 w-full mr-2">
            <Input
              ref={inputRef}
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              className="h-8 py-1 px-2 text-sm font-semibold w-full"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleSaveTitle}
            >
              <Check size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                setTitleInput(column.title);
                setIsEditing(false);
              }}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 group/title min-w-0 mr-2">
            {/* Drag Handle */}
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground/50 hover:text-foreground rounded transition-colors touch-none"
              title="Drag to reorder column"
            >
              <GripVertical size={16} />
            </button>

            {/* Move Left / Right buttons */}
            {onMoveColumn && (
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isFirst}
                  onClick={() => onMoveColumn(column.id, 'left')}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-20"
                  title="Move column left"
                >
                  <ChevronLeft size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isLast}
                  onClick={() => onMoveColumn(column.id, 'right')}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground disabled:opacity-20"
                  title="Move column right"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            )}

            <h3
              className="font-bold text-sm text-foreground uppercase tracking-wider truncate cursor-pointer select-none ml-1"
              onClick={() => setIsEditing(true)}
            >
              {column.title}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
              {column.tickets.length}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover/title:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={12} />
            </Button>
          </div>
        )}

        {/* Delete Column (Alert if tickets exist) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors rounded-lg shrink-0"
            >
              <Trash2 size={15} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[calc(100%-35px)] max-w-md rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Column &quot;{column.title}&quot;?</AlertDialogTitle>
              <AlertDialogDescription>
                {column.tickets.length > 0 ? (
                  <span className="text-destructive font-medium">
                    Warning: This column contains {column.tickets.length} ticket(s). Deleting the column will also permanently delete all tickets inside it.
                  </span>
                ) : (
                  'Are you sure you want to delete this column? This action cannot be undone.'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDeleteColumn(column.id)}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Ticket List area */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 rounded-lg min-h-[150px]">
        <SortableContext
          items={column.tickets.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onEdit={onEditTicket}
              onDelete={onDeleteTicket}
            />
          ))}
        </SortableContext>

        {column.tickets.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-primary/25 rounded-lg p-6 text-center text-muted-foreground/50 bg-background/20 min-h-[120px] select-none">
            <p className="text-xs font-semibold">Drop ticket here</p>
          </div>
        )}
      </div>

      {/* Add Ticket Footer Button */}
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/60 mt-3 border border-dashed border-border"
        onClick={() => onAddTicket(column.id)}
      >
        <Plus size={16} className="mr-2" />
        Add Ticket
      </Button>
    </div>
  );
}

