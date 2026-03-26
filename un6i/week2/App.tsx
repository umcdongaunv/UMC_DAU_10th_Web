import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  // 추가
  const addTodo = () => {
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setInput("");
  };

  // 완료 토글
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // 삭제
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        background: "#f5f5f5",
        borderRadius: "16px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>YONG TODO</h1>

      {/* 입력 영역 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일 입력"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={addTodo}
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          할 일 추가
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* 할 일 */}
        <div style={{ flex: 1 }}>
          <h2>할 일</h2>
          {todos
            .filter((todo) => !todo.completed)
            .map((todo) => (
              <div
                key={todo.id}
                style={{
                  background: "white",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{todo.text}</span>
                <button
                  onClick={() => toggleTodo(todo.id)}
                  style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  완료
                </button>
              </div>
            ))}
        </div>

        {/* 완료 */}
        <div style={{ flex: 1 }}>
          <h2>완료</h2>
          {todos
            .filter((todo) => todo.completed)
            .map((todo) => (
              <div
                key={todo.id}
                style={{
                  background: "white",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;