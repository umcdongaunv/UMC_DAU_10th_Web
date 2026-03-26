import { useState } from 'react';
import { useTodo } from '../context/TodoContext.tsx';

const TodoForm = () => {
  const [input, setInput] = useState('');
  const { addTodo } = useTodo(); // 훅으로 직접 가져오기

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='todo-container__form'>
      <input
        type='text'
        value={input}
        onChange={(e) : void => setInput(e.target.value)}
        className='todo-container__input'
        placeholder='할 일 입력'
        required
      />
      <button type='submit' className='todo-container__button'>
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;