

// onclick on button it will spawn a area where i can spesify Title and reason and list of tasks and mebey the time when expected to finish tasks

type HeaderProps = {
  button: () => void;
};

export default function Header({ button }: HeaderProps) {
  return (
    <div className="border-b-black flex justify-between p-9 select-none">
      <div className="text-blue-700 font-bold text-3xl text-shadow-lg/20 text-shadow-blue-300 cursor-default flex gap-5 items-center">
        <p>NotBad</p> <img className="w-10" src="icon.png" alt="" />
      </div>
      <div
        onClick={button}
        className="flex bg-blue-600 px-9 py-2 rounded-lg items-center gap-2 cursor-pointer hover:bg-blue-500 max-sm:text-sm max-sm:w-30"
      >
        <p className="text-white font-bold font-sans">New Todo</p>
        <span className="text-white text-2xl font-extrabold">+</span>
      </div>
    </div>
  );
}


