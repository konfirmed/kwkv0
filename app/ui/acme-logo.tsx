"use client"
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row  items-center leading-none  bg-[#5d534a] text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]  bg-[#5d534a]" />
      <p className="text-[44px]">KWK</p>
    </div>
  );
}