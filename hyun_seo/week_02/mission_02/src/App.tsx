import { ThemeProvider } from './context/ThemeProvider';
import { ContextPage } from './ContextPage';

export const App = () => {
  return (
    <ThemeProvider>
      <ContextPage />  
    </ThemeProvider>
  )
}
