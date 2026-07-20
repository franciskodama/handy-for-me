'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';

// SEED DEFAULT COLUMNS
const DEFAULT_COLUMNS = ['Backlog', 'Waiting', 'In Progress', 'Review', 'Done'];

// ──────────────────────────────────────────────
// BOARD ACTIONS
// ──────────────────────────────────────────────

export async function getKanbanBoards(uid: string) {
  try {
    let boards = await prisma.kanbanBoard.findMany({
      where: { uid },
      orderBy: { order: 'asc' },
      include: {
        columns: {
          include: {
            _count: { select: { tickets: true } }
          }
        }
      }
    });

    // Seed a default board if none exist
    if (boards.length === 0) {
      const board = await createKanbanBoard(uid, 'My Board');
      if (board) {
        // Re-fetch with the same shape
        boards = await prisma.kanbanBoard.findMany({
          where: { uid },
          orderBy: { order: 'asc' },
          include: {
            columns: {
              include: {
                _count: { select: { tickets: true } }
              }
            }
          }
        });
      }
    }

    // Add urgent‑important ticket count per board (priority "Q1")
    const boardsWithUrgent = await Promise.all(
      boards.map(async (b) => {
        // Collect column IDs for the board
        const columnIds = b.columns.map((c) => c.id);
        const urgentCount = await prisma.kanbanTicket.count({
          where: {
            uid,
            columnId: { in: columnIds },
            priority: 'Q1'
          }
        });
        return { ...b, urgentImportantCount: urgentCount };
      })
    );

    return boardsWithUrgent;
  } catch (error) {
    console.error('Error fetching Kanban boards:', error);
    return [];
  }
}

export async function createKanbanBoard(uid: string, title: string, emoji: string = '📋') {
  try {
    const boardCount = await prisma.kanbanBoard.count({ where: { uid } });
    const boardId = v4();

    const newBoard = await prisma.kanbanBoard.create({
      data: {
        id: boardId,
        uid,
        title: title.trim(),
        emoji,
        order: boardCount
      }
    });

    // Seed default columns for the new board
    for (let i = 0; i < DEFAULT_COLUMNS.length; i++) {
      await prisma.kanbanColumn.create({
        data: {
          id: v4(),
          uid,
          boardId,
          title: DEFAULT_COLUMNS[i],
          order: i
        }
      });
    }

    return newBoard;
  } catch (error) {
    console.error('Error creating Kanban board:', error);
    return null;
  }
}

export async function updateKanbanBoard(
  uid: string,
  id: string,
  data: { title?: string; emoji?: string }
) {
  try {
    const board = await prisma.kanbanBoard.findUnique({ where: { id } });
    if (!board || board.uid !== uid) {
      console.error('Unauthorized board update attempt');
      return null;
    }

    const updatedData: { title?: string; emoji?: string } = {};
    if (data.title !== undefined) updatedData.title = data.title.trim();
    if (data.emoji !== undefined) updatedData.emoji = data.emoji;

    const updated = await prisma.kanbanBoard.update({
      where: { id },
      data: updatedData
    });
    return updated;
  } catch (error) {
    console.error('Error updating Kanban board:', error);
    return null;
  }
}

export async function deleteKanbanBoard(uid: string, id: string) {
  try {
    const board = await prisma.kanbanBoard.findUnique({ where: { id } });
    if (!board || board.uid !== uid) {
      console.error('Unauthorized board delete attempt');
      return false;
    }

    await prisma.kanbanBoard.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error('Error deleting Kanban board:', error);
    return false;
  }
}

// ──────────────────────────────────────────────
// COLUMN ACTIONS
// ──────────────────────────────────────────────

