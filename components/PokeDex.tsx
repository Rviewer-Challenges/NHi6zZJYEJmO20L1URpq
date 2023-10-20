'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import PokeCard from "./PokeCard";
import { usePathname } from "next/navigation";
import { GameDetails } from "./GameDetails";
import ReactConfetti from "./ReactConfetti";
import { addCardIdAndFlip, addId, duplicateArrayItems, exposeMatchers, finalPokemonArray, generateRandomPokemons, shuffleArray } from "./utils/functions";

async function getPokemons() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50');
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
};

export default function PokeDex() {
  const path = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  const [pokemons, setPokemons] = useState<any>(null);
  const [randomPokemons, setRandomPokemons] = useState<Pokemon[] | undefined>(undefined);
  const [cardFlipped, setCardFlipped] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [timer, setTimer] = useState(60);
  const [pairs, setPairs] = useState<number | undefined>(undefined);
  const [moveCounter, setMoveCounter] = useState(0);

  useEffect(() => {
    getPokemons().then(res => setPokemons(res.results));
  }, []);

  useEffect(() => {
    if(path === '/easy' && pokemons) {
      let pokeArray = generateRandomPokemons(pokemons, 8);
      pokeArray = finalPokemonArray(pokeArray);
      setRandomPokemons(pokeArray);
      setPairs(8);
    } else if(path === '/normal' && pokemons) {
      let pokeArray = generateRandomPokemons(pokemons, 12);
      pokeArray = finalPokemonArray(pokeArray);
      setRandomPokemons(pokeArray);
      setPairs(12);
    } else if(path === '/hard' && pokemons) {
      let pokeArray = generateRandomPokemons(pokemons, 15);
      pokeArray = finalPokemonArray(pokeArray);
      setRandomPokemons(pokeArray);
      setPairs(15);
    }
  }, [pokemons]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if(timer > 0) {
        setTimer(prevTimer => prevTimer - 1);
      } else {
        clearInterval(countdown);
      }
    }, 1000);

    if(isEnd) {
      clearInterval(countdown);
    }

    if(pairs === 0 || timer === 0) {
      setIsEnd(true);
    }

    return () => clearInterval(countdown);
  }, [timer])

  useEffect(() => {
    // check the not found pokemons, half of them will give the number of pairs left
    const notFounds = randomPokemons?.filter(poke => !poke.isFound);
    setPairs(notFounds && notFounds.length / 2);

    // check the flipped but not found pokemons, if there are 2 flipped cards increase the counter
    const flippedCards = randomPokemons?.filter(poke => poke.flip && !poke.isFound);
    if(flippedCards?.length === 2) {
      setMoveCounter(preCounter => preCounter + 1);
    }
  }, [randomPokemons])

  useEffect(() => {
    if (cardFlipped === 2) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // if 2 cards are flipped, check if they are matching or not
      exposeMatchers(randomPokemons, setRandomPokemons);

      // if 2 cards are flipped and user doesn't flip a 3rd card, flip those cards back after 1.5 sec
      timeoutRef.current = setTimeout(() => {
        setRandomPokemons(prevRandomPokemons => {
          return prevRandomPokemons?.map((poke) => poke.isFound ? poke : { ...poke, flip: false });
        });
      }, 1500);
    } else if (cardFlipped === 1) {
      // if user flips 3rd card clear the 1.5 sec timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [cardFlipped]);

  const memoizedRandomPokemons = useMemo(() => randomPokemons, [randomPokemons]);

  return (
    <div className="flex flex-col w-full py-4 items-center lg:flex-row lg:justify-around lg:items-stretch">
      <GameDetails
        timer={timer}
        pairs={pairs}
        moveCounter={moveCounter}
      />
      <div className="grid grid-cols-2 w-max max-w-2xl gap-2 2xs:gap-4 xs:grid-cols-4 justify-center">
        {memoizedRandomPokemons?.map((poke) => 
          <PokeCard
            key={poke.id}
            poke={poke}
            randomPokemons={randomPokemons}
            setRandomPokemons={setRandomPokemons}
            cardFlipped={cardFlipped}
            setCardFlipped={setCardFlipped}
            isEnd={isEnd}
          />)}
      </div>
      {pairs === 0 && <ReactConfetti />}
    </div>
  )
};