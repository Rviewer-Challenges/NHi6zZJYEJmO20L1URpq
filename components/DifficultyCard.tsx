import Image, { StaticImageData } from "next/image";

interface Difficulty {
  id: string,
  name: string,
  url: string,
  img: StaticImageData
}

export default function DifficultyCard({ item }: { item: Difficulty }) {
  return (
    <div id={item.id} className="flex flex-col justify-center text-center gap-y-1 text-[#EDBC06]">
      <div className="w-48 h-48 square">
        <Image
          alt={item.name}
          src={item.img}
          className="w-full h-full"
        />
      </div>
      <h3 className="text-xl font-poke lg:text-[22px]">{item.name}</h3>
    </div>
  )
}