import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import PremiumWebtoon from "./pages/PremiumWebtoon";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute requirePremium={true} />}>
  <Route path="/premium/webtoon/:id" element={<PremiumWebtoon />} />
  </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;