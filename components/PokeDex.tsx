'use client';

import { useEffect, useState } from "react";
import PokeCard from "./PokeCard";
import { usePathname } from "next/navigation";
import { nanoid } from "nanoid";

async function getPokemons() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50');
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

function duplicateArrayItems(arr: any[]) {
  return [...arr, arr.flat()].flat();
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

export default function PokeDex() {
  const [pokemons, setPokemons] = useState<any>(null);
  const path = usePathname();
  const [randomPokemons, setRandomPokemons] = useState<Pokemon[] | undefined>(undefined);

  useEffect(() => {
    getPokemons().then(res => setPokemons(res.results));
  }, []);

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
    if(path === '/easy' && pokemons) {
      let pokeArray = generateRandomPokemons(pokemons, 8);
      pokeArray = shuffleArray(duplicateArrayItems(pokeArray));
      console.log(pokeArray);
      setRandomPokemons(pokeArray);
    } else if(path === '/normal' && pokemons) {
      const pokeArray = generateRandomPokemons(pokemons, 12);
      setRandomPokemons(pokeArray);
    } else if(path === '/hard' && pokemons) {
      const pokeArray = generateRandomPokemons(pokemons, 15);
      setRandomPokemons(pokeArray);
    }
  }, [pokemons]);

  console.log(pokemons);

  return (
    <>
      {randomPokemons?.map((poke) => <PokeCard key={nanoid()} poke={poke} />)}
    </>
  )
};