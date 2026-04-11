import { ThemeProvider } from './context/ThemeProvider';
import Navbar from './Navbar';
import ThemeContent from './ThemeContent';



function App() {
  return (
    <ThemeProvider>
        <div className="min-h-screen w-screen flex flex-col items-stretch">
      <Navbar />
      <ThemeContent />
      </div>
    </ThemeProvider>
  );
}

export default App;