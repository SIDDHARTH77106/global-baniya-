'use client';
import Link from 'next/link';

interface CategoryCircleProps {
  name: string;
  image: string;
  href: string;
}

export default function CategoryCircle({ name, image, href }: CategoryCircleProps) {
  return (
    <Link 
      href={`/category/${href}`} 
      className="flex flex-col items-center shrink-0 w-[80px] sm:w-[105px] group/card cursor-pointer"
    >
      {/* Image Box */}
      <div className="w-full aspect-square bg-[#F4F5F7] rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-gray-100 group-hover/card:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 transform group-hover/card:-translate-y-1.5 overflow-hidden relative">
        <span className="group-hover/card:scale-110 transition-transform duration-300 ease-out drop-shadow-sm">
          {image}
        </span>
      </div>
      
      {/* Title */}
      <span className="text-[10px] sm:text-[13px] font-bold text-gray-800 text-center mt-3 leading-[1.2] whitespace-pre-line group-hover/card:text-emerald-600 transition-colors">
        {name}
      </span>
    </Link>
  );
}