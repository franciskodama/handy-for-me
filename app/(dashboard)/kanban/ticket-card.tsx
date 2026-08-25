import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit } from 'lucide-react';
import { KanbanTicket } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LinkifiedText } from '@/components/common/linkified-text';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
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

interface TicketCardProps {
  ticket: KanbanTicket;
  isOverlay?: boolean;
  onEdit: (ticket: KanbanTicket) => void;
  onDelete: (id: string) => void;
}

export function TicketCard({
  ticket,
  isOverlay,
  onEdit,
  onDelete
}: TicketCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[95px] bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg animate-pulse transition-all duration-150"
      />
    );
  }

  const getPriorityDetails = (priority: string) => {
    switch (priority) {
      case 'Q1':
        return {
          label: 'Q1: Urgent & Important',
          action: '⚡ DO — Do it now!',
          badgeClass: 'border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20',
          dotClass: 'bg-rose-500'
        };
      case 'Q2':
        return {
          label: 'Q2: Important & Not Urgent',
          action: '📅 DECIDE — Schedule a time to do it',
          badgeClass: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
          dotClass: 'bg-indigo-500'
        };
      case 'Q3':
        return {
          label: 'Q3: Urgent & Not Important',
          action: '🤝 DELEGATE — Who can do it for you?',
          badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
          dotClass: 'bg-amber-500'
        };
      case 'Q4':
        return {
          label: 'Q4: Not Urgent & Not Important',
          action: '🗑️ DELETE — Eliminate it',
          badgeClass: 'border-slate-500/30 bg-slate-500/10 text-slate-500 hover:bg-slate-500/20',
          dotClass: 'bg-slate-500'
        };
      default:
        return {
          label: 'No Priority',
          action: '',
          badgeClass: 'border-muted bg-muted/40 text-muted-foreground hover:bg-muted/50',
          dotClass: 'bg-muted-foreground/40'
        };
    }
  };

  const priorityDetails = getPriorityDetails(ticket.priority);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex flex-col justify-between bg-card hover:bg-accent/20 border p-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md border-border',
        isOverlay && 'shadow-xl border-primary z-50 cursor-grabbing'
      )}
      onClick={() => onEdit(ticket)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground rounded transition-colors"
          onClick={(e) => e.stopPropagation()} // Prevent opening details dialog
        >
          <GripVertical size={16} />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground leading-snug break-words">
            {ticket.title}
          </h4>
        </div>

        {/* Delete Trigger */}
        <div onClick={(e) => e.stopPropagation()}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity duration-200"
              >
                <Trash2 size={14} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[calc(100%-35px)] max-w-md rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ticket?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{ticket.title}&quot;? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(ticket.id)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Description Preview (if any) */}
      {ticket.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 break-words">
          {ticket.description}
        </p>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-auto">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={cn('text-[10px] px-2 py-0.5 font-medium rounded-full flex items-center gap-1.5', priorityDetails.badgeClass)}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', priorityDetails.dotClass)} />
                {priorityDetails.label}
              </Badge>
            </TooltipTrigger>
            {priorityDetails.action && (
              <TooltipContent
                side="top"
                className="text-xs font-medium rounded-lg"
              >
                {priorityDetails.action}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <span className="text-[10px] text-muted-foreground/60">
          {new Date(ticket.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
    </div>
  );
}
