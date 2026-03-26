import TodoForm from './TodoForm.tsx';
import TodoList from './TodoList.tsx';

const Todo = () => {
  return (
    <div className='todo-container'>
      <h1 className='todo-container__header'>YONG TODO</h1>
      
      {/* Props 전달 없이 컴포넌트만 배치 */}
      <TodoForm />

      <div className='render-container'>
        <TodoList isDone={false} /> {/* 할 일 리스트 */}
        <TodoList isDone={true} />  {/* 완료 리스트 */}
      </div>
    </div>
  );
};

export default Todo;