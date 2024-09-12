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
    
    // const enddate = (event.end).split("T")[0];
    // const startdate = (event.start).split("T")[0];
    const enddate = event.end;
    const startdate = event.start;
    console.log('enddate',enddate);
    console.log('startdate',startdate);
    
    return {
      ...event,
      start: startdate,
      end: addOneDay(enddate),
      backgroundColor: eventColor,
      borderColor: 'white',
    };
  });
};
export default function Schedule() {
  useEffect(() => {
    fetchScheduleData(); //전체 스케줄 api 호출
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');
  }, []);
  //  =====================
  // | 전체 스케줄 목록 api |
  //  =====================
  const fetchScheduleData = async () => {
    // 목업 이벤트 데이터 생성 (랜덤 색상 적용) > 실제로 받아올땐 받아온 데이터에 랜덤색상함수를 더해줘야한다.(fetch에 쓰게되면 api로 바꿔서 들고오면됨)
    // const schedules = [
    //   {
    //     orderId: 1,
    //     listName: '혜인발주',
    //     alias: '유승호',
    //     bestOrderDate: '2024-08-03T15:00:00.000+00:00',
    //     releaseDate: '2024-08-10T15:00:00.000+00:00'
    //   },
    //   {
    //     orderId: 2,
    //     listName: '20240912 AWS발주',
    //     alias: '유승호',
    //     bestOrderDate: '2024-09-03T15:00:00.000+00:00',
    //     releaseDate: '2024-09-10T15:00:00.000+00:00'
    //   },
    //   {
    //     orderId: 3,
    //     alias: '유승호',
    //     listName: 'Event 3',
    //     bestOrderDate: '2024-09-16T15:00:00.000+00:00',
    //     releaseDate: '2024-09-18T15:00:00.000+00:00'
    //   },
    //   {
    //     orderId: 4,
    //     alias: '유승호',
    //     listName: 'Event 4',
    //     bestOrderDate: '2024-09-17T15:00:00.000+00:00',
    //     releaseDate: '2024-10-16T15:00:00.000+00:00'
    //   },
    // ];
    try {
      const response = await fetch('/schedule',
        // {
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        // }
        // }
      );
      if (!response.ok) {
        throw new Error('schdule response was not ok');
      }
      const schedules = await response.json();
      const events = schedules.map(schedule => 
        ({
          orderId: schedule.orderId,
          alias: schedule.alias,
          title: schedule.listName,
          start: schedule.bestOrderDate,
            end: schedule.releaseDate,
          })
        ); 
        console.log('events',events);
        //데이터에 색상추가 & 날짜시간 분리
        const changeDatas = ChangeData(events);
        setScheduledatas(changeDatas);
        setFilteredData(changeDatas);
      } catch (error) {
        console.error('Failed to fetch scheduleData:', error);
      }
    };
    //  =====================
    // |  스케줄 detail api   |
    //  =====================
    const fetchScheduleDetail = async (orderId) => {
      // const details = [
        //   {
          //     orderDetailId: 1,
          //     listName: "20240912 AWS발주",
          //     supplierName: "패션하우스 A",
          //     category1Name: "패션",
          //     category2Name: "여성의류",
          //     category3Name: "바지",
          //     itemName: "청바지",
          //     quantity: 320,
          //     price: 45000.00,
          //     unit: "KRW",
          //     alias: "유승호"
          //   },
          //   {
            //     orderDetailId: 2,
            //     listName: "20240912 AWS발주",
            //     supplierName: "패션하우스 A",
            //     category1Name: "패션",
            //     category2Name: "남성의류",
            //     category3Name: "바지",
            //     itemName: "청바지",
            //     quantity: 220,
            //     price: 45000.00,
            //     unit: "KRW",
            //     alias: "유승호"
    //   },
    //   {
    //     orderDetailId: 3,
    //     listName: "20240912 AWS발주",
    //     supplierName: "패션하우스 B",
    //     category1Name: "패션",
    //     category2Name: "여성의류",
    //     category3Name: "바지",
    //     itemName: "청바지",
    //     quantity: 320,
    //     price: 45000.00,
    //     unit: "KRW",
    //     alias: "유승호"
    //   },
    //   {
      //     orderDetailId: 3,
      //     listName: "20240912 AWS발주",
      //     supplierName: "패션하우스 B",
      //     category1Name: "패션",
      //     category2Name: "여성의류",
      //     category3Name: "바지",
      //     itemName: "청바지",
      //     quantity: 320,
      //     price: 45000.00,
    //     unit: "KRW",
    //     alias: "유승호"
    //   },
    //   {
      //     orderDetailId: 3,
      //     listName: "20240912 AWS발주",
      //     supplierName: "패션하우스 B",
      //     category1Name: "패션",
      //     category2Name: "여성의류",
      //     category3Name: "바지",
      //     itemName: "청바지",
      //     quantity: 320,
      //     price: 45000.00,
      //     unit: "KRW",
      //     alias: "유승호"
      //   },
      //   {
        //     orderDetailId: 3,
        //     listName: "20240912 AWS발주",
        //     supplierName: "패션하우스 B",
        //     category1Name: "패션",
        //     category2Name: "여성의류",
        //     category3Name: "바지",
        //     itemName: "청바지",
        //     quantity: 320,
        //     price: 45000.00,
        //     unit: "KRW",
        //     alias: "유승호"
        //   },
        //   {
          //     orderDetailId: 3,
          //     listName: "20240912 AWS발주",
          //     supplierName: "패션하우스 B",
          //     category1Name: "패션",
          //     category2Name: "여성의류",
          //     category3Name: "바지",
          //     itemName: "청바지",
          //     quantity: 320,
    //     price: 45000.00,
    //     unit: "KRW",
    //     alias: "유승호"
    //   },
    //   {
      //     orderDetailId: 3,
      //     listName: "20240912 AWS발주",
      //     supplierName: "패션하우스 B",
      //     category1Name: "패션",
      //     category2Name: "여성의류",
      //     category3Name: "바지",
      //     itemName: "청바지",
      //     quantity: 320,
      //     price: 45000.00,
      //     unit: "KRW",
      //     alias: "유승호"
      //   },
      //   {
        //     orderDetailId: 3,
        //     listName: "20240912 AWS발주",
        //     supplierName: "패션하우스 B",
        //     category1Name: "패션",
        //     category2Name: "여성의류",
        //     category3Name: "바지",
        //     itemName: "청바지",
        //     quantity: 320,
        //     price: 45000.00,
        //     unit: "KRW",
        //     alias: "유승호"
        //   },
        //   {
    //     orderDetailId: 3,
    //     listName: "20240912 AWS발주",
    //     supplierName: "패션하우스 B",
    //     category1Name: "패션",
    //     category2Name: "여성의류",
    //     category3Name: "바지",
    //     itemName: "청바지",
    //     quantity: 320,
    //     price: 45000.00,
    //     unit: "KRW",
    //     alias: "유승호"
    //   },
    //   {
      //     orderDetailId: 3,
      //     listName: "20240912 AWS발주",
      //     supplierName: "패션하우스 B",
      //     category1Name: "패션",
      //     category2Name: "여성의류",
      //     category3Name: "바지",
      //     itemName: "청바지",
      //     quantity: 320,
      //     price: 45000.00,
      //     unit: "KRW",
      //     alias: "유승호"
      //   },
      //   {
        //     orderDetailId: 3,
        //     listName: "20240912 AWS발주",
        //     supplierName: "패션하우스 B",
        //     category1Name: "패션",
        //     category2Name: "여성의류",
    //     category3Name: "바지",
    //     itemName: "청바지",
    //     quantity: 320,
    //     price: 45000.00,
    //     unit: "KRW",
    //     alias: "유승호"
    //   },
    //   {
      //     orderDetailId: 3,
      //     listName: "20240912 AWS발주",
      //     supplierName: "패션하우스 B",
      //     category1Name: "패션",
      //     category2Name: "여성의류",
      //     category3Name: "바지",
      //     itemName: "청바지",
      //     quantity: 320,
      //     price: 45000.00,
      //     unit: "KRW",
      //     alias: "유승호"
      //   },
      //   {
        //     orderDetailId: 3,
        //     listName: "20240912 AWS발주",
        //     supplierName: "패션하우스 B",
        //     category1Name: "패션",
        //     category2Name: "여성의류",
        //     category3Name: "바지",
        //     itemName: "청바지",
        //     quantity: 320,
        //     price: 45000.00,
        //     unit: "KRW",
        //     alias: "유승호"
        //   },
        //   {
          //     orderDetailId: 3,
          //     listName: "20240912 AWS발주",
          //     supplierName: "패션하우스 B",
          //     category1Name: "패션",
          //     category2Name: "여성의류",
          //     category3Name: "바지",
          //     itemName: "청바지",
          //     quantity: 320,
          //     price: 45000.00,
          //     unit: "KRW",
          //     alias: "유승호"
          //   },
          //   {
            //     orderDetailId: 3,
            //     listName: "20240912 AWS발주",
            //     supplierName: "패션하우스 B",
            //     category1Name: "패션",
    //     category2Name: "여성의류",
    //     category3Name: "바지",
    //     itemName: "청바지",
    //     quantity: 320,
    //     price: 45000.00,
    //     unit: "KRW",
    //     alias: "유승호"
    //   },
    //   {
      //     orderDetailId: 3,
      //     listName: "20240912 AWS발주",
    //     supplierName: "패션하우스 B",
    //     category1Name: "패션",
    //     category2Name: "여성의류",
    //     category3Name: "바지",
    //     itemName: "청바지",
    //     quantity: 320,
    //     price: 45000.00,
    //     unit: "KRW",
    //     alias: "유승호"
    //   },
    // ];
    try {
      const response = await fetch(`/schedule?orderId=${orderId}`,
        {
          // headers: {
          //   'Authorization': `Bearer ${token}`,
          // }
        }
      );
      if (!response.ok) {
        throw new Error('schdule detail response was not ok');
      }
      const details = await response.json();
      const detailevents = details.map(detail => ({
        detailId: detail.orderDetailId,
        title: detail.listName,
        spname: detail.supplierName,
        c1name: detail.category1Name,
        c2name: detail.category2Name,
        c3name: detail.category3Name,
        itemname: detail.itemName,
        quantity: detail.quantity,
        price: detail.price,
        unit: detail.unit,
        alias: detail.alias
      }))

      setDetaildatas(detailevents);
    } catch (error) {
      console.error('Failed to fetch scheduleData:', error);
    }
  };
  const [scheduledatas, setScheduledatas] = useState([]);
  const [detaildatas, setDetaildatas] = useState([]);
  const [filteredData, setFilteredData] = useState([]); //검색용 데이터
  const [searchEvent, setSearchEvent] = useState('');
  const calendarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null) //모달에 넣을 데이터


  const searchlistName = () => {
    const filterData = scheduledatas.filter(event => event.listName.toLowerCase().includes(searchEvent.toLowerCase()));
    setFilteredData(filterData);
    console.log("검색", filterData);

    // 검색된 일정으로 이동
    const calendarApi = calendarRef.current.getApi();
    if (filterData.length > 0) {
      const firstEventDate = new Date(filterData[0].start); //검색한 event의 처음 날짜 추출
      console.log("검색날짜확인", firstEventDate);
      calendarApi.changeView('dayGridMonth'); //fullcalendar의 특정달로 이동하는 함수
      calendarApi.gotoDate(firstEventDate); //검색한 listName의 처음 날짜로 이동
    }

  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchlistName();
    }
  };
  
  //////////
  // Modal//
  /////////

  const handleeventclick = async (e) => {
    console.log('e.event',e.event);
    const eventid = e.event.extendedProps.orderId;
    console.log('eventid',eventid);
    
    // 이벤트 아이디를 백으로 넘겨줘서 데이터 받아오기
    await fetchScheduleDetail(eventid);

    // 받아온 데이터를 들고오기
    const eventDetail = detaildatas;
    console.log('eventdetail', eventDetail);

    // Modal 콘텐츠 생성 함수
    const generateModalContent = (eventDetails) => {
      // 공급자별로 카테고리와 아이템을 정리
      const suppliers = eventDetails.reduce((acc, detail) => {
        const {
          spname,
          c1name,
          c2name,
          c3name,
          itemname,
          quantity,
        } = detail;
    
        if (!acc[spname]) {
          acc[spname] = [];
        }
    
        acc[spname].push({
          category1: c1name,
          category2: c2name,
          category3: c3name,
          itemName: itemname,
          quantity: quantity,
        });
    
        return acc;
      }, {});
    
      return (
        <div className="p-6 w-4/5 mx-auto bg-white rounded-lg shadow-lg"> 
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">{eventDetails[0].title}</h1>
        <h2 className="text-xl font-semibold">담당자: {eventDetails[0].alias}</h2>
      </div>
      {Object.keys(suppliers).map((supplier, index) => (
        <div key={index} className="mb-6">
          <h4 className="text-lg font-semibold mb-2">발주처: {supplier}</h4>
          <table className="w-full min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Category 1</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Category 2</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Category 3</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers[supplier].map((item, itemIndex) => (
                <tr key={itemIndex}>
                  <td className="px-6 py-2 text-sm text-gray-600">{item.category1}</td>
                  <td className="px-6 py-2 text-sm text-gray-600">{item.category2}</td>
                  <td className="px-6 py-2 text-sm text-gray-600">{item.category3}</td>
                  <td className="px-6 py-2 text-sm text-gray-600">{item.itemName}</td>
                  <td className="px-6 py-2 text-sm text-gray-600">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
      );
    };
    
  
    if (eventDetail) {
      const modalContent = generateModalContent(eventDetail);
  
      setModalData(
        <div className="p-4">
          {modalContent}
        </div>
      );
      setOpen(true);
    }
  };
  

  return (
    <div className="w-full">
      <div  className='w-full flex justify-between'>
          <h2 className='text-xl font-semibold text-white mb-4 '>일정 관리</h2>
        <div className=''>
          <input className='m-5 border-' placeholder='견적서 제목' value={searchEvent} onChange={(e) => setSearchEvent(e.target.value)} onKeyDown={handleKeyDown} />
          <button className='bg-indigo-500 m-3 p-2 rounded-md' onClick={searchlistName}>검색</button>
        </div>
      </div>
      <FullCalendar
        // defaultView="dayGridMonth"
        plugins={[dayGridPlugin]}
        events={scheduledatas}
        locale={'ko'}
        ref={calendarRef} // FullCalendar ref 설정 검색시 이동
        eventClick={handleeventclick}
      />
      <Modal open={open} setOpen={setOpen} title={<div><h2>발주 상세 내역</h2></div>}>
        {modalData}
      </Modal>
    </div>
  );
}
