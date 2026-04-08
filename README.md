# UMC_DAU_10th_Web


[0] 기본 세팅
-----------------------------------------------------------------------------------
  * 본인 컴퓨터에 Git이 깔려있지 않은 경우, 사전 설치 후 진행
 <br>   -> https://junesker.tistory.com/95  참고
<br>
<br>  * C드라이브 or 바탕화면에 프로젝트를 감싸는 폴더 구조를 생성
    <br>&emsp;<pre>-> 개인폴더
       <br>&emsp;&emsp; └ 닉네임
         <br> &emsp;&emsp;&emsp;└ 주차 폴더
            <br> &emsp;&emsp;&emsp;&emsp; └ 미션 파일</pre>

      (ex) UMC_10th_Study
            └ so_on
                └ week1
                  └ mission 1
                  └ mission 2
                  └ mission 3


## [1] 프로젝트 폴더에서 Git 생성
 <br>  [0]에서 생성한 상위 폴더에서 Git 생성
 <br>   &emsp; 위의 예에서는 ' UMC_10th_Study'에서 진행
   <br> 
## 🚀 UMC 10기 WEB 파트 주차별 과제 제출 가이드
이 가이드는 **Git이 이미 설치되어 있다는 전제**하에 작성되었습니다.
<br>

모든 과제는 메인(`main`) 공간이 아닌, **본인 닉네임으로 만든 개인 Brach와 개인 폴더**에 올려야 합니다. 
<br>또한, 과제는 **본인 컴퓨터에 지정된 폴더 구조를 먼저 만든 후**, 깃허브에 연결하여 업로드하는 방식입니다. 

<br>아래 가이드를 천천히 따라와 주세요!

<br>
<br>

## 📂 프로젝트 폴더 구조

📍 반드시 아래와 같은 트리 구조로 과제를 작성해 주세요.
<br>
<br> 이해하기 쉽게 해당 예시로 설명을 진행할 예정입니다.

```text
UMC_10th
 └ 본인닉네임 (예: so_on)
     └ week1
        └ mission 1
        └ mission 2
        └ mission 3
     └ week2
        └ mission 1
```
💡 **중요 꿀팁**: 깃(Git)은 '빈 폴더'를 인식하지 못합니다! mission 1, mission 2 폴더를 만들었다면, 그 안에 반드시 파일(index.html 등)을 하나라도 넣어두어야 깃허브에 정상적으로 올라갑니다.
<br> 
<br>
이를 일반화하면 다음과 같습니다.
```text
개인폴더
└ 닉네임
    └ 주차 폴더
        └ 미션 파일
```
<br>
<br>



---

## 🛑 ** [최초 1회] 초기 폴더 세팅 및 1주차 제출**

> 처음 과제를 시작할 때 딱 한 번만 진행하는 과정입니다.

<br>

**1️⃣ 내 컴퓨터에 폴더 만들기**

바탕화면 등 편한 곳에 상위 폴더(예시- `UMC_10th`)를 만들고, 그 안에 위 공식 폴더 구조대로 *[상위폴더] > [닉네임] > [주차] > [mission]* '폴더'들을 차례대로 만듭니다. 그리고 **미션 폴더** 안에 각 과제 파일을 넣고 저장합니다.


<br>

**2️⃣ 터미널 열고 상위 폴더 (예시-`UMC_10th`) 폴더로 이동하기**

터미널을 열고 `cd` 명령어를 이용해 최상위 폴더로 들어갑니다. 

```bash
cd 상위폴더   #예: cd 경로/UMC_10th
```

<br>

**3️⃣ 깃허브 레포지토리 연결하기 (⭐ 핵심)**

내 폴더에 깃(Git)을 설치하고, 'UMC_DAU_10th_Web' 레포지토리와 연결합니다.

```bash
# 1. 이 폴더를 Git으로 관리하겠다고 선언!
git init
</pre>

# 2. 공식 레포지토리 주소와 내 폴더를 연결!
git remote add origin https://github.com/umcdongaunv/UMC_DAU_10th_Web.git

# 3. 깃허브에 이미 있는 메인 파일(README 등)을 내 컴퓨터로 가져와서 싱크 맞추기!
git pull origin main
```
✅ git init을 거치면, 상위폴더 하위에 ./git 폴더가 생성됩니다. 해당 폴더가 보이지 않을 시, 폴더 속성에서 '숨김 파일 보기'를 켜두시면 됩니다.

