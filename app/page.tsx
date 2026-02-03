"use client"
import { useState } from "react";
import Home_client from "./home_client";
import { Lists } from "./components/lists";

export default function Home() {

  const [cards, setCards] = useState<string>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("Cards") || ""
      : ""
  );

  return (
    <div className="w-screen min-h-screen bg-gray-100 p-3 flex flex-col gap-13 overflow-x-hidden">
      <Home_client setCards={setCards} />
      <Lists cards={cards} setCards={setCards} />
    </div>
  );
}
