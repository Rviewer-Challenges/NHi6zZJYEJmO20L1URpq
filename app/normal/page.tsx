import PokeDex from "@/components/pokemon/PokeDex";

export default function NormalLevel() {
  return (
    <PokeDex
      containerClass="lg:gap-y-6 xl:flex-row xl:justify-around xl:items-stretch"
      gridClass="max-w-4xl 2xs:grid-cols-3 2xs:gap-1 xs:grid-cols-4 xs:gap-4 lg:grid-cols-6"
    />
  )
}