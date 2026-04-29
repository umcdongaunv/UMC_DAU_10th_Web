import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { TTodo } from '../types/todo.ts';

interface ITodoContext {
  todos: TTodo[];
  doneTodos: TTodo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
}

const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

  const addTodo = (text: string) : void => {
    const newTodo: TTodo = { id: Date.now(), text };
    setTodos((prev) : TTodo[] => [...prev, newTodo]);
  };

  const completeTodo = (todo: TTodo) : void => {
    setTodos((prev) : TTodo[] => prev.filter((t) => t.id !== todo.id));
    setDoneTodos((prev) : TTodo[] => [...prev, todo]);
  };

  const deleteTodo = (todo: TTodo) : void => {
    setDoneTodos((prev) : TTodo[] => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <TodoContext.Provider value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};