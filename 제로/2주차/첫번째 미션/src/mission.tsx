import { useState } from 'react';

function App() {
  const [cnt, setcnt] = useState(0);

  const handleIncrement = () => {
    setcnt(cnt + 1);
  };

  const handleDecrement = () => {
    setcnt(cnt - 1);
  };

  return (
    <>
      <h1>{cnt}</h1>
      <div>
        <button onClick={handleIncrement}>+1 증가</button>
        <button onClick={handleDecrement}>-1 감소</button>
      </div>
    </>
  );
}

export default App;

