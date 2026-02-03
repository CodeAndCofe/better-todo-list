"use client"
import Link  from "next/link";
import { useRouter } from 'next/navigation';
type ListCardProps = {
  title: string;
  date: string;
  desc: string;
  num: number;
  setCards: React.Dispatch<React.SetStateAction<string>>
};


export const ListCard = ({ title, date, desc, num, setCards }: ListCardProps) => {
  const color : any = {
    "Urgent": "text-red-600",
    "important but not Urgent": "text-yellow-500",
    "safe": "text-green-500"
  };

  

 function delete_element() {
  let cards = localStorage.getItem("Cards") || "";
  if (!cards) return;

  const updated = cards
    .split("$$")
    .filter((_, i) => i !== num)
    .filter(Boolean)
    .join("$$");
  console.log(updated);
  localStorage.setItem("Cards", updated);
   setCards(updated);
}
    


  return (
    <div
        className={`
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
          
          `}
      >
        <div className="cursor-pointer rounded-bl-md select-none hover:bg-red-800 p-1.3 bg-red-600 text-2xl w-9 items-center flex justify-center absolute top-0 right-0 text-white" onClick={delete_element}>x</div>
          <Link
            href={{
              pathname: "/usertask",
              query: { title },
            }} className="flex flex-col justify-between h-full w-full max-w-[380px] mx-auto group focus:outline-none focus:ring-1 focus:ring-blue-800 rounded-xl"
            >
            <div className="flex-1 px-6 pt-5 pb-3 flex flex-col select-none">
              <h3 className="text-xl font-semibold text-gray-800 tracking-tight line-clamp-2 mb-3 select-none">
                {title}
              </h3>

            <p className={`text-gray-900 leading-relaxed line-clamp-4 flex-1 font-bold text-2xl ${color[desc]}`}
                >
                {desc}
            </p>
            </div>
            <div
              className={`
                px-6 py-3.5
                border-t border-gray-100
                bg-gradient-to-r from-blue-50/70 to-white
                flex items-center justify-between
                text-sm
              `}
            >
              <time className="font-medium text-blue-600/90 tracking-wide">
                {date}
              </time>
              <div className="text-xs font-semibold text-gray-500">
                Task
              </div>
            </div>
            <div
              className={`
                absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/30
                transition-colors duration-300 pointer-events-none
                rounded-xl
              `}
            />
        </Link>
      </div>
  );
};