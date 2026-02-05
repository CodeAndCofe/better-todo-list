"use client"
import { useState, useEffect } from "react";
import Home_client from "./home_client";
import { Lists } from "./components/lists";
import { TodoItem, TodoStorage } from "./types/todo";

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    // Migrate legacy data on first load
    TodoStorage.migrateFromLegacyFormat();
    // Load todos
    setTodos(TodoStorage.getTodos());
  }, []);

  const updateTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 p-3 flex flex-col gap-13 overflow-x-hidden">
      <Home_client onTodoAdded={() => setTodos(TodoStorage.getTodos())} />
      <Lists todos={todos} onTodosChange={updateTodos} />
    </div>
  );
}
