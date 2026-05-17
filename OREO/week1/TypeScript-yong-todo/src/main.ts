const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

todoForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const taskValue = todoInput.value.trim();
    if (taskValue) {
        addTodo(taskValue);
        todoInput.value = '';
    }
});

function addTodo(text: string): void {
    const li = document.createElement('li');
    li.className = 'todo__item';
    li.innerHTML = `
        <span>${text}</span>
        <button class="todo__btn-complete">완료</button>
    `;

    li.querySelector('.todo__btn-complete')?.addEventListener('click', () => {
        moveToDone(li, text);
    });

    todoList.appendChild(li);
}

function moveToDone(element: HTMLLIElement, text: string): void {
    element.remove(); // 할 일 목록에서 삭제
    
    const li = document.createElement('li');
    li.className = 'todo__item';
    li.innerHTML = `
        <span>${text}</span>
        <button class="todo__btn-delete">삭제</button>
    `;

    li.querySelector('.todo__btn-delete')?.addEventListener('click', () => {
        li.remove();
    });

    // 이 코드가 있어야 '완료' 섹션에 나타납니다.
    doneList.appendChild(li); 
}