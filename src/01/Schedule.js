import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Schedule.css';
import Modal from '../Compo/Modal';

// endDate에 1일 더하기 함수 > 그래야 enddate까지 화면에 출력됨!
const addOneDay = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
};
const eventcolors = ['#F8FF95', '#B2A4FF', '#FCA3CC', '#9BE3DE', '#A9ECA2', '#FFA952'];

const ChangeData = (events) => {
  let eventcolorsindex = 0;
  return events.map(event => {

    const eventColor = eventcolors[eventcolorsindex % eventcolors.length];
    eventcolorsindex += 1;

    return {
      ...event,
      end: addOneDay(event.end),
      backgroundColor: eventColor,
      borderColor: 'white',
    };
  });
};
export default function Schedule() {
  const [scheduledatas, setScheduledatas] = useState([]);
  const [detaildatas, setDetaildatas] = useState([]);
  const [filteredData, setFilteredData] = useState([]); //검색용 데이터
  const [searchEvent, setSearchEvent] = useState('');
  const calendarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null) //모달에 넣을 데이터

  useEffect(() => {
    //  =====================
    //|| 전체 스케줄 목록 api ||
    //  =====================
    const fetchScheduleData = async () => {
      // 목업 이벤트 데이터 생성 (랜덤 색상 적용) > 실제로 받아올땐 받아온 데이터에 랜덤색상함수를 더해줘야한다.(fetch에 쓰게되면 api로 바꿔서 들고오면됨)
      const events = [
        {
          title: '혜인발주',
          start: '2024-08-03',
          end: '2024-08-10'
        },
        {
          title: '20240912 AWS발주',
          start: '2024-09-03',
          end: '2024-09-10'
        },
        {
          title: 'Event 3',
          start: '2024-09-16',
          end: '2024-09-18'
        },
      ];
      try {
        // const response = await fetch('/schedule');
        // if (!response.ok) {
        //   throw new Error('schdule response was not ok');
        // }
        // const events = await response.json();
        //데이터에 색상추가
        const changeDatas = ChangeData(events);
        setScheduledatas(changeDatas);
        setFilteredData(changeDatas);
      } catch (error) {
        console.error('Failed to fetch scheduleData:', error);
      }
    };
    //  =====================
    //|| 스케줄 detail api ||
    //  =====================
    const fetchScheduleDetail = async () => {
      const detailevents = [
        {
          id: 1,
          title: '20240912 AWS발주',
          categories: [
            {
              supplier: 'HaIn',
              category1: '식품',
              category2: '과일',
              items: [
                { itemname: '수박', qnt: '100' },
                { itemname: '사과', qnt: '50' }
              ]
            },
            {
              supplier: 'TechCorp',
              category1: '전자기기',
              category2: '컴퓨터',
              items: [
                { itemname: '노트북', qnt: '10' },
                { itemname: '마우스', qnt: '20' }
              ]
            }
          ]
        },
        {
          id: 2,
          title: '혜인발주',
          categories: [
            {
              supplier: 'HaIn',
              category1: '식품',
              category2: '채소',
              items: [
                { itemname: '당근', qnt: '200' },
                { itemname: '양파', qnt: '150' }
              ]
            },
            {
              supplier: 'GreenWorld',
              category1: '식품',
              category2: '곡물',
              items: [
                { itemname: '쌀', qnt: '500' },
                { itemname: '밀가루', qnt: '300' }
              ]
            }
          ]
        },
      ];
      try {
        // const response = await fetch('/schedule/{id}');
        // if (!response.ok) {
        //   throw new Error('schdule detail response was not ok');
        // }
        // const detailevents = await response.json();

        setDetaildatas(detailevents);
      } catch (error) {
        console.error('Failed to fetch scheduleData:', error);
      }
    };
    fetchScheduleData(); //전체 스케줄 api 호출
    fetchScheduleDetail(); // 스케줄 detail 호출
  }, []);

  const searchTitle = () => {
    const filterData = scheduledatas.filter(event => event.title.toLowerCase().includes(searchEvent.toLowerCase()));
    setFilteredData(filterData);
    console.log("검색", filterData);

    // 검색된 일정으로 이동
    const calendarApi = calendarRef.current.getApi();
    if (filterData.length > 0) {
      const firstEventDate = new Date(filterData[0].start); //검색한 event의 처음 날짜 추출
      console.log("검색날짜확인", firstEventDate);
      calendarApi.changeView('dayGridMonth'); //fullcalendar의 특정달로 이동하는 함수
      calendarApi.gotoDate(firstEventDate); //검색한 title의 처음 날짜로 이동
    }

  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchTitle();
    }
  };

  //modal
  const handleeventclick = (e) => {
    const eventtitle = e.event.title;
    console.log('eventtitle',eventtitle);
    const eventDetail = detaildatas.find(detail => detail.title === eventtitle);
    console.log('eventde', eventDetail);

    if (eventDetail) {
      // 공급자별로 카테고리와 품목을 나누기
      const suppliers = eventDetail.categories.reduce((acc, category) => {
        const { supplier, category1, category2, items } = category;
        if (!acc[supplier]) {
          acc[supplier] = [];
        }
        acc[supplier].push({ category1, category2, items });
        return acc;
      }, {});
  
      // 모달에 표시할 HTML 구성
    const modalContent = Object.entries(suppliers).map(([supplier, categories], index) => (
      <div key={index} className="mb-4">
        <h3 className="text-xl font-semibold mb-2">공급업체: {supplier}</h3>
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="mb-4">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category 1</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Category 2</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Item Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {category.items.map((item, itemIndex) => (
                  <tr key={itemIndex}>
                    <td className="px-4 py-2 text-sm text-gray-600">{category.category1}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{category.category2}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.itemname}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{item.qnt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    ));

    setModalData(
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{eventDetail.title}</h2>
        {modalContent}
      </div>
    );
      setOpen(true)
    }
  };

  return (
    <div className="w-full">
      <div className='w-full flex justify-end'>\
        <input className='m-5' placeholder='견적서 제목' value={searchEvent} onChange={(e) => setSearchEvent(e.target.value)} onKeyDown={handleKeyDown} />
        <button className='bg-indigo-500 m-3 p-2' onClick={searchTitle}>검색</button>
      </div>
      <FullCalendar
        // defaultView="dayGridMonth"
        plugins={[dayGridPlugin]}
        events={scheduledatas}
        locale={'ko'}
        ref={calendarRef} // FullCalendar ref 설정 검색시 이동
        eventClick={handleeventclick}
      />
      <Modal open={open} setOpen={setOpen}>
        {modalData}
      </Modal>
    </div>
  );
}
