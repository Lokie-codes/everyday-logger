"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { getStartOfWeek } from "@/lib/dates";
import { useTasks } from "../hooks/useTasks";
import { TaskHeader } from "../components/TaskHeader";
import { AddTask } from "../components/AddTask";
import { TaskTable } from "../components/TaskTable";

export default function Home() {
  const [weekStart, setWeekStart] = useState<Date>(getStartOfWeek(new Date()));
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { tasks, loading, error, addTask, updateTaskCompletion } = useTasks(weekStart);

  if (!user && !authLoading) {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const navigateWeek = (direction: "next" | "prev"): void => {
    setWeekStart((current) => {
      const newDate = new Date(current);
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  if (authLoading || loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500 dark:text-red-300">
        Error: {error}
      </div>
    );
  }

  return (
    <body className="dark:bg-gray-800 dark:text-white p-5">
      <main className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
        <TaskHeader onWeekChange={navigateWeek} onSignOut={handleSignOut} />
        <AddTask onAddTask={addTask} />
        <TaskTable
          tasks={tasks}
          weekStart={weekStart}
          onUpdateCompletion={updateTaskCompletion}
        />
      </main>
    </body>
  );
}