import DifficultyCard from "@/components/DifficultyCard"
import { data } from "@/components/helpers/difficultyData"
import localFont from 'next/font/local';

const pokeSolid = localFont({
  src: '../public/fonts/pokemon-solid.ttf',
  variable: '--font-pokeSolid'
})

export default function Home() {
  return (
    <div className={`${pokeSolid.variable} font-sans w-full min-h-screen bg-[#2C7ABC] flex flex-col items-center justify-center px-4 py-6`}>
      <header className="mb-6 lg:mb-10">
        <h1 className="text-3xl xs:text-4xl lg:text-5xl text-center text-[#EDBC06] font-poke">MEMORY GAME</h1>
      </header>
      <main>
        <div className="flex flex-wrap gap-y-8 gap-x-4 md:gap-x-7 justify-center">
          {data.map(item => <DifficultyCard key={item.id} item={item} />)}
        </div>
      </main>
    </div>
  )
}
