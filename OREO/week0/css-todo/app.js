const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');

// 할 일 추가 함수
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return; // 빈 값 방지

  const li = document.createElement('li');
  li.className = 'todo__item';
  li.innerHTML = `
    <span class="todo__text">${text}</span>
    <button class="todo__btn todo__btn--complete" onclick="completeTodo(this)">완료</button>
  `;

  todoList.appendChild(li);
  todoInput.value = ''; // 입력창 초기화
}

// 완료 시 이동 함수
function completeTodo(btn) {
  const li = btn.parentElement;
  btn.remove(); // 완료 버튼 삭제

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'todo__btn todo__btn--delete';
  deleteBtn.innerText = '삭제';
  deleteBtn.onclick = () => li.remove();

  li.appendChild(deleteBtn);
  doneList.appendChild(li); // '해낸 일' 목록으로 이동
}

// Enter 키 이벤트 바인딩
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});