<br>
<br>


**4️⃣ 내 전용 Branch 만들고 이동하기**

메인 코드와 섞이지 않도록 본인 닉네임으로 방을 만듭니다.

```bash
git switch -c 본인닉네임 # 예시: git switch -c so_on
```

<br>

**5️⃣ 과제 올리기**
<br>(5-1) 과제(html, txt파일 등)를 미션 폴더 하위에 드레그하여 옮겨둡니다.
<br>(5-2) 다음 명령어를 차례로 실행하며 내가 만든 폴더와 파일들을 깃허브로 쏘아 올립니다!

```bash
git add .
git commit -m "feat: 닉네임 1주차 과제 제출"
git push origin 본인닉네임
```


<br>

**6️⃣ PR (Pull Request) 날리기** - 최종 제출 완료!

깃허브 UMC_DAU_10th_Web 레포지토리에 접속합니다.

상단의 초록색 `[Compare & pull request]` 버튼을 클릭합니다.

제목을 `[1주차] 본인닉네임 과제 제출` 로 적고, `[Create pull request]` 를 누르면 완료! 🎉

<br>
<br>
<br>
<br>



---

## 🔄 **[2주차~] 매주 반복해야 할 제출 사이클**

> 2주차부터는 초기 세팅을 생략하므로 훨씬 간단합니다!

**1️⃣ 터미널 열고 상위 폴더(UMC_10th)로 들어가기**

```bash
cd 상위폴더경로     #예: cd 경로/UMC_10th
```

<dr>

**2️⃣ 내 브랜치(방)로 이동하기 (⭐ 매우 중요)**

이미 만들어둔 내 방으로 들어갑니다. 이번엔 -c를 꼭 빼야 합니다!

```bash
git switch 본인닉네임 # 예시: git switch so_on
```

<dr>

**3️⃣ N주차 폴더 만들고 과제하기**

마우스나 터미널을 이용해 내 닉네임 폴더 안에 `week2` > `mission` 폴더들을 만들고 과제 파일을 만듭니다.
<br>⭐완성한 과제는 미션 폴더 하위에 옮겨둡니다.

<dr>
<dr>
 
**3️⃣ 깃허브에 올리고 PR 날리기**

과제를 다 짰다면 1주차와 똑같이 3대장 명령어를 입력하고 웹사이트에서 PR을 날립니다.

```bash
git add .
git commit -m "feat: 2주차 미션 완료"
git push origin 본인닉네임
```

<br>

---

🏷️ **[참고] 커밋 메시지(말머리) 규칙**

| 말머리   | 설명                                   |
| -------- | -------------------------------------- |
| `feat`   | 새로운 기능, HTML/CSS 추가             |
| `fix`    | 에러, 버그 수정                        |
| `docs`   | README 등 문서 추가/수정               |
| `style`  | 코드 포맷팅, 세미콜론 누락 수정 (기능 변경 없음) |
| `chore`  | 패키지 설정, 단순 폴더 생성 등 자잘한 작업. |




<br>
<br>






## (+) 📍 PR 올리는 방법 

[1] 노란색 안내 문구 속 'Compare & pull request' 버튼 누르기

<br>

<img width="1048" height="393" alt="image" src="https://github.com/user-attachments/assets/c2af1f57-d050-40c6-be0e-d3cc43983f85" />

<br>
<br>


[2] 제출 문구 적고 하단의 'Crate pull Request' 버튼을 누릅니다.
<br> *(ex) 1주차 워크북을 수행하였습니다. (+ 소감)* 

<br>
<img width="974" height="678" alt="image" src="https://github.com/user-attachments/assets/9c2fd802-4bae-441a-9af5-03d5b6535bb9" />

<br>
<br>

[3] ✅ 파트장이 확인 후, merge를 해줄 것입니다.

<br> 

🚨 해당 [Merge 버튼]은 파트장 외에 절대 누르지 마세요!🚨

<br>

<img width="973" height="591" alt="image" src="https://github.com/user-attachments/assets/44065c77-9e26-422e-956c-5a6fff2fb7a9" />

<br>
<br>
[4] ✅ 아래와 같이 뜨면 완성입니다!

<br>
<br>

<img width="1392" height="439" alt="image" src="https://github.com/user-attachments/assets/d9918f2a-ea68-422d-9afc-c800702f7fb5" />



<br>
