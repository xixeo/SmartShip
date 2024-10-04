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
    Select,
    Pagination,
    MenuItem,
} from "@mui/material";
import Box from "@mui/material/Box";
import Loading from "../Compo/Loading";
import ReactPaginate from "react-paginate";
import "./MyOrderList.scss";

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
    const token = localStorage.getItem("token");
    const [expanded, setExpanded] = useState({});
    const [listdata, setListdata] = useState([]);
    const [currentItems, setCurrentItems] = useState([]); // 현재 페이지에 표시할 아이템
    const [itemOffset, setItemOffset] = useState(0); // 현재 페이지의 시작 인덱스
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
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
                const formattedData = myorderlist.map(order => {
                    const groupedDetails = {};

                    // orderDetails 배열을 key값으로 그룹화
                    order.orderDetails.forEach(detail => {
                        const key = `${detail.itemName}-${detail.part1}`;

                        // key에 맞는 배열이 없으면 새로 생성
                        if (!groupedDetails[key]) {
                            groupedDetails[key] = [];
                        }

                        // key에 맞춰 detail을 추가
                        groupedDetails[key].push(detail);
                    });

                    // 기존 order에 그룹화된 orderDetails를 추가
                    return {
                        ...order,
                        orderDetails: Object.values(groupedDetails),  // 그룹화된 값들만 배열로 저장
                    };
                });
                console.log('묶은 데이터!!!', formattedData)
                // orderId를 기준으로 내림차순 정렬
                const sortdata = formattedData.sort((a, b) => b.orderId - a.orderId);
                setListdata(sortdata);
            } catch (e) {
                console.log("Failed to fetch getMyOrderList", e);
            } finally {
                setLoading(false);
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

    const updatedListData = addOrderdetailscount(listdata);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(updatedListData.slice(itemOffset, endOffset)); // 화면에 보여질 아이템들을 재설정
    }, [itemOffset, itemsPerPage, listdata]); // 의존성 배열 업데이트

    const handleRowsPerPageChange = (event) => {
        setItemsPerPage(event.target.value); // itemsPerPage 상태 업데이트
        setItemOffset(0); // 첫 페이지의 아이템 offset으로 재설정
        setCurrentPage(1); // 현재 페이지를 첫 페이지로 재설정
    };

    const handlePageClick = (event, value) => {
        const newOffset = (value - 1) * itemsPerPage;
        setCurrentPage(value);
        setItemOffset(newOffset);
    };

    //////////////////////
    //  카드 확장 함수   //
    //////////////////////

    const handleExpandClick = (orderId) => () => {
        setExpanded({
            ...expanded,
            [orderId]: !expanded[orderId],
        });
    };

    console.log('확장', expanded)

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

    // console.log(
    //     "취소확인",
    //     updateListdata.map((order, index) =>
    //         order.orderDetails.map((detail) => detail.cancel)
    //     )
    // );
    // console.log('화긴', currentItems)
    console.log('화긴', currentItems.map(order => order.orderDetails.map(detailsArray => (
        detailsArray.map(detail => (
            detail.itemName
        ))
    ))))
    return (
        <div className="list-table-root">
            <h2 className="text-2xl font-semibold text-white mb-10 ml-5">
                구매요청 내역
            </h2>
            <div className="flex-col text-white MyOrderList">
                {currentItems.map((order, index) => (
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
                                        <span className="mr-1">
                                            {itemOffset + index + 1}.
                                        </span>{" "}
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
                                className={`transition-transform ${expanded[order.orderId] ? "rotate-180" : ""
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
                            <div className="w-full px-6 pt-0 pb-5 ">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                품목명
                                            </TableCell>
                                            <TableCell align="center">
                                                수량
                                            </TableCell>
                                            <TableCell align="center">
                                                가격
                                            </TableCell>
                                            <TableCell align="center">
                                                공급업체
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.orderDetails.map((detailsArray) => (
                                            detailsArray.map((detail) => (
                                                <TableRow key={detail.orderDetailId}>
                                                    <TableCell align="center">
                                                        {detail.itemName}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {detail.quantity}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {order.state == "complete" ? formatPrice(detail.price, detail.quantity, detail.unit) : '-'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {order.state == "complete" ? detail.username : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-8">
                                    <h1>비고</h1>
                                    <div className="mt-2 p-5 rounded-lg textfieldRead min-h-9">
                                        {order.memo
                                            ? order.memo
                                            : "-"}
                                    </div>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex px-5 justify-between items-center bottomWrap">
                <div className="flex items-center">
                    <div className="flex gap-4">
                        <Select
                            value={itemsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="select-custom"
                        >
                            {[5, 10, 15].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="pagination-container">
                    <Pagination
                        count={Math.ceil(updatedListData.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageClick}
                        variant="outlined"
                        shape="rounded"
                    />
                </div>
            </div>
        </div>
    );
}
