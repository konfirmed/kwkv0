'use client'
import { signOut } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'
// import { signOut } from '@/auth';

const Nav = () => {
  const handleSignOut  = async () => {
    await signOut();
  }
  return (
    <div className='sticky border-blue-500 top-0 left-0 z-50'>      
    <header className="flex items-center  justify-between p-6 bg-[#e8e6e1] shadow-md ">
    <div className="flex items-center space-x-4">
      <h1 className="text-2xl font-semibold text-[#5d534a]"><Link href="/">KWK</Link></h1>
    </div>
    <nav className="flex items-center  space-x-6">
      <Link className="text-[#5d534a] hover:text-[#3e3427]" href="/debuggers/dcls">
        Debuggers
      </Link>
      <div
      //    action={async () => {
  
      //     await signOut();
      //   }
      // }
        >
          <button onClick={handleSignOut} className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:block">Sign Out</div>
          </button>
        </div>
    </nav>
  </header></div>
  )
}

export default Nav