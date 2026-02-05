"use client"
import { ListCard } from "./Listcard";
import { TodoItem, TodoStorage } from "../types/todo";

interface ListsProps {
  todos: TodoItem[];
  onTodosChange: (todos: TodoItem[]) => void;
}

export const Lists = ({ todos, onTodosChange }: ListsProps) => {
  const clearAllTodos = () => {
    TodoStorage.clearTodos();
    onTodosChange([]);
  };

  const handleDeleteTodo = (id: string) => {
    TodoStorage.deleteTodo(id);
    onTodosChange(TodoStorage.getTodos());
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-10 md:gap-12">
      <div className="flex items-center justify-between">
        <h2 className="text-blue-800 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight select-none">
          Todo Lists ({todos.length})
        </h2>
        {todos.length > 0 && (
          <button
            onClick={clearAllTodos}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No todos yet. Create your first todo!</p>
        </div>
      ) : (
        <div className="
          grid
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
          gap-6 sm:gap-7 md:gap-8
          auto-rows-fr
        ">
          {todos.map((todo) => (
            <ListCard
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}

      {todos.length > 0 && (
        <div
          onClick={clearAllTodos}
          className="flex bg-red-800 px-9 py-2 rounded-lg items-center gap-2 cursor-pointer hover:bg-red-700 text-2xl text-white w-30 fixed select-none right-10 bottom-10"
        >
          Clear All
        </div>
      )}
    </div>
  );
};
