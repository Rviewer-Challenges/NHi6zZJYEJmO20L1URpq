import { nanoid } from 'nanoid';
import easy from '@/assets/img/easy.jpg';
import normal from '@/assets/img/normal.jpg';
import hard from '@/assets/img/hard.jpg';

export const data = [
  {
    id: nanoid(),
    name: 'Easy',
    url: '/easy',
    img: easy
  },
  {
    id: nanoid(),
    name: 'Normal',
    url: '/normal',
    img: normal
  }, 
  {
    id: nanoid(),
    name: 'Hard',
    url: '/hard',
    img: hard
  }
]