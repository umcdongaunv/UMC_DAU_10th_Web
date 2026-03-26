import { useTodo } from '../context/TodoContext.tsx';

interface TodoListProps {
  isDone: boolean; // 할 일 리스트인지 완료 리스트인지 구분용
}

const TodoList = ({ isDone }: TodoListProps) => {
  const { todos, doneTodos, completeTodo, deleteTodo } = useTodo();
  
  // 조건에 따라 사용할 데이터와 함수 선택
  const currentTodos = isDone ? doneTodos : todos;
  const title = isDone ? '완료' : '할 일';
  const buttonLabel = isDone ? '삭제' : '완료';
  const buttonColor = isDone ? '#dc3495' : '#28a745';
  const onClickAction = isDone ? deleteTodo : completeTodo;

  return (
    <div className='render-container__section'>
      <h2 className='render-container__title'>{title}</h2>
      <ul className='render-container__list'>
        {currentTodos.map((todo) => (
          <li key={todo.id} className='render-container__item'>
            <span className='render-container__item-text'>{todo.text}</span>
            <button
              type='button'
              style={{ backgroundColor: buttonColor }}
              className='render-container__item-button'
              onClick={(): void => onClickAction(todo)}
            >
              {buttonLabel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;