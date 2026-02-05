"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubtaskStorage } from "../types/todo";

export default function Search() {
    const params = useSearchParams();
    const titleKey = params.get("title") || "";

    const [subtasks, setSubtasks] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (titleKey) {
            // Migrate any legacy subtask data
            SubtaskStorage.migrateLegacySubtasks();
            setSubtasks(SubtaskStorage.getSubtasks(titleKey));
        }
    }, [titleKey]);

    const validateSubtask = (text: string): boolean => {
        const trimmed = text.trim();
        if (!trimmed) {
            setErrors(["Subtask cannot be empty"]);
            return false;
        }
        if (trimmed.length > 200) {
            setErrors(["Subtask must be less than 200 characters"]);
            return false;
        }
        if (subtasks.includes(trimmed)) {
            setErrors(["This subtask already exists"]);
            return false;
        }
        setErrors([]);
        return true;
    };

    const deleteSubtask = (text: string) => {
        if (window.confirm(`Delete subtask: "${text}"?`)) {
            SubtaskStorage.deleteSubtask(titleKey, text);
            setSubtasks(SubtaskStorage.getSubtasks(titleKey));
        }
    };

    const addSubtask = () => {
        const value = inputRef.current?.value?.trim();
        if (!value) return;

        if (!validateSubtask(value)) return;

        try {
            SubtaskStorage.addSubtask(titleKey, value);
            setSubtasks(SubtaskStorage.getSubtasks(titleKey));
            if (inputRef.current) inputRef.current.value = "";
            setErrors([]);
        } catch (error) {
            console.error("Error adding subtask:", error);
            setErrors(["Failed to add subtask"]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addSubtask();
        }
    };

    const renderSubtask = (text: string, index: number) => {
        return (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                <div className="flex-1 font-medium text-gray-800">{text}</div>
                <button
                    className="ml-3 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                    onClick={() => deleteSubtask(text)}
                    title="Delete subtask"
                >
                    Delete
                </button>
            </div>
        );
    };

    if (!titleKey) {
        return (
            <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Todo Selected</h2>
                    <p className="text-gray-600">Please select a todo item to manage its subtasks.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
            <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Subtasks</h1>
                    <p className="text-gray-600">Todo: <span className="font-semibold">{titleKey}</span></p>
                </div>

                {errors.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <ul className="text-red-700 text-sm">
                            {errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-2 mb-6">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Add a new subtask..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={handleKeyPress}
                        maxLength={200}
                    />
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        onClick={addSubtask}
                    >
                        Add
                    </button>
                </div>

                <div className="space-y-3">
                    {subtasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No subtasks yet. Add your first subtask above!
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                Subtasks ({subtasks.length})
                            </h3>
                            {subtasks.map(renderSubtask)}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}