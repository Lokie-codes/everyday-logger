// components/AddTask.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddTaskProps {
  onAddTask: (name: string) => Promise<void>;
}

export function AddTask({ onAddTask }: AddTaskProps) {
  const [newTaskName, setNewTaskName] = useState("");

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return;
    await onAddTask(newTaskName);
    setNewTaskName("");
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Enter new task name"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        className="max-w-sm dark:bg-gray-800 dark:text-white"
      />
      <Button
        onClick={handleAddTask}
        className="dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
}