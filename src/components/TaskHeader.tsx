// components/TaskHeader.tsx
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface TaskHeaderProps {
  onWeekChange: (direction: "next" | "prev") => void;
  onSignOut: () => void;
}

export function TaskHeader({ onWeekChange, onSignOut }: TaskHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold dark:text-gray-100">My Tasks</h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-white"
      >
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
      <div className="flex gap-2">
        <button
          onClick={() => onWeekChange("prev")}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-white"
        >
          Previous Week
        </button>
        <button
          onClick={() => onWeekChange("next")}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-white"
        >
          Next Week
        </button>
        <Button
          onClick={onSignOut}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
