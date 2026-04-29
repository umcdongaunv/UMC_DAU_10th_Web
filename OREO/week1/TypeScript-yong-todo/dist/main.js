"use strict";
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskValue = todoInput.value.trim();
    if (taskValue) {
        addTodo(taskValue);
        todoInput.value = '';
    }
});
function addTodo(text) {
    var _a;
    const li = document.createElement('li');
    li.className = 'todo__item';
    li.innerHTML = `
        <span>${text}</span>
        <button class="todo__btn-complete">완료</button>
    `;
    (_a = li.querySelector('.todo__btn-complete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        moveToDone(li, text);
    });
    todoList.appendChild(li);
}
function moveToDone(element, text) {
    var _a;
    element.remove();
    const li = document.createElement('li');
    li.className = 'todo__item';
    li.innerHTML = `
        <span>${text}</span>
        <button class="todo__btn-delete">삭제</button>
    `;
    (_a = li.querySelector('.todo__btn-delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        li.remove();
    });
    doneList.appendChild(li);
}
