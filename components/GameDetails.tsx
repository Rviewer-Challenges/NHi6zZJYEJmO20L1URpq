export function GameDetails({ timer, pairs }: { timer: number; pairs: number | undefined }) {
  return (
    <div className="text-[#EDBC06] font-poke flex flex-col items-center gap-y-3 pb-4 tracking-widest lg:justify-between lg:p-2 lg:items-start">
      <div className="flex flex-col gap-y-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl">Remaining Time: <span className="text-white">{timer}</span></h2>
        <h3 className="text-base sm:text-xl lg:text-2xl">Remaining Pairs: {pairs !== undefined && <span className="text-white">{pairs}</span>}</h3>
        <h3 className="text-base sm:text-xl lg:text-2xl">Move Counter: <span className="text-white">0</span></h3>
      </div>
      <button className="border-2 border-yellow-400 w-max px-4 py-2 lg:p-4 rounded-3xl bg-[#1D2C5E] tracking-widest hover:bg-[#EDBC06] hover:text-[#1D2C5E] hover:border-[#1D2C5E]">Return to Difficulties</button>
    </div>
  )
}