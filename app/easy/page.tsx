import PokeDex from "@/components/pokemon/PokeDex";

export default function EasyLevel() {
  return (
    <PokeDex 
      containerClass="lg:flex-row lg:justify-around lg:items-stretch"
      gridClass="max-w-2xl 2xs:gap-4 xs:grid-cols-4"
    />
  )
}