import PokeDex from "@/components/pokemon/PokeDex";

export default function NormalLevel() {
  return (
    <div className="flex w-full min-h-screen items-center">
      <PokeDex
        containerClass="flex flex-col w-full py-4 items-center lg:gap-y-6 xl:flex-row xl:justify-around xl:items-stretch"
        gridClass="grid grid-cols-2 w-max max-w-4xl gap-2 2xs:grid-cols-3 2xs:gap-1 xs:grid-cols-4 xs:gap-4 lg:grid-cols-6 justify-center"
      />
    </div>
  )
}