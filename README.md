## 🚢 Smart Ship (24.08.23 - 24.10.08)
> ####  [K-Digital 부산대 24-7회차] AI 활용 빅데이터분석 풀스택웹서비스 SW 개발자 양성과정 AI 학습모델 웹서비스 개발 프로젝트
> #### Frontend:김수경,이민주 / Backend: 백이서 / Data: 이지은
> #### [![대시보드](./dashboard.png "구글 드라이브")](https://www.youtube.com/watch?v=drF5rMgZzB0) 시연영상
> #### 선박, 육상, 공급업체간 기부속/선용품 공급망 관리 시스템
> - 주요 컨텐츠 : 발주 현황 조회 및 입력, 카테고리 선택을 통한 선용품 리스트 조회 및 선용품 별 각 운영체 예상 리드타임 제공, 발주 스케줄링
> - [PPT 보러가기](https://drive.google.com/drive/folders/181qhWvnSFXNsuSuq5NQo1-OnPdIUN6et?usp=sharing)

<br />

## :wrench: 개발 환경
>`React(18.2.0)`
`Java(17.0.10)`
`JDK(17.0.10)`
`Springboot(6.1.11)`
`MySQL(8.0.37)`
`머신러닝/ 딥러닝:` BERT, BertTransformer, XGBClassifier, LightGBMregressor


<br />

## :bulb: 웹 서비스 주요 기능 요약
 ### 공통 기능
- **로그인**: 사용자 인증 및 JWT 발급
- **회원가입/탈퇴**: 사용자 정보 등록 및 계정 비활성화

### 선박
- **물품리스트**: 카테고리별 물품 조회
- **장바구니**: 물품 추가, 수량 조정 및 물품 삭제
- **주문내역**: 주문 내역 조회
  
### 해운선사(육상)
- **일정관리**: 발주 일정 계산 및 관리.
- **구매요청**: 리드타임 기반으로 최적의 발주 날짜에 물품 발주
- **발주관리**: 발주 상태(발주예정 OR 발주 진행 중 OR 발주 완료) 업데이트 및 관리

### 공급업체(판매자)
- **물품 관리**: 업체별 판매하는 물품 등록, 수정, 삭제
- **공지사항**: 공급업체 관련 공지 조회
- **대시보드**: 실시간 물품 발주 내역 및 내 판매 현황 조회

### 관리자
- **공지사항 관리**: 공지사항 CRUD 처리
- **회원관리**: 회원 정보 조회 및 관리


&nbsp;

 
|Home|(선박)구매요청|(해운선사)대시보드|(해운선사)요청건별 품목 및 리드타임 확인-Model1|
|---|---|---|---|
|![로그인](https://github.com/user-attachments/assets/7e08dd1d-02d2-42ba-92b7-5e58028ef9ba)|![구매요청내역](https://github.com/user-attachments/assets/4409c019-2d13-4aba-8f91-ab03d3913868)|![해운선사대시보드+리드타임](https://github.com/user-attachments/assets/5de51580-b91c-459c-a8f8-c6bc43b828a1)|![발주목록확인+리드타임확인](https://github.com/user-attachments/assets/49229cf7-4cb4-446d-83f9-131d2eee12ec)|
|선박/해운선사/공급업체 Role 별 회원가입 및 로그인 |선박은 창고출고일 지정 후 선사에 구매요청| 발주요청 품목 리스트 / 출고일정 / 리드타임 확인 가능|요청 건별 목록 조회|

|(해운선사)대체상품 확인 |(해운선사)품목의 과거 리드타임 확인 |(공급업체)대시보드|(공급업체)기자재 등록-Model2|
|---|---|---|---| 
|![대체상품확인](https://github.com/user-attachments/assets/99bf4390-e584-4502-8d21-8c8dd4601ad9)|![품목별 과거리드타임확인](https://github.com/user-attachments/assets/62a2a0b7-f608-4c2e-8c55-73b0a2b086be)|![공급업체자기물건확인](https://github.com/user-attachments/assets/eeaffd17-445b-4a57-8798-cd2ac655d3fb)|![기자재 등록](https://github.com/user-attachments/assets/138ce76c-397f-4d4c-9c85-9738280ed41c)|
|리드타임 over로 인하여 지정창고입고일에 입고가 불가능한 경우 alert=> 대체상품 추천|품목별 과거 리드타임 차트|공급업체로 들어온 주문 관리 및 조회|새로운 기자재 등록 시 카테고리 추천 분류|

