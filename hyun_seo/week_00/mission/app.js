// HTML 요소들을 JS 변수로 가져옴
const todoInput = document.getElementById('todoInput'); // 사용자가 입력
const todoList = document.getElementById('pendingList'); // 해야 할 일
const doneList = document.getElementById('completeList'); // 해낸 일

// 새로운 할 일을 추가하는 함수
function addTodo() {
  const text = todoInput.value.trim();
  // 입력창이 비어있으면 함수 종료 (아무것도 추가 X)
  if (!text) return;

  // 새로운 리스트 아이템(li) 생성
  const li = document.createElement('li');
  li.className = 'todo_item'; // 스타일 적용
  // li 내부에 들어갈 HTML 구조 (텍스트와 완료버튼)
  // 버튼 클릭 시 complete 함수를 실행하도록 설정
  li.innerHTML = `
    <span class="todo_text">${text}</span>
    <button class="todo_click todo_click_complete" onclick="completeTodo(this)">완료</button>`;
  // '해야 할 일' 목록 맨 뒤에 새로운 li 추가
  todoList.appendChild(li);
  // 입력이 끝난 후 입력창 비우기
  todoInput.value = '';
}

// 해야 할 일 완료하여 해낸 일로 넘기는 함수 
function completeTodo(click) {
  // 버튼의 부모 요소인 <li>를 찾음
  const li = click.parentElement;
  // 더 이상 필요 없는 '완료 버튼' 삭제 
  click.remove(); 

  // 새로운 '삭제 버튼' 생성
  const deleteClick = document.createElement('button');
  deleteClick.className = 'todo_click todo_click_delete'; // 스타일 적용
  deleteClick.innerText = '삭제'; 
  // 삭제 버튼 클릭 시, 해당 li 전체를 화면에서 삭제
  deleteClick.onclick = () => li.remove();

  // li에 삭제 버튼을 붙이고, 전체 li를 '해낸 일' 목록으로 이동
  li.appendChild(deleteClick);
  completeList.appendChild(li); 
}

// 이벤트 리스너 -> 입력창에서 엔터키를 눌렀을 때 작동
todoInput.addEventListener('keydown', (e) => {
  // 눌린 키가 Enter라면 addTodo() 함수 실행
  if (e.key === 'Enter') {
    addTodo();
  }
});