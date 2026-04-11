import type { TTodo } from "../types/todo";

interface TodoListProps {
    title: string
    todos: TTodo[];
    buttonlabel: string;
    buttonColor: string; 
    onclick: (todo: TTodo) => void;
}

const TodoList = ({title, todos, buttonlabel, buttonColor, onclick}: TodoListProps) => {
    return (
        <div className="render-container__section">
            <h2 className="render-container__title">{title}</h2>
            <ul id="todo-list" className="render-container__list">
                {todos?.map((todo) => (
                    <li key={todo.id} className="render-container__item">
                    <span className="render-container__item-text">{todo.text}</span>
                    <button
                        onClick={() => onclick(todo)}
                        style={{ backgroundColor: buttonColor}}
                        className="render-container__item-button"
                    >
                    {buttonlabel}
                    </button>
                    </li>   
                ))}
            </ul>
        </div>
    );
};
export default TodoList;