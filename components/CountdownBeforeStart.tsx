export default function CountdownBeforeStart({ countdown }: {countdown: number}) {
  return (
    <div className="w-screen h-screen absolute top-0 bottom-0 left-0 right-0 z-50 bg-white/50 flex items-center justify-center">
      <h2 className="text-3xl xs:text-4xl lg:text-5xl text-center text-[#1D2C5E] font-poke tracking-wider">
        Your Game Will Start in <span>{countdown}</span>
      </h2>
    </div>
  )
}