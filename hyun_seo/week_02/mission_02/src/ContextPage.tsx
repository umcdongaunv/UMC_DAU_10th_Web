import { ThemeProvider } from "./context/ThemeProvider"
import { Navbar } from "./Navbar"
import { ThemeContent } from "./ThemeContent"

export const ContextPage = () => {
  return (
    <ThemeProvider>
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex flex-col flex-1'>
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
  )
}