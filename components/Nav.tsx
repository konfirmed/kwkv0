import Link from 'next/link'
import React from 'react'

const Nav = () => {
  return (
    <div className='sticky border-blue-500 top-0 left-0 z-50'>      <header className="flex items-center  justify-between p-6 bg-[#e8e6e1] shadow-md ">
    <div className="flex items-center space-x-4">
      <img alt="Logo" className="w-10 h-10" src="/placeholder.svg" />
      <h1 className="text-2xl font-semibold text-[#5d534a]">KWK</h1>
    </div>
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
      <Link  className="px-4 py-2 text-white bg-[#a68b7b] rounded-md hover:bg-[#8c7364]" href="/login">
            Log in
        </Link>
        <Link  className="px-4 py-2 text-white bg-[#a68b7b] rounded-md hover:bg-[#8c7364]" href="/app/page">
          Sign out
      </Link>
    </nav>
  </header></div>
  )
}

export default Nav