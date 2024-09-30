import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { ReactComponent as ArrowDown } from "../assets/icons/svg/arrowDown.svg";
import Box from "@mui/material/Box";
import Loading from "../Compo/Loading";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate"; // 페이지네이션 라이브러리
import { Select, MenuItem } from "@mui/material"; // 페이지당 게시글 수 

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: (props) => (props.expand ? "rotate(180deg)" : "rotate(0deg)"),
}));

export default function PurchaseRequest() {
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [listdata, setListdata] = useState([]);
  const [currentItems, setCurrentItems] = useState([]); // 현재 페이지에 표시할 아이템
  const [itemOffset, setItemOffset] = useState(0); // 현재 페이지의 시작 인덱스
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [searchEvent, setSearchEvent] = useState("");
  const [filteredData, setFilteredData] = useState([]); // 검색된 데이터 저장
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchpurcheslist = async () => {
    setLoading(true);
    try {
      const response = await fetch("schedule", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("purchaserequestlist response was not ok");
      }
      const purreq = await response.json();
      const sortdata = purreq.sort((a, b) => {
        const dateA = new Date(a.requestDate);
        const dateB = new Date(b.requestDate);
      
        // 날짜가 같으면 시간으로 비교
        if (dateA.toDateString() === dateB.toDateString()) {
          return dateB - dateA; // 시간 기준으로 내림차순 정렬
        }
        return dateB - dateA; // 날짜 기준으로 내림차순 정렬
      });
      // 모든 카드 확장 상태를 true로 설정
      const initialExpanded = {};
      sortdata.forEach((order) => {
        initialExpanded[order.orderId] = true;
      });
      setExpanded(initialExpanded);
      setListdata(sortdata);
      setCurrentItems(sortdata); // 초기 아이템 설정
      setFilteredData(sortdata); // 초기 필터된 데이터 설정
      setLoading(false);
    } catch (e) {
      console.log("Failed to fetch PurchaseRequestlist", e);
    }
  };
  
  console.log('데이터확인', listdata)

  useEffect(() => {
    fetchpurcheslist();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredData.slice(itemOffset, endOffset)); // 필터된 데이터에 따라 현재 아이템 설정
  }, [itemOffset, filteredData]);

  const handleExpandClick = (orderId) => () => {
    setExpanded({
      ...expanded,
      [orderId]: !expanded[orderId],
    });
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredData.length;
    setItemOffset(newOffset);
  };

  const handleSearch = () => {
    const searchdata = listdata.filter((e) =>
      e.username.toLowerCase().includes(searchEvent.toLowerCase())
    );
    setFilteredData(searchdata); // 검색 결과로 필터된 데이터 업데이트
    setItemOffset(0); // 첫 페이지로 초기화
    setCurrentItems(searchdata.slice(0, itemsPerPage)); // 검색 결과에 따라 현재 아이템 설정
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleResetSearch = () => {
    setSearchEvent("");
    setFilteredData(listdata); // 원래 리스트로 복구
    setCurrentItems(listdata.slice(0, itemsPerPage)); // 초기 아이템 설정
    setItemOffset(0); // 첫 페이지로 돌아감
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="p-6">
          <h1 className="text-xl font-semibold text-white mb-4">구매 요청</h1>
          <div className="flex justify-end mb-4">
            <input
              className="textfield"
              placeholder="회사명"
              value={searchEvent}
              onChange={(e) => setSearchEvent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="blue-btn ml-2" onClick={handleSearch}>
              검색
            </button>
            <button className="blue-btn ml-2" onClick={handleResetSearch}>
              초기화
            </button>
          </div>
          
          {currentItems.length === 0 ? (
            <div className="text-white">검색 결과가 없습니다.</div>
          ) : (
            currentItems.map((order) => (
              <div
                key={order.orderId}
                className="text-white rounded-lg mt-6 card-bg"
                onClick={(e) => navigate(`/getOrderDetail/${order.orderId}`)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "18px 24px",
                  }}
                >
                  <div className="w-full">
                    <div className="w-full flex items-center mb-3">
                      <div className="flex text-sm mr-6 text-[#ffffff59]">
                        <h1 className="mr-2">주문일자 : </h1>
                        <h1>{order.requestDate}</h1>
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <h1 className="text-xl font-bold text-[#A276FF]">
                          {order.username}
                        </h1>
                      <div className="flex items-center">
                        <h1 className="mr-3 text-sm">희망입고일 :</h1>
                        <h1 className="ml-2 text-xl font-bold text-[#A276FF]">
                          {order.releaseDate}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpandClick(order.orderId)();
                    }}
                    aria-expanded={expanded[order.orderId] || false}
                    aria-label="show more"
                    className={`transition-transform ${
                      expanded[order.orderId] ? "rotate-180" : ""
                    }`}
                    sx={{ color: "white", marginLeft: "auto" }}
                  >
                    <ArrowDown height={"24px"} />
                  </IconButton>
                </Box>
                <Collapse
                  in={expanded[order.orderId]}
                  timeout="auto"
                  unmountOnExit
                  className="p-6 pt-2"
                >
                  <div>
                    <h1 className="mb-2">비고</h1>
                    <div className="mr-5 p-5 rounded-lg textfield min-h-9">
                      {order.memo}
                    </div>
                  </div>
                </Collapse>
              </div>
            ))
          )}
          <div className="flex justify-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel="다음 >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={Math.ceil(filteredData.length / itemsPerPage)} // 필터된 데이터에 따라 페이지 수 결정
              previousLabel="< 이전"
              renderOnZeroPageCount={null}
              containerClassName="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
              className="text-white w-80 flex justify-around fixed bottom-24 left-1/2 transform -translate-x-1/2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
