"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";



export default function Search()
{
    const params = useSearchParams();
    const titleKey = params.get("title") || "";

    const [myArr, setMyArr] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem(titleKey) || "";
        const arr = stored.split("%%").filter(Boolean);
        setMyArr(arr);
    }, [titleKey]);
    function    delete_item(text:string)
    {
        let index:number  = myArr.findIndex((e)=> text === e);

        const item1 = myArr.slice(0, index);
        const item2 = myArr.slice(index + 1);

        console.log(item1, item2);
        const updated = [...item1, ...item2];
        setMyArr(updated);
        localStorage.setItem(titleKey, updated.join("%%"));
    }

    function renderItem(text: string, index: number) {
        return (
            <div key={index} className="flex justify-between items-center font-bold text-lg">
                <div>{text}</div>
                <div className="rounded-lg p-1 bg-red-700 font-bold text-white px-3 cursor-pointer" onClick={()=> delete_item(text)}>
                    X
                </div>
            </div>
        );
    }
    function    checker(): boolean
    {
        const   temp:string = inputRef.current?.value || "";
        for (let i:number = 0; i < temp.length; i++)
        {
            if (temp[i] == '%' && temp[i + 1] == '%')
            {
                alert("this delmeter %% dosent suported print percent instead or use one %");
                return false;
            }
            i++;
        }
        return true;
    }
    function submitted() {
        if (!inputRef.current?.value) return;
        if (checker() == false) return ;
        const newTask = inputRef.current.value;

        const updated = [...myArr, newTask];

        setMyArr(updated);

        localStorage.setItem(titleKey, updated.join("%%"));

        inputRef.current.value = "";
    }

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col justify-center items-center select-none ">
            <div className="max-w-300 w-100 bg-white shadow-2xl min-h-40 rounded-lg p-4">
                <div className="flex justify-center">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full px-5 bg-gray-50 border-gray-50 focus:outline-1 focus:outline-gray-400 rounded-l-lg"
                    />
                    <button
                        className="px-8 text-lg font-bold text-gray-200 py-3 bg-gray-800 outline-1 cursor-pointer active:bg-gray-600 rounded-r-lg"
                        onClick={submitted}
                    >
                        Add
                    </button>
                </div>

                <div className="mt-8 flex flex-col gap-5 px-5 space-y-2">
                    {myArr.map(renderItem)}
                </div>
            </div>
        </div>
    );
}