"use client"
import { ListCard } from "./Listcard"

export const Lists = ({cards, setCards}: {cards: string, setCards: React.Dispatch<React.SetStateAction<string>>}) =>
{
    const myArr = cards.trim().split("$$").filter(Boolean);

    function clear_data()
    {
        localStorage.clear();
        setCards("");
    }

    function create_Cards(card: string, index: number)
    {
        const b = card.split("%%");

        return (
            <ListCard
            key={index}
            num={index}
            title={b[0]}
            date={b[1]}
            desc={b[2]}
            setCards={setCards}
            />
        );
    }

    return (
        <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-10 md:gap-12">
            <h2 className="text-blue-800 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight select-none">
                Lists
            </h2>

            <div
                className="
                grid
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                gap-6 sm:gap-7 md:gap-8
                auto-rows-fr
            "
            >
                {myArr.map(create_Cards)}
            </div>

            <div
                onClick={clear_data}
                className="flex bg-red-800 px-9 py-2 rounded-lg items-center gap-2 cursor-pointer hover:bg-red-700 text-2xl text-white w-30 fixed select-none  right-10 bottom-10"
            >
                clear
            </div>
        </div>
    )
}
