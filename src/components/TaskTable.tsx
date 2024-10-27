// components/TaskTable.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Task, DAYS_OF_WEEK } from "@/types/common";
import { getDatesInRange } from "@/lib/dates";

interface TaskTableProps {
  tasks: Task[];
  weekStart: Date;
  onUpdateCompletion: (
    taskId: string,
    date: string,
    completed: boolean
  ) => Promise<void>;
}

export function TaskTable({
  tasks,
  weekStart,
  onUpdateCompletion,
}: TaskTableProps) {
  return (
    <Table className="dark:bg-gray-800 dark:text-white">
      <TableCaption className="dark:text-gray-300">
        Everyday tasks logged in one place.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[125px] dark:text-gray-200">Tasks</TableHead>
          {DAYS_OF_WEEK.map((day) => (
            <TableHead key={day} className="w-[100px] dark:text-gray-200">
              {day}
            </TableHead>
          ))}
        </TableRow>
        <TableRow>
          <TableHead></TableHead>
          {getDatesInRange(weekStart, 7).map((date) => (
            <TableHead key={date.toISOString()} className="dark:text-gray-200">
              {date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium dark:text-gray-100">
              {task.name}
            </TableCell>
            {task.completions?.map((completion) => (
              <TableCell key={completion.date} className="dark:bg-gray-700">
                <Checkbox
                  style={{ display: "block" }}
                  className="w-4 h-4"
                  checked={completion.completed}
                  onCheckedChange={(checked) =>
                    onUpdateCompletion(
                      task.id,
                      completion.date,
                      checked as boolean
                    )
                  }
                />
              </TableCell>
            )) || (
              <TableCell colSpan={DAYS_OF_WEEK.length}>
                No completions available
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
