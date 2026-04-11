import {Outlet} from "react-router-dom"
import NavBar from "../pages/NavBar"

const HomeLayout = () => {
   return (
      <div className="h-dvh flex flex-col">
         <nav><NavBar /></nav>
         <main className="flex-1">
            <Outlet />
         </main>
      </div>
   )
}

export default HomeLayout;