'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

async function getPokemon(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default function PokeCard({ poke }: { poke: Pokemon}) {
  const [flip, setFlip] = useState(false);
  const [pokemon, setPokemon] = useState<string>();

  useEffect(() => {
    getPokemon(poke.url)
    .then(res => setPokemon(res.sprites.other['official-artwork'].front_default))
    .catch(err => console.error(err));
  }, [])

  const handleFlip = () => {
    setFlip(true);
  }

  return (
    <div className={`w-32 h-32 flip-card bg-transparent ${flip && 'clicked'}`} onClick={handleFlip}>
      <div className="flip-card-inner relative w-full h-full transition-transform duration-[600ms] shadow-[0_4px_8px_0_rbga(0,0,0,0.2)]">
        <div className="flip-card-front absolute w-full h-full bg-[#1D2C5E] text-white border-2 border-[#C7A008] flex justify-center items-center">
          <Image
            alt="Pokeball"
            src={'/pokeball.png'}
            width={100}
            height={100}
          />
        </div>
        <div className="flip-card-back absolute w-full h-full bg-[#1D2C5E] text-white border-2 border-[#C7A008] flex justify-center items-center">
          <Image
            alt={poke.name}
            src={pokemon || ""}
            width={128}
            height={128}
          />
        </div>
      </div>
    </div>
  )
}