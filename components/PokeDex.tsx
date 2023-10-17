'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import PokeCard from "./PokeCard";
import { usePathname } from "next/navigation";
import { nanoid } from "nanoid";
import { GameDetails } from "./GameDetails";

async function getPokemons() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50');
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

function addCardIdAndFlip(arr: any[]) {
  return arr.map((poke) => {
    return {
      ...poke,
      cardId: nanoid(),
      flip: false,
      isFound: false,
    }
  })
}

function duplicateArrayItems(arr: any[]) {
  return [...arr, arr.flat()].flat();
}

function addId(arr: any[]) {
  return arr.map((poke) => {
    return {
      ...poke,
      id: nanoid()
    }
  })
} 

function shuffleArray(array: any[]) {
  let len = array.length, currentIndex;
  let shuffledArray = [...array]; // Make a copy of the original array
  for (currentIndex = len - 1; currentIndex > 0; currentIndex--) {
    let randIndex = Math.floor(Math.random() * (currentIndex + 1));
    let temp = shuffledArray[currentIndex];
    shuffledArray[currentIndex] = shuffledArray[randIndex];
    shuffledArray[randIndex] = temp;
  }
  return shuffledArray; // Return the shuffled copy
}

function exposeMatchers(arr: Pokemon[] | undefined, setArr: React.Dispatch<React.SetStateAction<Pokemon[] | undefined>>) {
  if(arr) {
    const flippedCards = arr.filter(poke => poke.flip && !poke.isFound);
    if(flippedCards.length > 1) {
      const [poke1, poke2] = flippedCards;
  
      if(poke1.cardId === poke2.cardId) {
        setArr(prevArr => {
          return prevArr?.map(poke => poke.flip ? { ...poke, isFound: true } : poke);
        })
      }
    }      
  }
}

export default function PokeDex() {
  const [pokemons, setPokemons] = useState<any>(null);
  const path = usePathname();
  const [randomPokemons, setRandomPokemons] = useState<Pokemon[] | undefined>(undefined);
  const [cardFlipped, setCardFlipped] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [timer, setTimer] = useState(60);
  const [pairs, setPairs] = useState<number | undefined>(undefined);
  const [moveCounter, setMoveCounter] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  useEffect(() => {
    getPokemons().then(res => setPokemons(res.results));
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      if(timer > 0) {
        setTimer(prevTimer => prevTimer - 1);
      } else {
        clearInterval(countdown);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer])

  useEffect(() => {
    const notFounds = randomPokemons?.filter(poke => !poke.isFound);
    setPairs(notFounds && notFounds.length / 2);
  }, [randomPokemons])

  const generateRandomPokemons = (arr: any[], limit: number) => {
    const copyArr = arr.slice();
    const randomItems: any[] = [];
    if(limit <= arr.length) {
      while(randomItems.length < limit) {
        const randomIndex = Math.floor(Math.random() * copyArr.length);

        if (!randomItems.includes(copyArr[randomIndex])) {
          randomItems.push(copyArr[randomIndex]);
        }
        copyArr.splice(randomIndex, 1);
      }
    } else {
      console.error("The requested number of items exceeds the array length.");
    }
    return randomItems;
  }

  useEffect(() => {
    if (cardFlipped === 2) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      exposeMatchers(randomPokemons, setRandomPokemons);

      timeoutRef.current = setTimeout(() => {
        setRandomPokemons(prevRandomPokemons => {
          return prevRandomPokemons?.map((poke) => poke.isFound ? poke : { ...poke, flip: false });
        });
      }, 1500);
    } else if (cardFlipped === 1) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [cardFlipped]);

  console.log(cardFlipped);

  useEffect(() => {
    if(path === '/easy' && pokemons) {
      let pokeArray = generateRandomPokemons(pokemons, 8);
      pokeArray = addCardIdAndFlip(pokeArray);
      pokeArray = addId(duplicateArrayItems(pokeArray));
      pokeArray = shuffleArray(pokeArray);
      console.log(pokeArray);
      setRandomPokemons(pokeArray);
      setPairs(8);
    } else if(path === '/normal' && pokemons) {
      const pokeArray = generateRandomPokemons(pokemons, 12);
      setRandomPokemons(pokeArray);
      setPairs(12);
    } else if(path === '/hard' && pokemons) {
      const pokeArray = generateRandomPokemons(pokemons, 15);
      setRandomPokemons(pokeArray);
      setPairs(15);
    }
  }, [pokemons]);

  const memoizedRandomPokemons = useMemo(() => randomPokemons, [randomPokemons]);
  console.log(randomPokemons);

  return (
    <div className="flex flex-col w-full py-4 items-center lg:flex-row lg:justify-around lg:items-stretch">
      <GameDetails
        timer={timer}
        pairs={pairs}
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
            exposeMatchers={exposeMatchers}
          />)}
      </div>
    </div>
  )
};