"use client"
import Header from "./components/header";
import { useState, useRef } from "react";
import { TodoStorage, TodoStatus, TODO_STATUS_OPTIONS } from "./types/todo";

interface HomeClientProps {
  onTodoAdded: () => void;
}

const Home_client = ({ onTodoAdded }: HomeClientProps) => {
  const [isNewClicked, setIsNewClicked] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const formTitle = useRef<HTMLInputElement>(null);
  const formDeadline = useRef<HTMLInputElement>(null);
  const formStatus = useRef<HTMLSelectElement>(null);

  const handleNewClick = () => {
    setIsNewClicked(true);
    setErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    const title = formTitle.current?.value?.trim();
    const deadline = formDeadline.current?.value;
    const status = formStatus.current?.value;

    if (!title) {
      errors.push("Title is required");
    } else if (title.length > 100) {
      errors.push("Title must be less than 100 characters");
    }

    if (!deadline) {
      errors.push("Deadline is required");
    } else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        errors.push("Deadline cannot be in the past");
      }
    }

    if (!status || !TODO_STATUS_OPTIONS.includes(status as TodoStatus)) {
      errors.push("Please select a valid status");
    }

    setErrors(errors);
    return errors.length === 0;
  };

  const saveTodo = (): void => {
    if (!validateForm()) return;

    const title = formTitle.current!.value.trim();
    const deadline = formDeadline.current!.value;
    const status = formStatus.current!.value as TodoStatus;

    try {
      TodoStorage.addTodo({
        title,
        deadline,
        status
      });

      // Reset form
      if (formTitle.current) formTitle.current.value = "";
      if (formDeadline.current) formDeadline.current.value = "";
      if (formStatus.current) formStatus.current.value = "";

      setIsNewClicked(false);
      setErrors([]);
      onTodoAdded();
    } catch (error) {
      console.error("Error saving todo:", error);
      setErrors(["Failed to save todo. Please try again."]);
    }
  };

  const NewTodoForm = () => (
    <div className="fixed top-0 left-0 bottom-0 right-0 justify-center items-center bg-gray-100 flex z-50 select-none">
      <button
        className="px-4 py-2 hover:bg-amber-500 cursor-pointer bg-yellow-600 text-lg text-amber-100 absolute top-10 left-10 rounded-lg"
        onClick={() => setIsNewClicked(false)}
      >
        Back
      </button>
      <div className="rounded-xl min-w-[300px] max-w-md w-full mx-4 p-8 bg-gray-50 shadow-lg flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Todo</h2>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <ul className="text-red-700 text-sm">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-semibold text-lg text-gray-700">
              Title:
            </label>
            <input
              id="title"
              ref={formTitle}
              className="w-full border-2 rounded-md px-4 h-11 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter todo title"
              maxLength={100}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="deadline" className="font-semibold text-lg text-gray-700">
              Deadline:
            </label>
            <input
              id="deadline"
              type="date"
              ref={formDeadline}
              className="w-full border-2 rounded-md px-4 h-11 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-semibold text-lg text-gray-700">
              Priority:
            </label>
            <select
              id="status"
              ref={formStatus}
              className="border-2 rounded-md px-4 h-11 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select priority</option>
              {TODO_STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="rounded-md bg-amber-500 py-3 cursor-pointer text-lg text-amber-100 hover:bg-amber-600 active:bg-amber-400 transition-colors"
          onClick={saveTodo}
        >
          Save Todo
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Header button={handleNewClick} />
      {isNewClicked && <NewTodoForm />}
    </div>
  );
};

export default Home_client;
