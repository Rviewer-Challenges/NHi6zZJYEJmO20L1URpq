import Image from "next/image";

export default function PokeballLoading() {
  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <Image
        src="/pokeball-no-shadow.png"
        alt="Pokeball"
        width={150}
        height={150}
        className="animate-bounce"
      />
    </div>
  )
}