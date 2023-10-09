import PokeDex from "@/components/PokeDex";

export default function EasyLevel() {
  return (
    <div className="flex w-full min-h-screen items-center">
      <div className="flex flex-wrap gap-4 max-w-2xl ml-auto">
        <PokeDex />
      </div>
    </div>
  )
}