"use client"
import Link from "next/link";
import { TodoItem, STATUS_COLORS } from "../types/todo";

interface ListCardProps {
  todo: TodoItem;
  onDelete: (id: string) => void;
}

export const ListCard = ({ todo, onDelete }: ListCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      onDelete(todo.id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    try {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, urgent: true };
      if (diffDays === 0) return { text: 'Due today', urgent: true };
      if (diffDays === 1) return { text: 'Due tomorrow', urgent: true };
      return { text: `${diffDays} days left`, urgent: false };
    } catch {
      return { text: '', urgent: false };
    }
  };

  const deadlineInfo = getDaysUntilDeadline(todo.deadline);

  return (
    <div className={`
      relative overflow-hidden rounded-xl
      bg-white
      border border-blue-200/70
      shadow-sm hover:shadow-md
      transition-all duration-300
      group-hover:border-blue-800/20
      group-hover:shadow-blue-300/20
      group-hover:-translate-y-0.5
      h-64 sm:h-72
      flex flex-col
    `}>
      <div
        className="cursor-pointer rounded-bl-md select-none hover:bg-red-800 p-1.5 bg-red-600 text-2xl w-9 h-9 items-center flex justify-center absolute top-0 right-0 text-white z-10"
        onClick={handleDelete}
        title="Delete todo"
      >
        ×
      </div>

      <Link
        href={{
          pathname: "/usertask",
          query: { title: todo.title },
        }}
        className="flex flex-col justify-between h-full w-full max-w-[380px] mx-auto group focus:outline-none focus:ring-1 focus:ring-blue-800 rounded-xl"
      >
        <div className="flex-1 px-6 pt-5 pb-3 flex flex-col select-none">
          <h3 className="text-xl font-semibold text-gray-800 tracking-tight line-clamp-2 mb-3 select-none">
            {todo.title}
          </h3>

          <p className={`text-gray-900 leading-relaxed line-clamp-4 flex-1 font-bold text-2xl ${STATUS_COLORS[todo.status]}`}>
            {todo.status}
          </p>
        </div>

        <div className={`
          px-6 py-3.5
          border-t border-gray-100
          bg-gradient-to-r from-blue-50/70 to-white
          flex items-center justify-between
          text-sm
        `}>
          <div className="flex flex-col">
            <time className="font-medium text-blue-600/90 tracking-wide">
              {formatDate(todo.deadline)}
            </time>
            {deadlineInfo.text && (
              <span className={`text-xs font-medium ${deadlineInfo.urgent ? 'text-red-600' : 'text-gray-500'}`}>
                {deadlineInfo.text}
              </span>
            )}
          </div>
          <div className="text-xs font-semibold text-gray-500">
            Task
          </div>
        </div>

        <div className={`
          absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/30
          transition-colors duration-300 pointer-events-none
          rounded-xl
        `} />
      </Link>
    </div>
  );
};