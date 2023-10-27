import PokeDex from "@/components/pokemon/PokeDex";

export default function HardLevel() {
  return (
    <PokeDex
      containerClass="lg:gap-y-6 xl:flex-row xl:justify-around xl:items-stretch"
      gridClass="max-w-4xl 2xs:grid-cols-3 2xs:gap-1 xs:grid-cols-5 sm:gap-2 md:grid-cols-6 md:gap-4"
      cardWidth="w-24 h-24 sm:w-28 sm:h-28"
      imageSize={85}
    />
  )
}