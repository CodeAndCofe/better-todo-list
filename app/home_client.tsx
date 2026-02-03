"use client"
import Header from "./components/header";
import { useState, useRef } from "react";

const Home_client = ({ setCards }: { setCards: React.Dispatch<React.SetStateAction<string>> }) => {
    const [is_new_clicked, setIs_new_clicked] = useState<boolean>(false);

    const formTitle = useRef<HTMLInputElement>(null);
    const formDeadline = useRef<HTMLInputElement>(null);
    const formStatus = useRef<HTMLSelectElement>(null);

    function isNewClicked()
    {
        setIs_new_clicked(true);
    }

    function checker(): boolean
    {
        let temp: any = [
            formTitle.current?.value,
            formDeadline.current?.value,
            formStatus.current?.value
        ];

        for (let i = 0; i < temp.length; i++)
        {
            for (let j = 0; j < temp[i].length; j++)
            {
                if (temp[i][j] == '%' && temp[i][j + 1] == '%')
                {
                    alert("this delmeter %% dosent suported print percent instead or use one %");
                    return false;
                }
                j++;
            }
            i++;
        }
        return true;
    }

    function save_status(): void
    {
        if (
            formTitle.current?.value === "" ||
            formDeadline.current?.value === "" ||
            formStatus.current?.value === ""
        )
            return;

        if (!checker())
            return;

        const data =
            formTitle.current?.value + "%%" +
            formDeadline.current?.value + "%%" +
            formStatus.current?.value + "$$";

        const existing = localStorage.getItem("Cards") || "";
        const updated = existing + data;

        localStorage.setItem("Cards", updated);

        setCards(updated);

        setIs_new_clicked(false);
    }

    function New_todo(): any
    {
        return (
            <div className="fixed top-0 left-0 bottom-0 right-0 justify-center items-center bg-gray-100 flex z-99 select-none ">
                <button className="px-4 py-2 hover:bg-amber-500 cursor-pointer bg-yellow-600 text-lg text-amber-100 absolute top-10 left-10 rounded-lg" onClick={()=> setIs_new_clicked(false)}>Back</button>
                <div className="rounded-xl min-sm::max-w-120 md:w-150 p-8 bg-gray-50 shadow-lg flex flex-col gap-8">

                    <div className="flex flex-col gap-5">
                        <h3 className="font-bold text-2xl">Title:</h3>
                        <input ref={formTitle} className="w-full border-2 rounded-sm px-4 h-11" />
                    </div>

                    <div className="flex flex-col gap-5">
                        <h3 className="font-bold text-2xl">deadline:</h3>
                        <input type="date" ref={formDeadline} className="w-full border-2 rounded-sm px-4 h-11" />
                    </div>

                    <div className="flex flex-col gap-5">
                        <h3 className="font-bold text-2xl">status:</h3>
                        <select ref={formStatus} className="border-2 rounded-sm px-4 h-11 text-xl font-bold">
                            <option value="">status</option>
                            <option value="Urgent">Urgent</option>
                            <option value="important but not Urgent">important but not Urgent</option>
                            <option value="safe">safe</option>
                        </select>
                    </div>

                    <button
                        className="rounded-md bg-amber-500 py-3 cursor-pointer  text-lg  text-amber-100 active:bg-amber-400"
                        onClick={save_status}
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header button={isNewClicked} />
            {is_new_clicked && <New_todo />}
        </div>
    );
}

export default Home_client;
