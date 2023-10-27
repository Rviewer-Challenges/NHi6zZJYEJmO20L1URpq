export default function Result({ message, playAgain }: { message: {top: string; bottom: string}; playAgain:() => void }) {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#EDBC06]/80 z-10 w-full text-3xl xs:text-4xl lg:text-5xl/snug text-center font-poke py-6 text-[#1D2C5E] tracking-wider result-bg">
      <h2 className="result-text">
        {message.top} <br /> {message.bottom}
      </h2>
      <h2 className="cursor-pointer w-max mx-auto max-h-0 overflow-hidden play-again mt-4 animate-ping hover:text-white" onClick={playAgain}>- Play Again -</h2>
    </div>
  )
}