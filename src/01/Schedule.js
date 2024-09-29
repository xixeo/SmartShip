import React, { useEffect, useState, useRef } from "react";
import Loading from '../Compo/Loading';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../assets/theme/Schedule.scss";
import { styled } from '@mui/material/styles';
import Modal from "../Compo/Modal";
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//////////////////////
//    확장 아이콘    //
//////////////////////
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: (props) => (props.expand ? 'rotate(180deg)' : 'rotate(0deg)'),
}));

const ChangeData = (events) => {
  let eventcolorsindex = 0;
  return events.map((event) => {
    // const eventColor = eventcolors[eventcolorsindex % eventcolors.length];
    // eventcolorsindex += 1;

    // const enddate = (event.end).split("T")[0];
    // const startdate = (event.start).split("T")[0];
    const enddate = event.start;
    const startdate = event.start;
    console.log("enddate", enddate);
    console.log("startdate", startdate);

    return {
      ...event,
      start: startdate,
      end: enddate,
      // backgroundColor: eventColor,
      // borderColor: "white",
    };
  });
};
export default function Schedule() {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchScheduleData(); //전체 스케줄 api 호출
  }, []);
  //  =====================
  // | 전체 스케줄 목록 api |
  //  =====================
  const fetchScheduleData = async () => {
    // 목업 이벤트 데이터 생성 (랜덤 색상 적용) > 실제로 받아올땐 받아온 데이터에 랜덤색상함수를 더해줘야한다.(fetch에 쓰게되면 api로 바꿔서 들고오면됨)
    // const schedules = [
    //   {
    //     orderId: 1,
    //     alias: 'AWS',
    //     requestDate: '2024-08-03',
    //     releaseDate: '2024-08-10'
    //   },
    //   {
    //     orderId: 2,
    //     alias: 'AWS',
    //     requestDate: '2024-09-03',
    //     releaseDate: '2024-09-10'
    //   },
    //   {
    //     orderId: 3,
    //     alias: 'AWS',
    //     requestDate: '2024-09-16',
    //     releaseDate: '2024-09-18'
    //   },
    //   {
    //     orderId: 4,
    //     alias: 'AWS',
    //     requestDate: '2024-09-17',
    //     releaseDate: '2024-10-16'
    //   },
    // ];
    setLoading(true)
    try {
      const response = await fetch("schedule",
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("schdule response was not ok");
      }
      const schedules = await response.json();
      console.log('ss', schedules)
      const events = schedules.map((schedule, index) => ({
        orderId: schedule.orderId,
        alias: schedule.alias,
        username: schedule.username,
        title: schedule.requestDate + schedule.alias,
        start: schedule.requestDate,
        className: 'color-' + (index % 6 + 1)
        // start: schedule.requestDate,
        // end: schedule.releaseDate,
      }));
      console.log("events", events);
      //데이터에 색상추가 & 날짜시간 분리
      const changeDatas = ChangeData(events);
      setScheduledatas(changeDatas);
      setFilteredData(changeDatas);
    } catch (error) {
      console.error("Failed to fetch scheduleData:", error);
    } finally {
      setLoading(false)
    }
  };
  //  =====================
  // |  스케줄 detail api   |
  //  =====================
  const fetchScheduleDetail = async (orderId) => {
     const details = [
    //   {
    //     "orderId": 130,
    //     "username": "정해인",
    //     "alias": "해운선사_신입",
    //     "requestDate": "2024-09-27",
    //     "releaseDate": "2024-10-01",
    //     "memo": "가쟈",
    //     "groupedOrderDetails": {
    //         "2024-09-29": [
    //             {
    //                 "orderDetailId": 278,
    //                 "itemsId": 9,
    //                 "itemName": "청바지",
    //                 "part1": "스키니",
    //                 "price": 68000.00,
    //                 "unit": "KRW",
    //                 "quantity": 13,
    //                 "username": "민주샵",
    //                 "alias": "minjoo",
    //                 "orderDate": "2024-09-29"
    //             }
    //         ]
    //     }
    // }
     ];
    setLoading(true)
    try {
      const response = await fetch(`details/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error("schdule detail response was not ok");
      }
      const details = await response.json();
      console.log('ddddd', details)
      const detailevents = [details].map((detail) => ({
        id: detail.orderId,
        title: `${detail.requestDate} ${detail.alias}`,
        releaseDate: detail.releaseDate,
        username: detail.username,
        memo: detail.memo,
        gods: detail.groupedOrderDetails,
      }));
      console.log('확인111', detailevents)
      // setDetaildatas(detailevents);
      return detailevents
      console.log('시간 확인', detaildatas)
    } catch (error) {
      console.error("Failed to fetch scheduleData:", error);
    } finally {
      setLoading(false)
    }
  };

  const [scheduledatas, setScheduledatas] = useState([]);
  const [detaildatas, setDetaildatas] = useState([]);
  const [filteredData, setFilteredData] = useState([]); //검색용 데이터
  const [searchEvent, setSearchEvent] = useState("");
  const calendarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null); //모달에 넣을 데이터
  const [expanded, setExpanded] = useState({});

  const searchlistName = () => {
    const filterData = scheduledatas.filter((event) =>
      event.listName.toLowerCase().includes(searchEvent.toLowerCase())
    );
    setFilteredData(filterData);
    console.log("검색", filterData);

    // 검색된 일정으로 이동
    const calendarApi = calendarRef.current.getApi();
    if (filterData.length > 0) {
      const firstEventDate = new Date(filterData[0].start); //검색한 event의 처음 날짜 추출
      console.log("검색날짜확인", firstEventDate);
      calendarApi.changeView("dayGridMonth"); //fullcalendar의 특정달로 이동하는 함수
      calendarApi.gotoDate(firstEventDate); //검색한 listName의 처음 날짜로 이동
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchlistName();
    }
  };

  //////////////////////
  //  통화 화폐 함수   //
  //////////////////////

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'KRW': return '₩ ';
      case 'USD': return '$ ';
      case 'JPY': return '¥ ';
      case 'EUR': return '€ ';
      default: return '';
    }
  };

  //////////////////////
  //  카드 확장 함수   //
  //////////////////////

  const handleExpandClick = (dateKey) => () => {
    setExpanded((prevState) => ({
      ...prevState,
      [dateKey]: !prevState[dateKey],
    }));
  };

  // 이벤트 커스텀 렌더링
  const renderEventContent = (eventInfo) => (
    <div>
      <span className="event-dot"></span>
      <span>{eventInfo.timeText} {eventInfo.event.title}</span>
    </div>
  );

  //////////
  // Modal//
  /////////

  const handleeventclick = async (e) => {
    console.log("e.event", e.event);
    const eventid = e.event._def.extendedProps.orderId;
    console.log("eventid", eventid);

    // 이벤트 아이디를 백으로 넘겨줘서 데이터 받아오기
    const eventDetails = await fetchScheduleDetail(eventid);
    console.log('받아온 애', eventDetails)
    console.log('받아온 애', Object.keys(eventDetails[0].gods).length > 0)
    if (Object.keys(eventDetails[0].gods).length > 0) {
      const modalContent = generateModalContent(eventDetails);

      setModalData(<div className="p-4">{modalContent}</div>);
      setOpen(true);
    } else {
      // 알람띄우자 아니야 모달을 띄울까? 발주하러가기로 이동하게? 이건 선택사항인듯
    }
  };
    // 받아온 데이터를 들고오기
    // const eventDetails = detaildatas;
    // Modal 콘텐츠 생성 함수
    const generateModalContent = (eventDetails) => {
      console.log("Filtered keys:", Object.keys(eventDetails[0]).filter(key => eventDetails[0][key] && Array.isArray(eventDetails[0][key])));

      return (
        <div className="p-6 w-4/5 mx-auto rounded-lg shadow-lg text-white">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">{eventDetails[0].title}</h1>
            <h2 className="text-xl font-semibold">
              희망입고일: {eventDetails[0].releaseDate}
            </h2>
          </div>

          {Object.keys(eventDetails[0].gods).map((dateKey, index) => (
        <div key={index} className="mb-6 p-3 border border-[#58575C] rounded-md">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold mb-2">발주일: {dateKey}</h4>
            <IconButton
              onClick={handleExpandClick(dateKey)}
              aria-expanded={expanded[dateKey] || false}
              aria-label="show more"
              className={`transition-transform ${expanded[dateKey] ? 'rotate-180' : ''}`}
              sx={{ color: 'white', marginLeft: 'auto' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </div>
          <Collapse in={!!expanded[dateKey]} timeout="auto" unmountOnExit>
            <table className="w-full min-w-full divide-y divide-[#17161D]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium bg-[#47454F] text-white">No.</th>
                  <th className="px-6 py-3 text-left text-sm font-medium bg-[#47454F] text-white">Item Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium bg-[#47454F] text-white">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium bg-[#47454F] text-white">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium bg-[#47454F] text-white">Supplier</th>
                </tr>
              </thead>
              <tbody className="bg-67666E divide-y divide-[#17161D]">
                {eventDetails[0].gods[dateKey].map((detail, idx) => (
                  <tr key={detail.orderDetailId}>
                    <td className="px-6 py-2 text-sm bg-[#67666E] text-white">{idx + 1}</td>
                    <td className="px-6 py-2 text-sm bg-[#67666E] text-white">{detail.itemName}</td>
                    <td className="px-6 py-2 text-sm bg-[#67666E] text-white">{detail.quantity}</td>
                    <td className="px-6 py-2 text-sm bg-[#67666E] text-white">{getCurrencySymbol(detail.unit) + detail.price}</td>
                    <td className="px-6 py-2 text-sm bg-[#67666E] text-white">{detail.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Collapse>
        </div>
      ))}
          <div>
            <h1 className="text-white">비고</h1>
            <div className="border border-[#58575C] rounded-md p-2">{eventDetails[0].memo}</div>
          </div>
          <div className="flex justify-end">
            <h1>구매자: {eventDetails[0].username}</h1>
          </div>
        </div>
      );
    };
  


  return (
    <div className="flex flex-col p-6 h-full">
      <div className="w-full flex justify-between">
        <div className="text-xl font-semibold text-white mb-4">일정 관리</div>
        <div className="">
          <input
            className="textfield"
            placeholder="견적서 제목"
            value={searchEvent}
            onChange={(e) => setSearchEvent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="blue-btn ml-2" onClick={searchlistName}>
            검색
          </button>
        </div>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth" // 기본 보기를 월간으로 설정
        events={scheduledatas}
        eventDisplay="block" // 리스트 항목 형태로 표시
        locale={"ko"}
        ref={calendarRef}
        eventClick={handleeventclick}
        eventContent={renderEventContent}
      />
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          <div>
            <h2 className="text-white">발주 상세 내역</h2>
          </div>
        }
      >
        {modalData}
      </Modal>
    </div>
  );
}
