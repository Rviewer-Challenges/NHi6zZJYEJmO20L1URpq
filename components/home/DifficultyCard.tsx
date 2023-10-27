import { Difficulty } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function DifficultyCard({ item }: { item: Difficulty }) {
  return (
    <div id={item.id} className="flex flex-col justify-center text-center gap-y-1 text-[#EDBC06] relative">
      <div className="w-48 h-48 card border-8 border-[#EDBC06]">
        <Link href={item.url}>
          <Image
            alt={item.name}
            src={item.img}
            className="w-full h-full relative z-10"
          />
        </Link>
      </div>
      <h3 className="text-xl font-poke lg:text-[22px] tracking-wider">{item.name}</h3>
    </div>
  )
}