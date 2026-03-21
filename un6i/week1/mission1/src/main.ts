interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const input = document.getElementById("todo-input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

const todoList = document.getElementById("todo-list") as HTMLUListElement;
const completedList = document.getElementById("completed-list") as HTMLUListElement;

let todos: Todo[] = [];

addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos.push(newTodo);
  input.value = "";

  render();
});

function render(): void {
  todoList.innerHTML = "";
  completedList.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = todo.text;

    if (!todo.completed) {
      const completeBtn = document.createElement("button");
      completeBtn.textContent = "완료";
      completeBtn.className = "todo__complete-btn";

      completeBtn.addEventListener("click", () => {
        todo.completed = true;
        render();
      });

      li.appendChild(span);
      li.appendChild(completeBtn);
      todoList.appendChild(li);

    } else {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "삭제";
      deleteBtn.className = "todo__delete-btn";

      deleteBtn.addEventListener("click", () => {
        todos = todos.filter(t => t.id !== todo.id);
        render();
      });

      li.appendChild(span);
      li.appendChild(deleteBtn);
      completedList.appendChild(li);
    }
  });
}