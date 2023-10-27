import PokeDex from "@/components/pokemon/PokeDex";

export default function HardLevel() {
  return (
    <div className="flex w-full min-h-screen items-center">
      <PokeDex
        containerClass="flex flex-col w-full py-4 items-center lg:gap-y-6 xl:flex-row xl:justify-around xl:items-stretch"
        gridClass="grid grid-cols-2 w-max max-w-4xl gap-2 2xs:grid-cols-3 2xs:gap-1 xs:grid-cols-5 sm:gap-2 md:grid-cols-6 md:gap-4 justify-center"
        cardWidth="w-24 h-24 sm:w-28 sm:h-28"
        imageSize={85}
      />
    </div>
  )
}