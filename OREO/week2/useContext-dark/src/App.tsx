import { ThemeProvider } from "./context/ThemeProvider";
import Navbar from "./components/Navbar";
import ThemeContent from "./components/ThemeContent";

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