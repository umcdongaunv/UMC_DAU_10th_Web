import React, {useState} from 'react';
import type { TTodo } from '../types/todo';

const Todobefore = () => {
  // 상태 관리
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>('');

  console.log('Input', input);

  // 등록 함수
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const text = input.trim();

    if (text) {
      const newTodo: TTodo = { id: Date.now(), text };
      setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
      setInput('');
    }
  };

  // 완료 함수
  const completeTodo = (todo: TTodo): void => {
    setTodos((prevTodos): TTodo[] => prevTodos.filter((t): boolean => t.id !== todo.id));
    setDoneTodos((prevDoneTodos): TTodo[] => [...prevDoneTodos, todo]);
  };

  // 삭제 함수 
  const deleteTodo = (todo: TTodo): void => {
    setDoneTodos((prevDoneTodos): TTodo[] => 
      prevDoneTodos.filter((t): boolean => t.id !== todo.id)
    );
  };

  return (
    <div className='todo-container'>
      <h1 className='todo-container__header'>YONG TODO</h1>

      <form onSubmit={handleSubmit} className='todo-container__form'>
        <input
          type='text'
          value={input}
          className='todo-container__input'
          placeholder='할 일 입력'
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setInput(e.target.value)}
        />
        <button type='submit' className='todo-container__button'>
          할 일 추가
        </button>
      </form>

      <div className='render-container'>
        {/* 할 일 영역 */}
        <div className='render-container__section'>
          <h2 className='render-container__title'>할 일</h2>
          <ul id='todo-list' className='render-container__list'>
            {todos.map((todo) => (
              <li key={todo.id} className='render-container__item'>
                <span className='render-container__item-text'>{todo.text}</span>
                <button 
                  type='button'
                  style={{ backgroundColor: '#28a745' }}
                  className='render-container__item-button'
                  onClick={(): void => completeTodo(todo)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 완료 영역 */}
        <div className='render-container__section'>
          <h2 className='render-container__title'>완료</h2>
          <ul className='render-container__list'>
            {doneTodos.map((todo) => (
              <li key={todo.id} className='render-container__item'>
                <span className='render-container__item-text'>{todo.text}</span>
                <button 
                  type='button'
                  className='render-container__item-button'
                  onClick={(): void => deleteTodo(todo)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Todobefore;