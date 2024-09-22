# SpringBoot-React-project
딥러닝 + 스프링 부트 + 리액트 - 웹페이지

## 💡 프로젝트 소개
선용품 카테고리 분류 및 리드타임 예측 서비스
> 선용품을 너무 일찍 발주할 경우 불필요한 보관비용이 발생하고, 너무 늦게 발주하면 선박 운영에 차질이 발생할 수 있으므로 다양한 선용품의 리드타임을 정확히 예측해 최적의 발주 시점을 찾아 보관 및 운영에 드는 비용을 최소화하고자 함.

## 🕰️ 개발 기간
* 24.08.23. - 24.10.08.

## ⚙️ 개발 환경
- `Java 17.0.10`
- `JDK 17.0.10 `
- **React** : 18.2.0
- **IDE** : STS4
- **Framework** : Springboot(2.x)
- **Database** : MySQL(8.0.37)
- **Deep Learning** : Python (Pytorch), BERT, MLP, XGBoost

## 📌 주요 기능

#### 일정관리 (홈화면) 
- 발주 현황 조회 및 입력
> 발주 스케줄링에서 추가한 일정(메모) 표시
> 각 일정 클릭 시 해당 발주건의 물품목록을 팝업창으로 띄움
  
#### 선용품 선택 화면
- 카테고리 선택을 통한 선용품 리스트 조회 및 선용품 별 각 운영체 예상 리드타임 차트
> 선택한 물품 발주 버튼을 통해 발주 스케줄링으로 넘김
> 새상품 등록 시, 물품명으로 추천카테고리 검색
  
#### 발주 스케줄링 (장바구니) 
- 예상 리드타임을 바탕으로 발주 시기와 대체 가능한 유사 품목을 추천
> 담은 물품들을 운영업체별로 화면에 분류하여 띄움
> 사용자로부터 창고 출고 예정일을 받아 각 물품별 최적발주일 계산 : (창고 출고 예정일) - (예상 리드 타임)
> 체크박스에서 선택된 물품 중 가장 리드타임이 긴 상품을 대체할 수 있는 추천목록을 화 하단에 출력
> 발주건에 대한 메모를 입력받고 일정추가하기 버튼을 통해 일정관리로 넘김

## Project Summary

### Aug 30, 2024
- 프로젝트 리포지토리 관리 시작
- 화면 구성을 위한 figma 화면 구현
- DB 구성, 기능 정의

### Aug 30, 2024
- 프로젝트 리포지토리 생성
- 화면 구성을 위한 Figma 화면 구현
- DB 구성 및 기능 정의
- Pagination 기능 추가

### Sep 1, 2024
- ListTable 수정 (목업데이터를 코드안에서 관리함)
- 네비게이션과 푸터 위치 조정
- 배경색 추가

### Sep 2, 2024
- Calendar 검색 기능 추가
- Event 일정 추가

### Sep 3, 2024
- Order 수정 및 DB 연결 시도
- ListTable, Order 기능 수정
- Schedule Modal 수정
- GradientButton 컴포넌트 생성

### Sep 4, 2024
- Schedule 수정
- OrderTest 파일 생성
- ListTable 검색 버튼 추가 및 기능 수정
- fetch코드 구현 (백엔드 연결 준비)
  

### Sep 5, 2024
- SignIn, SignUp 기능 수정
- Schedule 서버 연결 완료
  
### Sep 6, 2024
- ListTable 수정
- 로그인 백엔드 연결

### Sep 7, 2024
- ListTable UI 수정 및 Footer 수정
- MUI Card 스타일 수정

### Sep 8, 2024
- ListTable (선택품목 모아보기, 체크박스 동작 수정)

### Sep 9, 2024
- Order 수정
- ListTable 기능 수정 (수량을 입력받아 가격띄움) 및 토글 버튼 생성
- 02폴더 내에 json파일을 따로 생성해서 fetch 기능 확인하며 수정하도록 변경
  
### Sep 10, 2024
- ListTable 수정
- SignState 생성
- Datepicker 수정

### Sep 11, 2024
- Nav 수정
- ListTable DB 연결 완료
- `/ListTableDB`에서 같은 카테고리, 같은 itemname은 하나만 띄우기 위해 각 행에 대한 아이디를 정함
- `/ListTableDB`에서 itemId, itemName을 구분해서 함수 정의
- 02폴더와 03폴더내의 scss중복 해결 (적용시킬 각 js파일내의 최상위컴포넌트에 className을 설정하여 scss파일의 최상위에 이름을 추가함)

### Sep 12, 2024
- Order 삭제 기능 완료
- ListSupplier 페이지 생성

### Sep 13, 2024
- Order, OrderTest 수정
- Order Datepicker 및 Checkbox 수정 완료
- category, part, itemName이 모두 같은 상품의 supplier가 유일하면(1개라면) 바로 해당하는 공급업체, 가격이 떠있도록 useEffect 추가
- 리드타임 차트 출력에 대한 페이지 추가 고려

### Sep 15, 2024
- Recommend HTML 및 Fetch 기능 완성
- Order Checkbox, 버튼 기능 완성

### Sep 16, 2024
- Recommend 수정

### Sep 19, 2024
- ListTable 수정
- `/ListTableDB`에서 공급업체로 로그인했을때에는 해당하는 공급업체에서 등록한 물품만 뜨지만 등록, 수정이 가능하기 위해서는 category, part 등은 db의 모든 항목을 받아와야하므로 restapi를 분리함
- Order 수정
- 화면 구성 변경 (기존에 선박에서 상품을 결정하여 공급업체(판매자), 가격이 확정되어 해운선사에 전달되는 시스템에서 ---> 선박에서 상품명과 수량, 요청사항을 전달하면 해운선사에서 리드타임, 요청사항을 바탕으로 상품을 결정하는 시스템으로 변경)

### Sep 20, 2024
- `/OrderTest`에서 백엔드 연결완료
- ListTable 수정
- PurchaseRequestList 완성
- MyOrderList 완성
