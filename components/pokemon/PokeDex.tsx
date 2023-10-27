'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PokeCard from "./PokeCard";
import { GameDetails } from "../game-info/GameDetails";
import ReactConfetti from "../ui/ReactConfetti";
import CountdownBeforeStart from "../game-info/CountdownBeforeStart";
import Result from "../game-info/Result";
import CardsLoadingSkeleton from "../ui/CardSkeleton";
import SomethingWentWrong from "../error/SomethingWentWrong";
import { exposeMatchers, finalPokemonArray, generateRandomPokemons, getPokemons } from "../../utils/functions";
import { PokemonCard, PokemonResponse } from "@/lib/pokeapi/types";
import { IPokeDexProps } from "@/lib/types";

const endGameMessage = {
  win: {
    top: "You Won!",
    bottom: "Congratulations!"
  },
  lose: {
    top: "Time is Up!",
    bottom: "Better Luck Next Time!"
  }
}

export default function PokeDex({ containerClass, gridClass, cardWidth, imageSize }: IPokeDexProps) {
  const path = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  const [startIn, setStartIn] = useState(5);
  const [pokemons, setPokemons] = useState<PokemonResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [randomPokemons, setRandomPokemons] = useState<PokemonCard[] | undefined>(undefined);
  const [cardFlipped, setCardFlipped] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [timer, setTimer] = useState(60);
  const [pairs, setPairs] = useState<number | undefined>(undefined);
  const [moveCounter, setMoveCounter] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPokemons().then((res) => {
      setPokemons(res.results);
      setIsLoading(false);
    }).catch(error => {
      console.log(error);
      setError(true);
    });
  }, []);

  useEffect(() => {
    /* choose certain amount of pokemons depending on the difficulty,
    duplicate and shuffle them, then set it to randomPokemons array */
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
    // to prevent unnecessary renders, check if there is any errors first
    if(!error) {
      const countdown = setInterval(() => {
        if(startIn > 0) {
          setStartIn(prevStartIn => prevStartIn - 1);
        } else {
          clearInterval(countdown);
        }
      }, 1000);
      
      return () => clearInterval(countdown);
    }
  }, [startIn]);

  useEffect(() => {
    // startIn === 0 condition is for playAgain function, otherwise isEnd becomes true on re-render
    const countdown = setInterval(() => {
      if ((timer <= 0 || pairs === 0) && startIn === 0) {
        setIsEnd(true);
        clearInterval(countdown);
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
    setIsLoading(true);
    getPokemons().then((res) => {
      setPokemons(res.results);
      setIsLoading(false);
    }).catch(error => {
      console.log(error);
      setError(true)
    });
    
    setCardFlipped(0);
    setIsEnd(false);
    setTimer(60);
    setMoveCounter(0);
  }

  if(error) {
    return <SomethingWentWrong />
  }

  return (
    <div className={`flex flex-col w-full py-4 items-center ${containerClass}`}>
      {startIn > 0 && <CountdownBeforeStart countdown={startIn} />}
      <GameDetails
        timer={timer}
        pairs={pairs}
        moveCounter={moveCounter}
        />
      <div className={`grid grid-cols-2 justify-center gap-2 w-max ${gridClass}`}>
        {isLoading ? 
          <CardsLoadingSkeleton cardWidth={cardWidth} /> :
          memoizedRandomPokemons?.map((poke) => 
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
              setError={setError}
            />)
          }
      </div>
      {isEnd &&
      <Result
        message={pairs === 0 ? endGameMessage.win : endGameMessage.lose}
        playAgain={playAgain}
      />}
      {pairs === 0 && <ReactConfetti />}
    </div>
  )
};