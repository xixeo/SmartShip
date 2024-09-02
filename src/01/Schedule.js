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
const eventcolors = ['#ebebeb', '#423e02', '#222'];

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
  const [datas, setDatas] = useState([]);
  const [filteredData, setFilteredData] = useState([]); //검색용 데이터유지
  const [searchEvent, setSearchEvent] = useState('');
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // 목업 이벤트 데이터 생성 (랜덤 색상 적용) > 실제로 받아올땐 받아온 데이터에 랜덤색상함수를 더해줘야한다.(fetch에 쓰게되면 api로 바꿔서 들고오면됨)
      const events = [
        {
          title: '혜인발주',
          start: '2024-08-03',
          end: '2024-08-10'
        },
        {
          title: '2024-09-12 AWS발주',
          start: '2024-09-03',
          end: '2024-09-10'
        },
        {
          title: 'Event 3',
          start: '2024-09-16',
          end: '2024-09-18'
        },
      ];
      const changeDatas = ChangeData(events);
      setDatas(changeDatas);
      setFilteredData(changeDatas);
    };
    fetchData();
  },[]);

  const searchTitle = ()=>{
    const filterData = datas.filter(event => event.title.toLowerCase().includes(searchEvent.toLowerCase()));
    setFilteredData(filterData);
    console.log("검색",filterData);

    // 검색된 일정으로 이동
    const calendarApi = calendarRef.current.getApi();
    if (filterData.length > 0) {
        const firstEventDate = new Date(filterData[0].start); //검색한 event의 처음 날짜 추출
        console.log("검색날짜확인",firstEventDate);
        calendarApi.changeView('dayGridMonth'); //fullcalendar의 특정달로 이동하는 함수
        calendarApi.gotoDate(firstEventDate); //검색한 title의 처음 날짜로 이동
      }
    
  }

  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      searchTitle();
    }
  };

  //modal
  // const handleModal = (event) =>{

  // }

  return (
    <div className="w-full">
      <div className='w-full flex justify-end'>\
        <input className='m-5' placeholder='견적서 제목' value={searchEvent} onChange={(e) => setSearchEvent(e.target.value)} onKeyDown={handleKeyDown}/>
        <button className='bg-indigo-500 m-3 p-2' onClick={searchTitle}>검색</button>
      </div>
      <FullCalendar
        // defaultView="dayGridMonth"
        plugins={[dayGridPlugin]}
        events={datas}
        ref={calendarRef} // FullCalendar ref 설정 검색시 이동
        // onClickevent={handleModal}
      />
    </div>
  );
}
