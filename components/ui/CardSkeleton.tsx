'use client';

import { ISkeletonProps } from "@/lib/types";
import { usePathname } from "next/navigation";

function CardSkeleton({ cardWidth }: ISkeletonProps) {
  return (
    <div className={`${cardWidth || 'w-32 h-32'} loading-shimmer border-2 border-[#C7A008] animate-pulse duration-2 ease-in-out justify-self-center`}>
    </div>
  )
}

export default function CardsLoadingSkeleton({ cardWidth }: ISkeletonProps) {
  const path = usePathname();

  if(path === '/easy') {
    return Array.from({ length: 16 }).map((_, index) => <CardSkeleton key={index} cardWidth={cardWidth} />)
  } else if(path === '/normal') {
    return Array.from({ length: 24 }).map((_, index) => <CardSkeleton key={index} cardWidth={cardWidth} />)    
  } else if(path === '/hard') {
    return Array.from({ length: 30 }).map((_, index) => <CardSkeleton key={index} cardWidth={cardWidth} />)    
  }
}