import { StaticImageData } from "next/image";
import { PokemonCard } from "./pokeapi/types";
import { Dispatch, SetStateAction } from "react";

export interface Difficulty {
  id: string,
  name: string,
  url: string,
  img: StaticImageData
}

// Props Interfaces
export interface IPokeDexProps {
  containerClass: string;
  gridClass: string;
  cardWidth?: string;
  imageSize?: number;
}

export interface IPokeCardProps {
  cardWidth?: string;
  imageSize?: number;
  poke: PokemonCard;
  randomPokemons: PokemonCard[] | undefined;
  setRandomPokemons: Dispatch<SetStateAction<PokemonCard[] | undefined>>;
  cardFlipped: number;
  setCardFlipped: Dispatch<SetStateAction<number>>;
  isEnd: boolean;
  setError: Dispatch<SetStateAction<boolean>>
}

export interface IGameDetailsProps {
  timer: number;
  pairs: number | undefined;
  moveCounter: number;
}

export interface ISkeletonProps {
  cardWidth?: string;
}

export interface IResultProps {
  message: {
    top: string;
    bottom: string;
  };
  playAgain: () => void;
}