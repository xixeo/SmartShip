import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
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

  // 목업 일정 데이터
  const events = [
    {
      id: 1,
      startDate: new Date(2024, 8, 10),
      endDate: new Date(2024, 8, 12),
      title: 'Event 1',
      color: getRandomColor()
    },
    {
      id: 2,
      startDate: new Date(2024, 8, 15),
      endDate: new Date(2024, 8, 20),
      title: 'Event 2',
      color: getRandomColor()
    }
  ];

  const isDateInRange = (date, startDate, endDate) => {
    return date >= startDate && date <= endDate;
  }

  //modal
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null) //모달에 넣을 데이터

  const handleModal = (date) => {
    //일정 클릭 시 모달열기
    const event = events.find(event => isDateInRange(date, event.startDate, event.endDate));
    console.log("event",event);
    if(event){
      setModalData( //모달에 들어갈 내용
        <div>
        <p>{`Start Date: ${event.startDate.toDateString()}`}</p>
        <p>{`End Date: ${event.endDate.toDateString()}`}</p>
        <p>{event.title}</p>
        </div>
      );
      setOpen(true);
    }
  };

  const tileStyle = ({date}) => {
    const event = events.find(event => isDateInRange(date,event.startDate, event.endDate));
    console.log('Checking date:', date, 'Event:', event);
    if(event){
      return {backgroundColor: event.color, borderRadius:'5px',color:'#fff'};
    }
    return null;
  }

  return (
    <div className="flex-col w-full h-full flex justify-center items-center">
      <div className='w-11/12 flex justify-end'>
      <input className='items-end m-5'/>
      <button className='bg-indigo-600 m-5 p-2'>검색</button>
      </div>
      <Calendar tileStyle={tileStyle}
                onClickDay={handleModal}/>
      <Modal open={open} setOpen={setOpen} title="EVENT Details">
       {modalData}
      </Modal>
    </div>
  );
  // const [tileHeight, setTileHeight] = useState('auto');

  // useEffect(() => {
  //   // 화면의 전체 높이
  //   const screenHeight = window.innerHeight;
  //   // Footer 높이 (이 높이는 Footer 컴포넌트에서 지정된 높이에 맞게 설정)
  //   const footerHeight = 80; // Footer 높이 (footer 높이와 맞춰 설정)
  //   // 네비게이션 부분 높이 (Calendar Navigation Bar 높이)
  //   const navigationHeight = 50; // 네비게이션 높이

  //   // 실제 달력에서 필요한 행의 갯수 구하기 (한 달의 최대 주 수는 6주이므로 6을 기본값으로 사용)
  //   const rows = 6;

  //   // 계산된 타일의 높이 설정
  //   const calculatedTileHeight = (screenHeight - footerHeight - navigationHeight) / rows;

  //   setTileHeight(`${calculatedTileHeight}px`);
  // }, []);

  // return (
  //   <div className="flex-col w-full h-full flex justify-center items-center">
  //     <div className='w-11/12 flex justify-end'>
  //     <input className='m-5'/>
  //     <button className='bg-indigo-600 m-5 p-2'>검색</button>
  //     </div>
  //     <Calendar tileContent={({ date, view }) => null} />
  //     <style jsx>{`
  //       .react-calendar__tile {
  //         height: ${tileHeight}; /* 동적으로 계산된 높이 설정 */
  //       }
  //     `}</style>
  //   </div>
  // );
}
