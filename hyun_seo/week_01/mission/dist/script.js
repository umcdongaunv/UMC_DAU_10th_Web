// 1. HTML 요소 선택 (Handbook JavaScript 참고)
var todoInput = document.getElementById('todo-input'); // 얘는 HTML의 Input에 관한 태그야
var todoForm = document.getElementById('todo-form'); // Form에 관한 태그
var todoList = document.getElementById('todo-list'); // 할 일 List에 관한 태그
var doneList = document.getElementById('done-list'); // 완료한 일 List에 관한 태그
var todos = [];
var doneTasks = [];
// - 할 일 목록 렌더링 하는 함수를 정의 
var renderTasks = function () {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach(function (todo) {
        var li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });
    doneTasks.forEach(function (todo) {
        var li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};
// 3. 할 일 텍스트 입력 처리 함수
var getTodoText = function () {
    return todoInput.value.trim();
};
// 4. 할 일 추가 처리 함수
var addTodo = function (text) {
    todos.push({ id: Date.now(), text: text });
    todoInput.value = '';
    renderTasks();
};
// 5. 할 일 상태 변경 (완료로 이동)
var compleTodo = function (todo) {
    todos = todos.filter(function (t) { return t.id !== todo.id; });
    doneTasks.push(todo);
    renderTasks();
};
// 6. 완료된 할 일 삭제 함수
var deleteTodo = function (todo) {
    doneTasks = doneTasks.filter(function (t) { return t.id !== todo.id; });
    renderTasks();
};
// 7. 할 일 아이템 생성 함수 (완료 여부에 따라 버튼 텍스트 색상 설정)
var createTodoElement = function (todo, isDone) {
    var li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;
    var button = document.createElement('button');
    button.classList.add('render-container__item-button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }
    button.addEventListener('click', function () {
        if (isDone) {
            deleteTodo(todo);
        }
        else {
            compleTodo(todo);
        }
    });
    li.appendChild(button);
    return li;
};
// 8. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
renderTasks();
