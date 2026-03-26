import React, { useState } from "react";
import "./index.css";
import "./App.css";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <button className="toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
      
      <h1 style={{ fontSize: "3rem", margin: "20px 0" }}>🚀 Welcome to Week2!</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "40px" }}>
        라이트/다크 모드가 바로 적용됩니다.
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ padding: "20px", backgroundColor: darkMode ? "#333" : "#eee", borderRadius: "10px" }}>
          <h2>Card 1</h2>
          <p>내용 A</p>
        </div>
        <div style={{ padding: "20px", backgroundColor: darkMode ? "#333" : "#eee", borderRadius: "10px" }}>
          <h2>Card 2</h2>
          <p>내용 B</p>
        </div>
      </div>
    </div>
  );
}