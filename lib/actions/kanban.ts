'use server';

import { v4 } from 'uuid';
import prisma from '@/lib/prisma';

// SEED DEFAULT COLUMNS
const DEFAULT_COLUMNS = ['Backlog', 'Waiting', 'In Progress', 'Review', 'Done'];

export async function getKanbanBoard(uid: string) {
  try {
    // 1. Fetch user columns with tickets
    let columns = await prisma.kanbanColumn.findMany({
      where: { uid },
      orderBy: { order: 'asc' },
      include: {
        tickets: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // 2. Seed default columns if none exist
    if (columns.length === 0) {
      const createdColumns = [];
      for (let i = 0; i < DEFAULT_COLUMNS.length; i++) {
        const col = await prisma.kanbanColumn.create({
          data: {
            id: v4(),
            uid,
            title: DEFAULT_COLUMNS[i],
            order: i
          },
          include: {
            tickets: true
          }
        });
        createdColumns.push(col);
      }
      columns = createdColumns;
    }

    return columns;
  } catch (error) {
    console.error('Error fetching Kanban board:', error);
    return [];
  }
}

export async function createKanbanColumn(uid: string, title: string, order: number) {
  try {
    const newCol = await prisma.kanbanColumn.create({
      data: {
        id: v4(),
        uid,
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

export async function createKanbanTicket(
  uid: string,
  columnId: string,
  title: string,
  priority: string = 'NONE',
  order: number = 0
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
        description: ''
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
