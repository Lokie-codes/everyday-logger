// types/common.ts
export interface TaskCompletion {
  date: string;
  completed: boolean;
}

export interface Task {
  id: string;
  name: string;
  userId: string;
  completions: TaskCompletion[];
}

export interface CreateTaskRequest {
  name: string;
}

export interface UpdateCompletionPayload {
  taskId: string;
  date: string;
  completed: boolean;
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
