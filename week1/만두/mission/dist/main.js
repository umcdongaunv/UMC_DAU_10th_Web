"use strict";
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const completedList = document.getElementById("completed-list");
let todos = [];
// 할 일 추가
addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text)
        return;
    const newTodo = {
        id: Date.now(),
        text,
        completed: false
    };
    todos.push(newTodo);
    input.value = "";
    render();
});
// 화면 렌더링
function render() {
    todoList.innerHTML = "";
    completedList.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = todo.text;
        if (!todo.completed) {
            // ✅ 완료 버튼
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
        }
        else {
            // ✅ 삭제 버튼
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
