import Link from 'next/link'
import React from 'react'
import { signOut } from '@/auth';

const Nav = () => {
  return (
    <div className='sticky border-blue-500 top-0 left-0 z-50'>      <header className="flex items-center  justify-between p-6 bg-[#e8e6e1] shadow-md ">
    <nav className="flex items-center  space-x-6">
      <Link className="text-[#5d534a] hover:text-[#3e3427]" href="#">
        Dashboard
      </Link>
      <Link className="text-[#5d534a] hover:text-[#3e3427]" href="#">
        Projects
      </Link>
      <Link className="text-[#5d534a] hover:text-[#3e3427]" href="#">
        Settings
      </Link>
      <form
         action={async () => {
          'use server';
          await signOut();
        }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
    </nav>
  </header></div>
  )
}

export default Nav