export async function getKanbanBoard(uid: string, boardId: string) {
  try {
    // Verify board ownership
    const board = await prisma.kanbanBoard.findUnique({ where: { id: boardId } });
    if (!board || board.uid !== uid) {
      console.error('Unauthorized board access attempt');
      return [];
    }

    const columns = await prisma.kanbanColumn.findMany({
      where: { uid, boardId },
      orderBy: { order: 'asc' },
      include: {
        tickets: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return columns;
  } catch (error) {
    console.error('Error fetching Kanban board:', error);
    return [];
  }
}

export async function createKanbanColumn(uid: string, boardId: string, title: string, order: number) {
  try {
    // Verify board ownership
    const board = await prisma.kanbanBoard.findUnique({ where: { id: boardId } });
    if (!board || board.uid !== uid) {
      console.error('Unauthorized column creation attempt on foreign board');
      return null;
    }

    const newCol = await prisma.kanbanColumn.create({
      data: {
        id: v4(),
        uid,
        boardId,
        title,
        order
      },
      include: {
        tickets: true
      }
    });
    return newCol;
  } catch (error) {
    console.error('Error creating Kanban column:', error);
    return null;
  }
}

export async function updateKanbanColumnTitle(uid: string, id: string, title: string) {
  try {
    // Access control: Ensure user owns the column
    const col = await prisma.kanbanColumn.findUnique({ where: { id } });
    if (!col || col.uid !== uid) {
      console.error('Unauthorized column update attempt');
      return null;
    }

    const updated = await prisma.kanbanColumn.update({
      where: { id },
      data: { title }
    });
    return updated;
  } catch (error) {
    console.error('Error updating Kanban column title:', error);
    return null;
  }
}

export async function deleteKanbanColumn(uid: string, id: string) {
  try {
    // Access control
    const col = await prisma.kanbanColumn.findUnique({ where: { id } });
    if (!col || col.uid !== uid) {
      console.error('Unauthorized column delete attempt');
      return false;
    }

    await prisma.kanbanColumn.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error('Error deleting Kanban column:', error);
    return false;
  }
}

export async function updateKanbanColumnsOrder(uid: string, columnOrders: { id: string; order: number }[]) {
  try {
    // Wrap updates in a transaction for safety
    await prisma.$transaction(
      columnOrders.map((col) =>
        prisma.kanbanColumn.updateMany({
          where: { id: col.id, uid },
          data: { order: col.order }
        })
      )
    );
    return true;
  } catch (error) {
    console.error('Error updating columns order:', error);
    return false;
  }
}

// ──────────────────────────────────────────────
// TICKET ACTIONS
// ──────────────────────────────────────────────

export async function createKanbanTicket(
  uid: string,
  columnId: string,
  title: string,
  priority: string = 'NONE',
  order: number = 0,
  description: string = ''
) {
  try {
    // Access control: Ensure user owns the column they are adding a ticket to
    const col = await prisma.kanbanColumn.findUnique({ where: { id: columnId } });
    if (!col || col.uid !== uid) {
      console.error('Unauthorized ticket creation attempt in foreign column');
      return null;
    }

    const newTicket = await prisma.kanbanTicket.create({
      data: {
        id: v4(),
        uid,
        columnId,
        title: title.trim(),
        priority,
        order,
        description: description
      }
    });
    return newTicket;
  } catch (error) {
    console.error('Error creating Kanban ticket:', error);
    return null;
  }
}

export async function updateKanbanTicket(
  uid: string,
  id: string,
  data: {
    title?: string;
    description?: string;
    priority?: string;
    columnId?: string;
    order?: number;
  }
) {
  try {
    // Access control
    const ticket = await prisma.kanbanTicket.findUnique({ where: { id } });
    if (!ticket || ticket.uid !== uid) {
      console.error('Unauthorized ticket update attempt');
      return null;
    }

    // If changing columns, check target column ownership
    if (data.columnId && data.columnId !== ticket.columnId) {
      const targetCol = await prisma.kanbanColumn.findUnique({ where: { id: data.columnId } });
      if (!targetCol || targetCol.uid !== uid) {
        console.error('Unauthorized ticket move attempt to foreign column');
        return null;
      }
    }

    // Clean inputs
    const updatedData: typeof data = {};
    if (data.title !== undefined) updatedData.title = data.title.trim();
    if (data.description !== undefined) updatedData.description = data.description;
    if (data.priority !== undefined) updatedData.priority = data.priority;
    if (data.columnId !== undefined) updatedData.columnId = data.columnId;
    if (data.order !== undefined) updatedData.order = data.order;

    const updated = await prisma.kanbanTicket.update({
      where: { id },
      data: updatedData
    });
    return updated;
  } catch (error) {
    console.error('Error updating Kanban ticket:', error);
    return null;
  }
}

export async function deleteKanbanTicket(uid: string, id: string) {
  try {
    // Access control
    const ticket = await prisma.kanbanTicket.findUnique({ where: { id } });
    if (!ticket || ticket.uid !== uid) {
      console.error('Unauthorized ticket delete attempt');
      return false;
    }

    await prisma.kanbanTicket.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error('Error deleting Kanban ticket:', error);
    return false;
  }
}

export async function updateKanbanTicketsOrder(
  uid: string,
  ticketOrders: { id: string; columnId: string; order: number }[]
) {
  try {
    await prisma.$transaction(
      ticketOrders.map((t) =>
        prisma.kanbanTicket.updateMany({
          where: { id: t.id, uid },
          data: { columnId: t.columnId, order: t.order }
        })
      )
    );
    return true;
  } catch (error) {
    console.error('Error updating tickets order:', error);
    return false;
  }
}
