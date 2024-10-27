import { Document, Types } from "mongoose";

export interface ITask {
  name: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskDocument extends Omit<ITask, "_id">, Document {
  _id: Types.ObjectId;
}

export interface ITaskCompletion {
  taskId: string;
  userId: string;
  date: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskCompletionDocument extends Omit<ITaskCompletion, "_id">, Document {
    _id: Types.ObjectId;
}

interface FormattedTask {
  id: string;
  name: string;
  completions: {
    date: string;
    completed: boolean;
  }[];
}
