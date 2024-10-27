// app/api/tasks/weekly/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import TaskCompletion from '@/models/TaskCompletion';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Task as TaskType } from '@/types/common';

interface CompletionsMap {
  [taskId: string]: {
    [date: string]: boolean;
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');

    if (!startDateParam) {
      return NextResponse.json(
        { error: 'startDate parameter is required' },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateParam);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid startDate format' },
        { status: 400 }
      );
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const [tasks, completions] = await Promise.all([
      Task.find({ userId: session.user.id }),
      TaskCompletion.find({
        userId: session.user.id,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
    ]);

    const completionsMap = completions.reduce<CompletionsMap>((acc, completion) => {
      const taskIdString = completion.taskId.toString();
      const dateKey = completion.date.toISOString().split('T')[0];
      if (!acc[taskIdString]) {
        acc[taskIdString] = {};
      }
      acc[taskIdString][dateKey] = completion.completed;
      return acc;
    }, {});

    const formattedTasks: TaskType[] = tasks.map(task => ({
      id: task._id.toString(),
      name: task.name,
      userId: task.userId,
      completions: getDatesInRange(startDate, endDate).map(date => {
        const dateKey = date.toISOString().split('T')[0];
        const taskIdString = task._id.toString();
        return {
          date: dateKey,
          completed: completionsMap[taskIdString]?.[dateKey] ?? false
        };
      })
    }));

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching weekly tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly tasks' },
      { status: 500 }
    );
  }
}

function getDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}