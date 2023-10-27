'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { exposeMatchers, getPokemon } from "../../utils/functions";
import { IPokeCardProps } from "@/lib/types";

export default function PokeCard({ cardWidth, imageSize, poke, randomPokemons, setRandomPokemons, cardFlipped, setCardFlipped, isEnd, setError }: IPokeCardProps) {
  const [pokemon, setPokemon] = useState<string>();

  useEffect(() => {
    getPokemon(poke.url)
    .then(res => setPokemon(res.other['official-artwork'].front_default))
    .catch(err => {
      console.error(err);
      setError(true);
    });
  }, []);

  const handleFlip = (id: string) => {
    /* when user clicks a card there is at least 1 card flipped.
    User can flip a card but can't flip more than 2 at the same time.
    If clicked card is not already found it'll be flipped. In the second condition,
    if there are already 2 flipped cards and user clicks one of them again, 
    it keeps the clicked one flipped and flips back the other one */
    if (cardFlipped < 2 && !poke.isFound) {
      setCardFlipped(prevCardFlipped => prevCardFlipped + 1);
      setRandomPokemons(prevRandomPokemons => {
        return prevRandomPokemons?.map((poke) => {
          if (!poke.isFound && id === poke.id) {
            return { ...poke, flip: true };
          }
          return poke;
        });
      });
    } else if(cardFlipped === 2 && !poke.isFound) {
      exposeMatchers(randomPokemons, setRandomPokemons);
      setCardFlipped(1);
      setRandomPokemons(prevRandomPokemons => {
        return prevRandomPokemons?.map((poke) => {
          if (!poke.isFound) {
            if (id === poke.id) {
              return { ...poke, flip: true };
            } else {
              return {...poke, flip: false};
            }
          }
          return poke;
        })
      })
    }
  };
  
  return (
    <div className={`${cardWidth || 'w-32 h-32'} flip-card bg-transparent justify-self-center ${poke.flip && 'clicked'}`} onClick={() => !isEnd && handleFlip(poke.id)}>
      <div className="flip-card-inner relative w-full h-full transition-transform duration-[600ms] shadow-[0_4px_8px_0_rbga(0,0,0,0.2)]">
        <div className="flip-card-front absolute w-full h-full bg-[#1D2C5E] text-white border-2 border-[#C7A008] flex justify-center items-center">
          <Image
            alt="Pokeball"
            src={'/pokeball.png'}
            width={imageSize || 100}
            height={imageSize || 100}
            className="h-auto select-none"
            priority
          />
        </div>
        <div className="flip-card-back absolute w-full h-full bg-[#1D2C5E] text-white border-2 border-[#C7A008] flex justify-center items-center">
          <Image
            alt={poke.name}
            src={pokemon || "/pokeball.png"}
            width={imageSize || 100}
            height={imageSize || 100}
            className="h-auto select-none"
            priority
          />
        </div>
      </div>
    </div>
  )
}