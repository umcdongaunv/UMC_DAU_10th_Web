
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { useTodo } from '../context/TodoContext';

const Todo = () => {

    
    const { todos, doneTodos, completeTodo, deleteTodo } = useTodo();

    return (
        <div className='todo-container'>
        <h1 className="todo-container__header">Yong Todo</h1>
            <TodoForm/>
            <div className="render-container">
                <TodoList 
                    title = "할 일" 
                    todos={todos} buttonlabel="완료" 
                    buttonColor="#28a745" 
                    onclick={completeTodo}/>
                <TodoList 
                    title = "완료" 
                    todos={doneTodos} 
                    buttonlabel="삭제" 
                    buttonColor="#dc3545" 
                    onclick={deleteTodo}/>
            </div>
        </div>
    );
    
}

export default Todo;

