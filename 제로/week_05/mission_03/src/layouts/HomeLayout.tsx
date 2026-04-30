import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"

export const HomeLayout = () => {
  return (
    <div className='h-dvh flex flex-col bg-black overflow-hidden'>
      
      <Navbar /> 
      
      <main className='flex-1 overflow-y-auto'>
        <Outlet />
      </main>
      
      <footer className='p-5 bg-black border-t border-gray-800 shrink-0'>
        푸터
      </footer>
    </div>
  )
}