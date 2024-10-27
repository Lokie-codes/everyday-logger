// app/api/tasks/completion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TaskCompletion from '@/models/TaskCompletion';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { UpdateCompletionPayload } from '@/types/common';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { taskId, date, completed }: UpdateCompletionPayload = await request.json();

    // Validate inputs
    if (!taskId || !date) {
      return NextResponse.json(
        { error: 'TaskId and date are required' },
        { status: 400 }
      );
    }

    // Validate taskId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json(
        { error: 'Invalid taskId format' },
        { status: 400 }
      );
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const taskCompletion = await TaskCompletion.findOneAndUpdate(
      {
        taskId,
        userId: session.user.id,
        date: parsedDate
      },
      { completed },
      { upsert: true, new: true }
    );

    return NextResponse.json(taskCompletion);
  } catch (error) {
    console.error('Error updating task completion:', error);
    return NextResponse.json(
      { error: 'Failed to update task completion' },
      { status: 500 }
    );
  }
}