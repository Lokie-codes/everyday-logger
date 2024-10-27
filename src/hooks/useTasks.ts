// hooks/useTasks.ts
import { useState, useEffect } from "react";
import { Task, UpdateCompletionPayload } from "@/types/common";
import { getDatesInRange } from "@/lib/dates";

export function useTasks(weekStart: Date) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/tasks/weekly?startDate=${weekStart.toISOString().split("T")[0]}`
      );
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data: Task[] = await response.json();

      const tasksWithDefaults = data.map((task) => ({
        ...task,
        completions:
          task.completions ||
          getDatesInRange(weekStart, 7).map((date) => ({
            date: date.toISOString().split("T")[0],
            completed: false,
          })),
      }));

      setTasks(tasksWithDefaults);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (name: string): Promise<void> => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to add task");
      window.location.reload();
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task");
    }
  };

  const updateTaskCompletion = async (
    taskId: string,
    date: string,
    completed: boolean
  ): Promise<void> => {
    try {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completions: task.completions.map((c) =>
                  c.date === date ? { ...c, completed } : c
                ),
              }
            : task
        )
      );

      const payload: UpdateCompletionPayload = { taskId, date, completed };
      const response = await fetch("/api/tasks/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task completion:", error);
      await fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [weekStart]);

  return { tasks, loading, error, addTask, updateTaskCompletion };
}
