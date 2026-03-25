import './App.css'
import './index.css'
import Todo from './components/todo.tsx'
import { TodoProvider } from './context/TodoContext.tsx' // 추가

function App() {
  return (
    <TodoProvider> {/* Provider로 감싸기 */}
      <Todo />
    </TodoProvider>
  )
}

export default App