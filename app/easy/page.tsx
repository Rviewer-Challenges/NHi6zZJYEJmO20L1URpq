import PokeDex from "@/components/PokeDex";

async function delay(num: number) {
  return new Promise((resolve) => setTimeout(resolve, num));
}

export default async function EasyLevel() {

  await delay(3000);
  return (
    <div className="flex w-full min-h-screen items-center">
      <PokeDex 
        containerClass="flex flex-col w-full py-4 items-center lg:flex-row lg:justify-around lg:items-stretch"
        gridClass="grid grid-cols-2 w-max max-w-2xl gap-2 2xs:gap-4 xs:grid-cols-4 justify-center"
      />
    </div>
  )
}