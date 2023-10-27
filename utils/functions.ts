import { Pokemon, PokemonCard, PokemonResponse, RootPokemonResponse, Sprites } from "@/lib/pokeapi/types";
import { nanoid } from "nanoid";

export async function getPokemons() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data: RootPokemonResponse = await res.json();
  return data;
};

export async function getPokemon(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  const sprites: Sprites = data.sprites;
  return sprites;
}

export function generateRandomPokemons(arr: PokemonResponse[], limit: number) {
  const copyArr = arr.slice();
  const randomItems: PokemonResponse[] = [];
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

export function addCardIdAndFlip(arr: PokemonResponse[]) {
  return arr.map((poke) => {
    return {
      ...poke,
      cardId: nanoid(),
      flip: false,
      isFound: false,
    }
  })
}

export function duplicateArrayItems(arr: Pokemon[]) {
  return [...arr, arr.flat()].flat();
}

export function addId(arr: Pokemon[]) {
  return arr.map((poke) => {
    return {
      ...poke,
      id: nanoid()
    }
  })
}

export function shuffleArray(array: PokemonCard[]) {
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

export function finalPokemonArray(arr: PokemonResponse[]) {
  let newPokeArr = addCardIdAndFlip(arr);
  let pokeCardArr = addId(duplicateArrayItems(newPokeArr));
  pokeCardArr = shuffleArray(pokeCardArr);
  return pokeCardArr;
}

export function exposeMatchers(arr: PokemonCard[] | undefined, setArr: React.Dispatch<React.SetStateAction<PokemonCard[] | undefined>>) {
  if(arr) {
    /* check if there are more than 1 not found card flipped 
      and if there is, check if their id's are matched. 
      If yes, set isFound to true */
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