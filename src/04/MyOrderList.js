import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { ReactComponent as ArrowDown } from "../assets/icons/svg/arrowDown.svg";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import Box from "@mui/material/Box";
import Loading from "../Compo/Loading";
import ReactPaginate from "react-paginate"; 

//////////////////////
//    확장 아이콘    //
//////////////////////
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

export default function MyOrderList() {
  const [expanded, setExpanded] = useState({});
  const [listdata, setListdata] = useState([]);
  const [currentItems, setCurrentItems] = useState([]); // 현재 페이지에 표시할 아이템
  const [itemOffset, setItemOffset] = useState(0); // 현재 페이지의 시작 인덱스
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchMyorderdata = async () => {
       const myorderlist = [
          // {
          //     "orderId": 1,
          //     "username": "AWS선박",
          //     "alias": "유승호",
          //     "releaseDate": "2024-05-04",
          //     "bestOrderDate": "2024-01-21",
          //     "requestDate": "2024-09-06",
          //     "memo": "테스트",
          //     "orderstate": "complete",
          //     "orderDetails": [
          //         {
          //             "orderDetailId": 1,
          //             "category1Name": "패션의류",
          //             "category2Name": "여성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 1,
          //             "itemName": "치마",
          //             "quantity": 10,
          //             "price": 1200.99,
          //             "unit": "JPY",
          //             "username": "민주샵",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 7,
          //             "category1Name": "패션의류",
          //             "category2Name": "여성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 1,
          //             "itemName": "치마",
          //             "quantity": 5,
          //             "price": 1200.99,
          //             "unit": "JPY",
          //             "username": "민주샵",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 8,
          //             "category1Name": "패션의류",
          //             "category2Name": "여성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 2,
          //             "itemName": "청바지",
          //             "quantity": 10,
          //             "price": 40100.00,
          //             "unit": "KRW",
          //             "username": "수플린",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         }
          //     ]
          // },
          // {
          //     "orderId": 7,
          //     "username": "AWS선박",
          //     "alias": "유승호",
          //     "releaseDate": "2024-09-25",
          //     "bestOrderDate": "2024-09-18",
          //     "requestDate": "2024-09-18",
          //     "memo": "다시 테스트",
          //     "orderstate": "ready",
          //     "orderDetails": [
          //         {
          //             "orderDetailId": 5,
          //             "category1Name": "패션의류",
          //             "category2Name": "여성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 1,
          //             "itemName": "치마",
          //             "quantity": 5,
          //             "price": 1200.99,
          //             "unit": "JPY",
          //             "username": "민주샵",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 6,
          //             "category1Name": "패션의류",
          //             "category2Name": "여성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 2,
          //             "itemName": "청바지",
          //             "quantity": 10,
          //             "price": 40100.00,
          //             "unit": "KRW",
          //             "username": "수플린",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 9,
          //             "category1Name": "패션의류",
          //             "category2Name": "여성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 1,
          //             "itemName": "치마",
          //             "quantity": 7,
          //             "price": 1200.99,
          //             "unit": "JPY",
          //             "username": "민주샵",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 10,
          //             "category1Name": "패션의류",
          //             "category2Name": "여성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 2,
          //             "itemName": "청바지",
          //             "quantity": 12,
          //             "price": 40100.00,
          //             "unit": "KRW",
          //             "username": "수플린",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         }
          //     ]
          // },
          // {
          //     "orderId": 8,
          //     "username": "민주샵",
          //     "alias": "minjoo",
          //     "releaseDate": "2024-09-25",
          //     "bestOrderDate": "2024-09-18",
          //     "requestDate": "2024-09-09",
          //     "memo": "질러볼까",
          //     "orderstate": "ready",
          //     "orderDetails": [
          //         {
          //             "orderDetailId": 17,
          //             "category1Name": "뷰티",
          //             "category2Name": "향수",
          //             "category3Name": "여성향수",
          //             "itemsId": 6,
          //             "itemName": "NO.5",
          //             "quantity": 3,
          //             "price": 299000.00,
          //             "unit": "KRW",
          //             "username": "첼시마켓",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 18,
          //             "category1Name": "뷰티",
          //             "category2Name": "향수",
          //             "category3Name": "캔들/디퓨저",
          //             "itemsId": 7,
          //             "itemName": "양키캔들",
          //             "quantity": 3,
          //             "price": 49900.00,
          //             "unit": "KRW",
          //             "username": "첼시마켓",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         }
          //     ]
          // },
          // {
          //     "orderId": 10,
          //     "username": "minju",
          //     "alias": "minju",
          //     "releaseDate": "2024-10-01",
          //     "bestOrderDate": "2024-09-10",
          //     "requestDate": "2024-09-10",
          //     "memo": null,
          //     "orderstate": "progressing",
          //     "orderDetails": [
          //         {
          //             "orderDetailId": 20,
          //             "category1Name": "패션의류",
          //             "category2Name": "여성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 1,
          //             "itemName": "치마",
          //             "quantity": 10,
          //             "price": 1200.99,
          //             "unit": "JPY",
          //             "username": "민주샵",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 21,
          //             "category1Name": "패션의류",
          //             "category2Name": "남성패션",
          //             "category3Name": "팬츠",
          //             "itemsId": 3,
          //             "itemName": "청바지",
          //             "quantity": 10,
          //             "price": 39800.00,
          //             "unit": "KRW",
          //             "username": "민주샵",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 22,
          //             "category1Name": "패션의류",
          //             "category2Name": "캐주얼/유니섹스",
          //             "category3Name": "팬츠",
          //             "itemsId": 4,
          //             "itemName": "청바지",
          //             "quantity": 10,
          //             "price": 38800.00,
          //             "unit": "KRW",
          //             "username": "쿠팡",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         },
          //         {
          //             "orderDetailId": 23,
          //             "category1Name": "뷰티",
          //             "category2Name": "향수",
          //             "category3Name": "여성향수",
          //             "itemsId": 6,
          //             "itemName": "NO.5",
          //             "quantity": 10,
          //             "price": 299000.00,
          //             "unit": "KRW",
          //             "username": "첼시마켓",
          //             "recommendedorder.orderdate": null,
          //             "ordering": false
          //         }
          //     ]
          // },
       ];
      setLoading(true);
      try {
        const response = await fetch(`userOrders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("myorderlist response was not ok");
        }
        const myorderlist = await response.json();
        const sortdata = myorderlist.sort(
          (a, b) => new Date(b.requestDate) - new Date(a.requestDate)
        );
        setListdata(sortdata);
        setLoading(false);
      } catch (e) {
        console.log("Failed to fetch getMyOrderList", e);
      }
    };
    fetchMyorderdata();
  }, []);

  console.log("data", listdata);

  //////////////////////
  // 데이터 처리 함수  //
  //////////////////////

  const addOrderdetailscount = (order) => {
    return order.map((order) => ({
      ...order,
      orderDetailscount: order.orderDetails.length,
    }));
  };
  const updateListdata = addOrderdetailscount(listdata);

  //////////////////////
  //  카드 확장 함수   //
  //////////////////////

  const handleExpandClick = (orderId) => () => {
    setExpanded({
      ...expanded,
      [orderId]: !expanded[orderId],
    });
  };

  //////////////////////
  //  발주 현황 함수   //
  //////////////////////

  const setColor = (state) => {
    switch (state) {
      case "ready":
        return <h1 className="text-[#5BF4FF]">발주 예정</h1>;
      case "progressing":
        return <h1 className="text-[#FFBA07]">발주 진행</h1>;
      case "complete":
        return <h1 className="text-[#A0A0A0]">발주 완료</h1>;
    }
  };

  //////////////////////
  //  통화 단위 함수   //
  //////////////////////

  // 수량에 맞춰 가격 계산 + 단위 붙이기
  const formatPrice = (price, quantity, unit) => {
    const totalPrice = price * quantity;
    switch (unit) {
      case "KRW":
        return `₩ ${totalPrice.toLocaleString()}`;
      case "USD":
        return `$ ${totalPrice.toLocaleString()}`;
      case "JPY":
        return `¥ ${totalPrice.toLocaleString()}`;
      case "EUR":
        return `€ ${totalPrice.toLocaleString()}`;
      default:
        return totalPrice.toLocaleString();
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % listdata.length;
    setItemOffset(newOffset);
  };

  return (
    <div>
      {/* Loading이 true면 컴포넌트를 띄우고, false면 null(빈 값)처리 하여 컴포넌트 숨김 */}
      {loading ? (
        <Loading />
      ) : (
        <div className="flex-col text-white MyOrderList">
          <h2 className="text-2xl font-semibold text-white mb-10 ml-5">
            구매요청 내역
          </h2>
          {updateListdata.map((order, index) => (
            <div
              key={order.orderId}
              className="text-white rounded-lg m-5 card-bg"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 24px",
                }}
              >
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold mr-1">
                      <span className="mr-1">{index + 1}.</span>{" "}
                      {order.requestDate}
                    </h3>
                    <h3 className="m-1.5 text-sm text-[#9c87ff] font-semibold">
                      ( {order.orderDetailscount}건 )
                    </h3>
                  </div>
                  <h1 className="text-lg font-semibold">
                    {setColor(order.state)}
                  </h1>
                </div>
                <IconButton
                  onClick={handleExpandClick(order.orderId)}
                  aria-expanded={expanded[order.orderId] || false}
                  aria-label="show more"
                  className={`transition-transform ${
                    expanded[order.orderId] ? "rotate-180" : ""
                  }`}
                  sx={{ color: "white", marginLeft: "auto" }}
                >
                  <ArrowDown />
                  {/* <ArrowDropDownIcon fontSize="large" /> */}
                </IconButton>
              </Box>
              <Collapse
                in={expanded[order.orderId]}
                timeout="auto"
                unmountOnExit
              >
                <div className="w-full px-6 pt-0 pb-5 max-h-40 overflow-auto">
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          "th, td": {
                            color: "white",
                            fontWeight: "bold",
                            border: "none",
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                          },
                        }}
                      >
                        <TableCell align="center">Item Name</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Supplier</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.orderDetails.map((detail) => (
                        <TableRow key={detail.orderDetailId}>
                          {order.state !== "발주 완료" ? (
                            <>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "semi-bold",
                                  color: "white",
                                }}
                              >
                                {detail.itemName}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "semi-bold",
                                  color: "white",
                                }}
                              >
                                {detail.quantity}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "semi-bold",
                                  color: "white",
                                }}
                              >
                                -
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "semi-bold",
                                  color: "white",
                                }}
                              >
                                -
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "semi-bold",
                                  color: "white",
                                }}
                              >
                                {detail.itemName}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "semi-bold",
                                  color: "white",
                                }}
                              >
                                {detail.quantity}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "semi-bold",
                                  color: "white",
                                }}
                              >
                                {formatPrice(
                                  detail.price,
                                  detail.quantity,
                                  detail.unit
                                )}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "semi-bold",
                                  color: "white",
                                }}
                              >
                                {detail.username}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-5">
                    <h1>비고</h1>
                    <div className="mt-2 p-5 rounded-lg textfield min-h-9">
                      {order.memo}
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
          ))}
          <div className="flex justify-center">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="다음 >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={Math.ceil(listdata.length / itemsPerPage)} // 필터된 데이터에 따라 페이지 수 결정
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
                  className="text-white w-80 flex justify-around fixed bottom-20 left-1/2 transform -translate-x-1/2"
                />
          </div>
        </div>        
      )}
    </div>
  );
}
