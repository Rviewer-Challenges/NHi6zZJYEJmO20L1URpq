'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import PokeCard from "./PokeCard";
import { usePathname } from "next/navigation";
import { GameDetails } from "./GameDetails";
import ReactConfetti from "./ReactConfetti";
import { exposeMatchers, finalPokemonArray, generateRandomPokemons } from "./utils/functions";
import CountdownBeforeStart from "./CountdownBeforeStart";
import { PokemonCard, PokemonResponse, RootPokemonResponse } from "@/lib/pokeapi/types";
import Result from "./Result";

interface PokeDexProps {
  containerClass: string;
  gridClass: string;
  cardWidth?: string;
  imageSize?: number;
}

async function getPokemons() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50');
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const data: RootPokemonResponse = await res.json();
  return data;
};

export default function PokeDex({ containerClass, gridClass, cardWidth, imageSize }: PokeDexProps) {
  const path = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  const [startIn, setStartIn] = useState(5);
  const [pokemons, setPokemons] = useState<PokemonResponse[] | null>(null);
  const [randomPokemons, setRandomPokemons] = useState<PokemonCard[] | undefined>(undefined);
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
      let pokeCardsArray = finalPokemonArray(pokeArray);
      setRandomPokemons(pokeCardsArray);
      setPairs(8);
    } else if(path === '/normal' && pokemons) {
      let pokeArray = generateRandomPokemons(pokemons, 12);
      let pokeCardsArray = finalPokemonArray(pokeArray);
      setRandomPokemons(pokeCardsArray);
      setPairs(12);
    } else if(path === '/hard' && pokemons) {
      let pokeArray = generateRandomPokemons(pokemons, 15);
      let pokeCardsArray = finalPokemonArray(pokeArray);
      setRandomPokemons(pokeCardsArray);
      setPairs(15);
    }
  }, [pokemons]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if(startIn > 0) {
        setStartIn(prevStartIn => prevStartIn - 1);
      } else {
        clearInterval(countdown);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [startIn])

  useEffect(() => {
    const countdown = setInterval(() => {
      if ((timer <= 0 || pairs === 0) && startIn === 0) {
        setIsEnd(true);
        clearInterval(countdown);
        console.log("inside");
        console.log(startIn);
      } else if (startIn === 0) {
        setTimer(prevTimer => prevTimer - 1);
      }
    }, 1000);

    if ((pairs === 0 || timer === 0) && startIn === 0) {
      setIsEnd(true);
    }

    return () => clearInterval(countdown);
  }, [startIn, timer, pairs]);

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

  function playAgain() {
    setStartIn(5);
    getPokemons().then(res => setPokemons(res.results));
    
    setCardFlipped(0);
    setIsEnd(false);
    setTimer(60);
    setMoveCounter(0);
  }

  return (
    <div className={containerClass}>
      {startIn > 0 && <CountdownBeforeStart countdown={startIn} />}
      <GameDetails
        timer={timer}
        pairs={pairs}
        moveCounter={moveCounter}
        />
      <div className={gridClass}>
        {memoizedRandomPokemons?.map((poke) => 
          <PokeCard
          key={poke.id}
          cardWidth={cardWidth}
          imageSize={imageSize}
          poke={poke}
          randomPokemons={randomPokemons}
          setRandomPokemons={setRandomPokemons}
          cardFlipped={cardFlipped}
          setCardFlipped={setCardFlipped}
          isEnd={isEnd}
          />)}
      </div>
      {isEnd &&
      <Result
        message={pairs === 0 ? {top: "You Won!", bottom: "Congratulations!"} : {top: "Time is Up!", bottom: "Better Luck Next Time!"}}
        playAgain={playAgain}
      />}
      {pairs === 0 && <ReactConfetti />}
    </div>
  )
};