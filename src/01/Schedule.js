import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Schedule.css';
import Modal from '../Compo/Modal';

export default function Schedule() {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

   // endDate에 1일 더하기 함수 > 그래야 enddate까지 화면에 출력됨!
   const addOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
  };

  // 목업 이벤트 데이터 생성 (랜덤 색상 적용) > 실제로 받아올땐 받아온 데이터에 랜덤색상함수를 더해줘야한다.
  const events = [
    {
      title: '혜인발주',
      start: '2024-09-03',
      end: addOneDay('2024-09-10'),
      backgroundColor: getRandomColor(),
      borderColor: 'white',
    },
    {
      title: '2024-09-12 AWS발주',
      start: '2024-09-03',
      end: addOneDay('2024-09-10'),
      backgroundColor: getRandomColor(),
      borderColor:'white',
    },
    {
      title: 'Event 3',
      start: '2024-09-16',
      end: addOneDay('2024-09-18'),
      backgroundColor: getRandomColor(),
      borderColor: 'white',
    },
  ];

    return (
      <div className="w-full">
        <div className='w-full flex justify-end'>\
          <input className='m-5'/>
          <button className='bg-indigo-500 m-3 p-2'>검색</button>
        </div>
        <FullCalendar 
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin]}
          events={events}
        />
      </div>
    );
}
