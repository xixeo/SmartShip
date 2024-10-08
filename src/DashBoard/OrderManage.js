import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useAlert } from "../Compo/AlertContext";
import { useLoading } from "../Compo/LoadingContext";
import { useParams } from "react-router-dom";
import * as echarts from "echarts";
import { Typography } from "@mui/material";
import "./OrderManage.scss";
import { Select, MenuItem } from "@mui/material";

export default function OrderTest() {
    const { orderId } = useParams(); // URL에서 orderId 가져오기
    const [oriData, setOriData] = useState([]);
    const [purDetails1, setPurDetails1] = useState([]);
    const [purDetails2, setPurDetails2] = useState([]);
    const [chartdata, setChartdata] = useState([]);
    const [past, setPast] = useState([]);
    const [quantityState, setQuantityState] = useState({});
    const [pastleadopen, setPastleadOpen] = useState(false);
    const [preleadopen, setPreleadOpen] = useState(false);
    const [perchasopen, setPerchasopen] = useState(false);
    const [recoal, setrecoal] = useState(false);
    const [recoal2, setrecoal2] = useState(false);
    const [selrow, setSelrow] = useState([]);
    const [total, setTotal] = useState({});
    const [clickrow, setClickrow] = useState(null);
    const [selectrowOrderid, setSelectrowOrderid] = useState([]);
    const [Currentrow, setCurrentrow] = useState({});
    const [rows, setRows] = useState([]);
    const token = localStorage.getItem("token");
    const { showAlert } = useAlert();
    const { setLoading } = useLoading();

    //  ==================
    // | 발주관리 get api |
    //  ==================

    // useEffect(() => {
    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            // const details = [
            //   {
            //     "orderId": 19,
            //     "username": "유승호",
            //     "alias": "a해운선사",
            //     "releaseDate": "2024-10-01",
            //     "bestOrderDate": "2024-09-15",
            //     "requestDate": "2024-09-20",
            //     "memo": "민주야 잘되니?",
            //     "orderDetails": [
            //       {
            //         "orderDetailId": 36,
            //         "category1Name": "패션의류",
            //         "category2Name": "남성패션",
            //         "category3Name": "팬츠",
            //         "itemsId": 3,
            //         "itemName": "청바지",
            //         "part1": "연청",
            //         "quantity": 5,
            //         "price": 39800.00,
            //         "unit": "KRW",
            //         "username": "민주샵",
            //         "recommendedOrderDate": "2024-09-17",
            //         "ordering": false,
            //         "orderDate": null,
            //         "leadtime": 14,
            //       },
            //       {
            //         "orderDetailId": 37,
            //         "category1Name": "패션의류",
            //         "category2Name": "캐주얼/유니섹스",
            //         "category3Name": "팬츠",
            //         "itemsId": 4,
            //         "itemName": "청바지",
            //         "part1": "중청",
            //         "quantity": 10,
            //         "price": 38800.00,
            //         "unit": "USD",
            //         "username": "쿠팡",
            //         "leadtime": 6,
            //         "recommendedOrderDate": "2024-09-25",
            //         "ordering": false,
            //         "orderDate": null
            //       },
            //       {
            //         "orderDetailId": 11,
            //         "category1Name": "패션의류",
            //         "category2Name": "캐주얼/유니섹스",
            //         "category3Name": "팬츠",
            //         "itemsId": 11,
            //         "itemName": "청바지",
            //         "part1": "중청",
            //         "quantity": 10,
            //         "price": 38800.00,
            //         "unit": "KRW",
            //         "username": "민주샵",
            //         "leadtime": 16,
            //         "recommendedOrderDate": "2024-09-15",
            //         "ordering": false,
            //         "orderDate": null
            //       },
            //     ]
            //   }
            // ];
            const response = await fetch(`/getOrderDetail/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch order details");
            }
            const details = await response.json();
            console.log("od목록", details);
            setOriData(details);
            console.log(
                "odddddddd",
                oriData.map((d) => d.orderDetails).length == 0
            );
            console.log("호라아아아앙아아", Array.isArray(oriData));
            // 서버에서 받은 데이터를 rows 형식에 맞게 변환해서 저장
            const formattedData = (
                Array.isArray(details) ? details : [details]
            ).flatMap((order) =>
                order.orderDetails.map((detail) => ({
                    username: order.username,
                    alias: order.alias,
                    tel: order.phone,
                    releaseDate: order.releaseDate,
                    orderdetailid: detail.orderDetailId,
                    itemid: detail.itemsId,
                    Category1: detail.category1Name,
                    Category2: detail.category2Name,
                    Category3: detail.category3Name,
                    itemName: detail.itemName,
                    part1: detail.part1,
                    quantity: detail.quantity,
                    price: detail.price,
                    unitprice: getCurrencySymbol(detail.unit) + detail.price,
                    amount: formatPrice(
                        detail.price,
                        detail.quantity,
                        detail.unit
                    ),
                    supplier: detail.username,
                    BestOrderDate:
                        detail.recommendedOrderDate + `(${detail.leadtime}일)`,
                    bestOrderDate: detail.recommendedOrderDate,
                    unit: detail.unit,
                    leadtime: detail.leadtime,
                }))
            );
            console.log("formattedData", formattedData);
            setPurDetails2(formattedData);

            const formatted = Array.isArray(details) ? details : [details];

            const groupedData = formatted.reduce((acc, order) => {
                order.orderDetails.forEach((detail) => {
                    const key = `${detail.category1Name}-${detail.category2Name}-${detail.category3Name}-${detail.itemName}-${detail.part1}`;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push({
                        username: order.username,
                        alias: order.alias,
                        tel: order.phone,
                        releaseDate: order.releaseDate,
                        orderdetailid: detail.orderDetailId,
                        itemid: detail.itemsId,
                        Category1: detail.category1Name,
                        Category2: detail.category2Name,
                        Category3: detail.category3Name,
                        itemName: detail.itemName,
                        part1: detail.part1,
                        quantity: detail.quantity,
                        price: detail.price,
                        unitprice:
                            getCurrencySymbol(detail.unit) +
                            detail.price.toLocaleString(),
                        amount: formatPrice(
                            detail.price,
                            detail.quantity,
                            detail.unit
                        ),
                        supplier: detail.username,
                        BestOrderDate:
                            detail.recommendedOrderDate +
                            `(${detail.leadtime}일)`,
                        bestOrderDate: detail.recommendedOrderDate,
                        unit: detail.unit,
                        leadtime: detail.leadtime,
                    });
                });
                return acc;
            }, {});
            const groupedDataArray = Object.keys(groupedData).map((key) => {
                return { key: key, detail: groupedData[key] };
            });
            // console.log('gro', groupedData)
            // console.log('groA', groupedDataArray)
            setPurDetails1(groupedDataArray);
            const initialQuantities = [groupedData].reduce((acc, detail) => {
                acc[detail.itemid] = detail.quantity;
                return acc;
            }, {});
            setQuantityState(initialQuantities);
            showAlert("조회에 성공했습니다.", "success");
        } catch (e) {
            console.error("Error fetching order details:", e);
            showAlert("데이터를 가져오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // console.log('purdetails', purDetails)
    // const test = purDetails.flatMap(order => {
    //   return order.detail.map((item) => item.itemid)
    // });
    // console.log('purdetails flatmap', test)
    // console.log('purdetails[0]', purDetails[0])
    // console.log('purdetails[detail]', purDetails[detail])
    // console.log('purdetails[0].detail', purDetails.length > 0 ? purDetails[0].detail : '데이터 패치전')
    // console.log('purdetails[0].detail.', purDetails.length > 0 ? purDetails[0].detail[0].releaseDate : '데이터 패치전')

    //////////////////////
    //  통화 단위 함수   //
    //////////////////////

    // 통화 기호를 반환하는 헬퍼 함수
    const getCurrencySymbol = (currencyCode) => {
        switch (currencyCode) {
            case "KRW":
                return "₩ ";
            case "USD":
                return "$ ";
            case "JPY":
                return "¥ ";
            case "EUR":
                return "€ ";
            default:
                return "";
        }
    };

    // 총 주문금액 통화기호 반환
    const formatTotal = (totals) => {
        const formattedTotals = [];

        if (totals.KRW) {
            formattedTotals.push(
                `${getCurrencySymbol("KRW")}${totals.KRW.toLocaleString()}`
            );
        }
        if (totals.USD) {
            formattedTotals.push(
                `${getCurrencySymbol("USD")}${totals.USD.toLocaleString()}`
            );
        }
        if (totals.JPY) {
            formattedTotals.push(
                `${getCurrencySymbol("JPY")}${totals.JPY.toLocaleString()}`
            );
        }
        if (totals.EUR) {
            formattedTotals.push(
                `${getCurrencySymbol("EUR")}${totals.EUR.toLocaleString()}`
            );
        }

        return formattedTotals.map((line, index) => (
            <div key={index}>{line}</div>
        ));
    };

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

    // 선택된 행 화폐단위별 총 합계
    const calculateTotal = (selectedRowIds, updatedRows) => {
        const totals = {
            KRW: 0,
            USD: 0,
            JPY: 0,
            EUR: 0,
        };

        // 선택된 행의 amount를 더함
        selectedRowIds.forEach((rowId) => {
            const row = updatedRows.find((r) => r.id === rowId); // updatedRows에서 가져옴
            if (row) {
                // 현재 선택된 공급자의 detail 찾기
                const currentDetail = row.details.find(
                    (detail) => detail.supplier === row.selectedSupplier
                );
                if (currentDetail) {
                    const amount = parseFloat(
                        currentDetail.amount
                            .replace(/[₩$, ¥, €]/g, "")
                            .replace(",", "")
                    ); // 문자열을 숫자로 변환
                    switch (
                        currentDetail.unit // 현재 공급자의 unit 가져오기
                    ) {
                        case "KRW":
                            totals.KRW += amount;
                            break;
                        case "USD":
                            totals.USD += amount;
                            break;
                        case "JPY":
                            totals.JPY += amount;
                            break;
                        case "EUR":
                            totals.EUR += amount;
                            break;
                        default:
                            break;
                    }
                }
            }
        });

        return totals; // 통화별 합계를 반환
    };

    console.log("total", total);

    //////////////////////
    //  리드타임 함수   //
    //////////////////////

    // 선택된 행 중 리드타임 제일 긴 항목 추출
    const getLongestCheckedLeadTime = (selectedIds) => {
        console.log("리드타임 id", selectedIds);
        const selectedDetails = purDetails2.filter((detail) =>
            selectedIds.includes(detail.itemid)
        );
        const checkedLeadTimes = selectedDetails.map(
            (detail) => detail.leadtime
        );

        return Math.max(...checkedLeadTimes) + " 일"; // 가장 긴 leadtime을 반환
    };

    //////////////////////
    //   Table  설정   //
    /////////////////////

    // 열 설정
    const col = [
        { field: "Category1", headerName: "Category 1", flex: 1 },
        { field: "Category2", headerName: "Category 2", flex: 1 },
        { field: "Category3", headerName: "Category 3", flex: 1 },
        { field: "itemName", headerName: "품목명", flex: 1 },
        { field: "part1", headerName: "상세", flex: 1 },
        { field: "unitprice", headerName: "화폐 단위", flex: 1 },
        {
            field: "quantity",
            headerName: "수량",
            width: 50,
            renderCell: (params) => {
                return params.row.details
                    .filter(
                        (detail) =>
                            detail.supplier === params.row.selectedSupplier
                    ) // 현재 선택된 공급자에 맞는 detail만 필터링
                    .map((detail) => (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <input
                                key={detail.itemid}
                                type="number"
                                min={1}
                                value={
                                    quantityState[detail.itemid] ||
                                    detail.quantity
                                }
                                onChange={(e) =>
                                    handleQnt(e, params.row.id, detail.itemid)
                                }
                                className={`bg-[#ffffff00] w-10 ${
                                    isDisabledRow(params.row.BestOrderDate)
                                        ? "text-[#868686]"
                                        : "text-white"
                                }`}
                                disabled={isDisabledRow(
                                    params.row.BestOrderDate
                                )}
                            />
                        </div>
                    ));
            },
        },
        {
            field: "amount",
            headerName: "가격",
            flex: 1,
            renderCell: (params) => {
                // 현재 선택된 공급자에 맞는 detail만 찾아서 amount 표시
                const currentDetail = params.row.details.find(
                    (detail) => detail.supplier === params.row.selectedSupplier
                );
                return currentDetail
                    ? formatPrice(
                          currentDetail.price,
                          currentDetail.quantity,
                          currentDetail.unit
                      )
                    : 0;
            },
        },
        { field: "BestOrderDate", headerName: "최적주문일", flex: 1 },
        {
            field: "suppliers",
            headerName: "공급업체",
            flex: 1,
            renderCell: (params) => {
                const rowKey = params.row.id; // 행의 ID

                return (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <Select
                            className="w-full select-custom2"
                            value={params.row.selectedSupplier}
                            onChange={(e) =>
                                handleSupplierChange(rowKey, e.target.value)
                            }
                        >
                            {params.row.details.map((detail, index) => (
                                <MenuItem key={index} value={detail.supplier}>
                                    {detail.supplier}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                );
            },
        },
        {
            field: "Pastlead",
            headerName: "과거리드타임",
            flex: 1,
            renderCell: (params) => (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Button
                        className="greenbutton"
                        onClick={() => {
                            handlepast(params.row);
                        }}
                    >
                        과거리드타임
                    </Button>
                </div>
            ),
        },
        {
            field: "delete",
            width: 60,
            headerName: "",
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleDelete(params.row.orderdetailid)}
                >
                    <ClearOutlinedIcon />
                </IconButton>
            ),
        },
    ];

    // setRows값이 없을때 purDetails값을 초기값으로 설정
    useEffect(() => {
        const initialRows = purDetails1.map((entry, index) => {
            const firstDetail = entry.detail[0]; // 첫 번째 공급자의 정보를 가져옴
            return {
                id: `row-${index}`, // 고유한 ID
                key: entry.key, // 카테고리 key
                details: entry.detail, // 공급자별 상세 정보를 포함
                selectedSupplier: firstDetail.supplier, // 기본적으로 첫 번째 공급자 선택
                selecteditemid: firstDetail.itemid,
                selectedleadtime: firstDetail.leadtime,
                selectedbestodate: firstDetail.bestOrderDate,
                // 나머지 정보
                ...firstDetail,
            };
        });

        setRows(initialRows); // 상태 초기화
    }, [purDetails1]);

    console.log("rows", rows);

    // 테이블에서 공급자 바뀌면 해당 행에 정보 업데이트
    const handleSupplierChange = (rowKey, selectedSupplier) => {
        setRows((prevRows) =>
            prevRows.map((r) => {
                if (r.id === rowKey) {
                    // 선택된 공급자에 해당하는 detail 찾기
                    const selectedDetail = r.details.find(
                        (detail) => detail.supplier === selectedSupplier
                    );
                    if (selectedDetail) {
                        // selectedDetail이 존재하는 경우
                        return {
                            ...r,
                            selectedSupplier: selectedSupplier,
                            selecteditemid: selectedDetail.itemid,
                            selectedleadtime: selectedDetail.leadtime,
                            selectedbestodate: selectedDetail.bestOrderDate,
                            // 공급자에 맞는 데이터 업데이트
                            price: selectedDetail.price,
                            quantity: selectedDetail.quantity,
                            unitprice: selectedDetail.unitprice,
                            amount: selectedDetail.amount,
                            BestOrderDate: selectedDetail.BestOrderDate,
                            tel: selectedDetail.tel,
                            releaseDate: selectedDetail.releaseDate,
                            leadtime: selectedDetail.leadtime,
                        };
                    }
                }
                return r; // 변경되지 않은 행은 그대로 반환
            })
        );
    };

    //inputbox disable 조건
    const isDisabledRow = (bestOrderDate) => {
        const currentDate = new Date();
        return new Date(bestOrderDate) < currentDate; // 현재 날짜보다 이전이면 비활성화
    };

    // 수량 변경 함수
    const handleQnt = (e, rowId, itemid) => {
        const newQuantity = Number(e.target.value); // 입력된 수량을 숫자로 변환

        setRows((prevRows) => {
            const updatedRows = prevRows.map((row) => {
                if (row.id === rowId) {
                    const updatedDetails = row.details.map((detail) => {
                        // 현재 선택된 공급자에 맞는 detail만 업데이트
                        if (detail.supplier === row.selectedSupplier) {
                            const updatedAmount = formatPrice(
                                detail.price,
                                newQuantity,
                                detail.unit
                            ); // 새 amount 계산
                            return {
                                ...detail,
                                quantity: newQuantity, // quantity 업데이트
                                amount: updatedAmount, // amount 업데이트
                            };
                        }
                        return detail; // 업데이트하지 않은 detail은 그대로 반환
                    });

                    // 총 amount 계산
                    const newAmount = updatedDetails.reduce((total, detail) => {
                        return (
                            total +
                            parseFloat(
                                detail.amount
                                    .replace(/[₩$, ¥, €]/g, "")
                                    .replace(",", "")
                            )
                        ); // 각 detail의 amount 합산
                    }, 0);

                    return {
                        ...row,
                        details: updatedDetails,
                        amount: newAmount, // 업데이트된 amount 설정
                    };
                }
                return row; // 업데이트하지 않은 row는 그대로 반환
            });

            // 체크된 행의 ID를 가져오기
            const selectedRowIds = updatedRows
                .filter((row) => row.selected)
                .map((row) => row.id);
            // 선택된 행의 총합계 계산
            const newTotals = calculateTotal(selectedRowIds, updatedRows); // updatedRows를 인자로 전달
            setTotal(newTotals); // 총합계 업데이트

            return updatedRows; // 업데이트된 rows 반환
        });
    };

    // 행 삭제
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/cancelOrderItem/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("ordering cancel item response was not ok");
            }
            window.location.reload();
            showAlert("삭제에 성공했습니다.", "success");
        } catch (error) {
            console.log(error);
            showAlert("삭제에 실패했습니다.", "error");
        }
    };

    ///////////////////////
    //  선택행 처리 함수  //
    ///////////////////////

    // 체크된 행 배열값 전달
    const handleSelectionChange = (newSelection) => {
        const selectedItemIds = newSelection
            .map((rowId) => {
                // 선택된 rowId를 가진 행을 찾기
                const selectedRow = rows.find((row) => row.id === rowId);
                console.log("sR", selectedRow.details); // 확인용
                if (selectedRow) {
                    // 현재 선택된 공급자에 해당하는 detail 찾기
                    const selectedDetail = selectedRow.details.find(
                        (detail) =>
                            detail.supplier === selectedRow.selectedSupplier
                    );
                    return selectedDetail ? selectedDetail.itemid : null; // 해당 공급자의 itemid 반환
                }
                return null; // rowId에 해당하는 행이 없으면 null 반환
            })
            .filter(Boolean); // null 제거하여 유효한 itemid만 반환

        console.log("체크박스로우", newSelection); // 확인용
        console.log("체크박스", selectedItemIds); // 확인용
        // rows의 선택 상태 업데이트
        setRows((prevRows) => {
            return prevRows.map((row) => ({
                ...row,
                selected: newSelection.includes(row.id), // 선택된 행인지 확인
            }));
        });
        setSelrow(selectedItemIds);
        getDetaildata(newSelection, selectedItemIds);
        const newTotals = calculateTotal(newSelection, rows);
        setTotal(newTotals);
    };

    // 체크된 행 데이터 처리 및 정보 추출
    const getDetaildata = (rowid, selectedIds) => {
        // console.log('ri',rowid)
        const senddata = rows
            .filter((row) => rowid.includes(row.id)) // rowid가 포함된 행 필터링
            .map((detail) => detail.details) // 각 행의 details 가져오기
            .flatMap((detailsArray) =>
                detailsArray.map((dt) => ({
                    itemsId: dt.itemid,
                    orderDetailId: dt.orderdetailid,
                    quantity: dt.quantity,
                }))
            )
            .filter((i) => selectedIds.includes(i.itemsId));
        // console.log('발주할 데이터',senddata)
        setSelectrowforordering(senddata);
    };

    // 선택 행 값 전달
    const handleRowclick = (params, event) => {
        const currentRow = rows.find((row) => row.id === params.id);
        setCurrentrow(currentRow);
        // console.log('currentRow:', currentRow);
        if (currentRow) {
            // 현재 선택된 공급자의 정보를 가져옴
            const selectedDetail = currentRow.details.find(
                (detail) => detail.supplier === currentRow.selectedSupplier
            );
            // console.log('Selected Row Data:', selectedDetail);

            // 선택 행 값 전달
            setClickrow(selectedDetail);
            getOrderDetaildata(selectedDetail, event);
            const id = selectedDetail.itemid;
            console.log("클릭한 id", id);
            console.log("클릭한 event", event);
            fetchRecommenditems(id, event);
        }
    };

    // 선택 행 정보 추출 함수
    const getOrderDetaildata = (clickrow, event) => {
        event.preventDefault();
        // console.log('clickrow', clickrow)

        if (event.target.closest('input[type="checkbox"]') === null) {
            const itemname = clickrow.itemName;
            const orderdetailid = clickrow.orderdetailid;
            // const itemid = clickrow.itemid;
            // console.log('행선택itemname', itemname)
            // console.log('행선택orderdetailid', orderdetailid)
            setSelectrowitemname(itemname);
            setSelectrowOrderid(orderdetailid);
        }
    };

    ///////////////////////
    //   chart button    //
    ///////////////////////
    const handlepast = async (e) => {
        console.log("버튼행 값", e); // 현재 선택된 공급자것만 보여줄거면 이걸로
        console.log("버튼행 값의 itemid", e.selecteditemid); // 현재 선택된 공급자것만 보여줄거면 이걸로
        //  console.log('버튼행 값',e.map(i=>i.itemid)) 만약 한번에 업체별 다 보여줄거면 이걸로
        // const selid = 26041;
        const selid = e.selecteditemid;
        //  ==============
        // | 과거리드 api |
        //  ==============
        setLoading(true);
        try {
            const response = await fetch(`/pasttime/${selid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("pastleadtime was not ok");
            }
            const data = await response.json();
            console.log("과거리드타임 정보", data);
            const pastdata = data.map((i) => ({
                ptime: i.pastleadtime,
                odate: i.orderdate,
                item: e.itemName,
            }));
            setPast(pastdata);
            showAlert("조회에 성공했습니다.", "success");
        } catch (error) {
            console.error("Faild to fetch pastleadtime :", error);
            showAlert("데이터를 가져오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
        setPastleadOpen(true);
    };

    //  ===============
    // | 발주 하기 api |
    //  ===============
    const handlePerchase = () => {
        const fetchOrdering = async () => {
            const preordering = selectrowforordering;
            console.log("peeeeeee", preordering);
            try {
                const response = await fetch(`/orderUpdate`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(preordering),
                });
                if (!response.ok) {
                    throw new Error("Ordering response was not ok");
                }
                showAlert("발주에 성공했습니다.", "success");
            } catch (e) {
                console.error("Failed to fetch Ordering: ", e);
                showAlert("발주에 실패했습니다.", "error");
            }
        };
        fetchOrdering();
        window.location.reload();
    };

    const handleclo = () => {
        setrecoal(false);
        setrecoal2(false);
    };

    //  ================
    // | 물품 바꾸기 api |
    //  ================
    const handleRecommend = (reco) => {
        // 선택한 물품이 공급업체를 바꾸기만 하면되면 모달
        if (Currentrow.details.map((detail) => detail.itemid).includes(reco)) {
            showAlert("공급자를 바꿔주세요.", "info");
        }
        // 선택한 물품이 이미 장바구니에 있을 때 모달
        if (rows.map((detail) => detail.itemid).includes(reco)) {
            showAlert("이미 장바구니에 있는 물품입니다.", "info");
        }
        const fetchChangeitem = async () => {
            try {
                const response = await fetch(
                    `/updateItem?orderDetailId=${selectrowOrderid}&newItemId=${reco}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Changeitem response was not ok");
                }
                // 선택한 행을 해제
                setClickrow(null);
                window.location.reload();
                showAlert("물품 대체에 성공했습니다.", "success");
            } catch (e) {
                console.error("Failed to fetch Changeitem :", e);
                showAlert("물품 대체에 실패했습니다.", "error");
            }
        };
        fetchChangeitem();
    };

    // ======================
    // || 대체 추천 상품 시작 ||
    //  ======================

    const [disablerowcount, setDisablerowcount] = useState(0);
    const [selectrowitemname, setSelectrowitemname] = useState();
    const [recommendItem, setRecommendItem] = useState([]);
    const [selectrowforordering, setSelectrowforordering] = useState([]);
    const [selectrowqnt, setSelectrowqnt] = useState([]);

    // 비활성화된 행 갯수
    const countdisablerow = (rows) => {
        // console.log('비활성화 row', rows)
        const currentDate = new Date();
        const count = rows.filter((row) => {
            const bestOrderDate = new Date(row.BestOrderDate);
            return bestOrderDate < currentDate;
        }).length;
        setDisablerowcount(count);
    };

    // console.log('dis', disablerowcount)

    // 비활성화 행 감시
    useEffect(() => {
        countdisablerow(rows);
    }, [rows.length > 0 ? rows : ""]);

    // 전화번호 - 표시
    const formatPhoneNumber = (phoneNumber) => {
        return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    };

    //  ==================
    // | 추천 아이템 api |
    // =================

    // 행선택 시 itemid 추출 후 추천아이템 가져오기
    const fetchRecommenditems = async (id, event) => {
        event.preventDefault();
        // console.log('clickrow', clickrow)
        const orderdate = purDetails2[0].releaseDate;

        // setLoading(true)
        setRecommendItem([]);
        try {
            //   const recoitems = [
            //     {
            //     'itemsId': 2,
            //     'itemName': '청바지',
            //     'price': 40100.00,
            //     'unit': 'KRW',
            //     'supplierName': '수플린',
            //     'leadtime': 20,
            //     'recommendedOrderDate': '2024-10-10'
            //   },
            //     {
            //     'itemsId': 3,
            //     'itemName': '면바지',
            //     'price': 40100.00,
            //     'unit': 'KRW',
            //     'supplierName': '수플린',
            //     'leadtime': 20,
            //     'recommendedOrderDate': '2024-10-10'
            //   },
            //     {
            //     'itemsId': 4,
            //     'itemName': '바지',
            //     'price': 40100.00,
            //     'unit': 'USD',
            //     'supplierName': '수플린',
            //     'leadtime': 20,
            //     'recommendedOrderDate': '2024-10-10'
            //   },
            //     {
            //     'itemsId': 5,
            //     'itemName': '아몰라',
            //     'price': 40100.00,
            //     'unit': 'JPY',
            //     'supplierName': '수플린',
            //     'leadtime': 20,
            //     'recommendedOrderDate': '2024-10-10'
            //   },
            // ];
            const response = await fetch(
                `/recommend?selectedItemId=${id}&releaseDate=${orderdate}&orderId=${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Recommend item response was not ok");
            }
            const recoitems = await response.json();
            // console.log('reco', recoitems);
            setRecommendItem(recoitems);
            // console.log('최종',recommenditem)
            showAlert("대체 물품 조회에 성공했습니다.", "success");
        } catch (error) {
            console.error("Failed to fetch recommend:", error);
            showAlert("대체 물품 조회에 실패했습니다.", "error");
        } finally {
            // setLoading(false);
        }
    };

    // console.log('추천data', recommendItem)

    //////////////////////
    //  차트 데이터 처리  //
    //////////////////////

    // console.log('차트줄거야', rows.map(i=>({ date: i.selectedbestodate, leadtime: i.selectedleadtime, item: i.itemName})))
    useEffect(() => {
        // rows로부터 Cdata 생성
        const currentDate = new Date();

        const Cdata = rows
            .filter((i) => new Date(i.selectedbestodate) > currentDate) // 현재 날짜보다 미래인 경우만 필터링
            .map((i) => ({
                date: i.selectedbestodate,
                leadtime: i.selectedleadtime,
                item: i.itemName,
            }));

        setChartdata(Cdata); // Cdata를 설정
    }, [rows]);

    console.log("차트넣을거야", chartdata);
    console.log(
        "차트넣을아이템",
        chartdata.map((i) => i.item)
    );

    const items = chartdata.map((i) => i.item);

    // 날짜별로 데이터를 처리하는 함수
    const processData = (chartdata, items) => {
        const result = {};
        const currentDate = new Date();

        // 날짜별로 데이터를 그룹화
        chartdata.forEach((entry) => {
            const { date, leadtime, item } = entry;

            const bestOrderDate = new Date(date);

            // 해당 날짜가 현재 날짜보다 미래인 경우에만 빈 배열 생성
            // 해당 날짜에 대한 배열이 없으면 초기화
            if (!result[date]) {
                result[date] = Array(items.length).fill(0);
            }

            // item에 맞는 인덱스 찾기
            const itemIndex = items.indexOf(item);

            // item에 맞는 위치에 leadtime 값을 넣음
            if (itemIndex !== -1) {
                result[date][itemIndex] = leadtime;
            }
        });

        // 날짜를 역순으로 정렬
        const sortedDates = Object.keys(result).sort(
            (a, b) => new Date(b) - new Date(a)
        );

        // 날짜별로 값을 이전 값으로 채움
        for (let i = 1; i < sortedDates.length; i++) {
            const currentDate = sortedDates[i];
            const previousDate = sortedDates[i - 1];

            // 현재 날짜 배열에서 0인 부분을 이전 날짜 값으로 채움
            result[currentDate] = result[currentDate].map((value, index) =>
                value === 0 && result[previousDate][index] !== 0
                    ? result[previousDate][index]
                    : value
            );
        }

        return result;
    };

    // 결과
    const barData = processData(chartdata, items);
    console.log("차트데이터 전처리 완", barData);
    console.log(
        "차트데이터 전처리 키",
        Object.keys(barData).sort((a, b) => new Date(b) - new Date(a))
    );

    // 파란색과 보라색 계열의 랜덤 색상 생성
    const getRandomBluePurpleColor = () => {
        const hue = Math.floor(Math.random() * 40) + 240; // Hue 범위: 240 ~ 280 (파란색~보라색)
        const saturation = Math.floor(Math.random() * 50) + 50; // 채도: 50% ~ 100%
        const lightness = Math.floor(Math.random() * 30) + 40; // 명도: 40% ~ 70%

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    //고유색상 배열 생성
    const getUniqueRandomColors = (count) => {
        const colors = [];
        while (colors.length < count) {
            const color = getRandomBluePurpleColor(colors);
            colors.push(color);
        }
        return colors;
    };

    // 전체품목 리드타임 차트
    const initchart = () => {
        const chartDom = document.getElementById("main-chart");
        if (chartDom) {
            const myChart = echarts.init(chartDom);

            // 아이템별 랜덤 색상 생성
            const itemColors = getUniqueRandomColors(items.length);
            console.log("색확인", itemColors);

            const sortedDates = Object.keys(barData).sort(
                (a, b) => new Date(a) - new Date(b)
            );
            const newOption = {
                baseOption: {
                    timeline: {
                        axisType: "category",
                        autoPlay: true,
                        playInterval: 1000,
                        data: sortedDates,
                        label: {
                            normal: {
                                margin: 15,
                            },
                        },
                    },
                    title: {}, // 제목 설정 (필요 시 추가)
                    tooltip: {
                        trigger: "item",
                        formatter: (params) => {
                            return `${params.name}: ${params.value}`; // X축 항목과 값을 툴팁으로 보여줌
                        },
                    },
                    legend: {
                        left: "right",
                        data: items,
                        textStyle: { color: "#FFFFFF" }, // 범례 텍스트 색상
                        itemStyle: { color: "#FFFFFF" }, // 범례 아이템 색상
                    },
                    grid: {
                        top: "50px", // 타임라인과 차트 사이의 거리 설정
                        bottom: "100px", // 필요에 따라 하단 간격 조정
                        left: "10%", // 왼쪽 여백
                        right: "10%", // 오른쪽 여백
                    },
                    xAxis: [
                        {
                            type: "category",
                            data: items,
                            splitLine: { show: false },
                            axisLabel: {
                                interval: 0, // 모든 항목을 표시
                                rotate: 30,
                                textStyle: { color: "#FFFFFF" }, // 글자 색상
                            },
                        },
                    ],
                    yAxis: [
                        {
                            type: "value",
                            name: "Lead Time (days)",
                            axisLabel: {
                                textStyle: { color: "#FFFFFF" }, // Y축 레이블 색상
                            },
                            splitLine: {
                                lineStyle: { color: "#CCCCCC" }, // Y축 분할선 색상
                            },
                        },
                    ],
                    series: [
                        {
                            name: "Lead Time",
                            type: "bar",
                            barWidth: 30,
                            data: [], // 데이터는 나중에 설정
                        },
                    ],
                },
                options: sortedDates.map((date) => {
                    const dataForDate = barData[date].map((value, index) => ({
                        value,
                        itemStyle: { color: itemColors[index] }, // 아이템별 색상 설정
                    }));
                    return {
                        title: {
                            text: `${date} 발주 가능한 선용품`,
                            left: "center",
                            textStyle: { color: "#FFFFFF" }, // 각 날짜 제목 색상
                        },
                        series: [{ data: dataForDate }],
                    };
                }),
            };

            myChart.setOption(newOption);

            const resizeHandler = () => myChart.resize();
            window.addEventListener("resize", resizeHandler);

            return () => {
                myChart.dispose();
                window.removeEventListener("resize", resizeHandler);
            };
        }
    };

    // const past = [
    //   {
    //     ptime: 20,
    //     odate: '2023-01-19',
    //     item: '원피스',
    //   },
    //   {
    //     ptime: 21,
    //     odate: '2023-05-19',
    //     item: '원피스',
    //   },
    //   {
    //     ptime: 15,
    //     odate: '2024-01-19',
    //     item: '원피스',
    //   },
    // ]
    console.log("과거차트 넣을거임", past);
    const days = past.map((i) => i.odate);

    // 날짜별로 데이터를 처리하는 함수
    const processdata = (past, days) => {
        const result = {};

        // 날짜별로 데이터를 그룹화
        past.forEach((entry) => {
            const { odate, ptime, item } = entry;

            // 해당 아이템에 대한 배열이 없으면 초기화
            if (!result[item]) {
                result[item] = new Array(days.length).fill(null); // days 길이만큼 null로 채움
            }

            // date에 맞는 인덱스 찾기
            const odateIndex = days.indexOf(odate);

            // date에 맞는 위치에 leadtime 값을 넣음
            if (odateIndex !== -1) {
                result[item][odateIndex] = ptime;
            }
        });
        return result;
    };

    const linedata = processdata(past, days);

    console.log("라인차트 넣을거임", linedata);

    const shuffle = linedata; // 품목명 : [리드타임] > 아이템 하나 오는걸 상정해서 만들어놓음

    // 과거리드타임 차트
    const initPastChart = () => {
        const chartDom2 = document.getElementById("past-chart");
        if (chartDom2) {
            const myChart = echarts.init(chartDom2);

            const seriesList = Object.keys(shuffle).map((name) => ({
                name,
                symbolSize: 20,
                type: "line",
                smooth: true,
                emphasis: { focus: "series" },
                endLabel: { show: true, formatter: "{a}", distance: 20 },
                lineStyle: { width: 4 },
                data: shuffle[name], // 연도별 값, null 포함
            }));

            const newoption = {
                title: {
                    text: `${Object.keys(shuffle)}'s PAST LEAD TIME`,
                    left: "center",
                    textStyle: { color: "#FFFFFF" },
                },
                tooltip: { trigger: "item" },
                grid: { left: 30, right: 110, bottom: 30, containLabel: true },
                xAxis: {
                    type: "category",
                    data: days,
                    name: "Order date",
                    splitLine: { show: true },
                    axisLabel: { fontSize: 16 },
                },
                yAxis: {
                    type: "value",
                    name: "Past lead time",
                    axisLabel: { formatter: "{value}", fontSize: 16 },
                },
                series: seriesList,
            };

            myChart.setOption(newoption);

            const resizeHandler = () => myChart.resize();
            window.addEventListener("resize", resizeHandler);

            return () => {
                myChart.dispose();
                window.removeEventListener("resize", resizeHandler);
            };
        }
    };

    useEffect(() => {
        if (preleadopen) {
            setTimeout(() => {
                initchart();
            }, 0);
        }
    }, [barData, items, preleadopen]);

    useEffect(() => {
        if (pastleadopen) {
            setTimeout(() => {
                initPastChart(); // 과거 리드타임 차트 초기화
            }, 0);
        }
    }, [pastleadopen]);

    return (
        <div>
            <div className="flex-col text-white OrderManage">
                <div className="flex m-2 items-center">
                    <h4 className="font-bold text-xl m-2">창고 출고 예정일 </h4>
                    <div className="text-2xl font-bold">
                        {purDetails2.length > 0
                            ? purDetails2[0].releaseDate
                            : " "}
                    </div>
                </div>
                <div className="card-bg m-5 pt-6 pb-8 px-6 rounded-lg">
                    {(Array.isArray(oriData) ? oriData : [oriData]).every(
                        (d) => d.orderDetails.length === 0
                    ) ? (
                        <div className="flex justify-center text-2xl font-semibold">
                            모든 물품을 발주 하였습니다.
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h1 className="font-bold text-xl">
                                        요청 물품 목록
                                    </h1>
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        className="blue-btn text-sm"
                                        onClick={() => setPreleadOpen(true)}
                                    >
                                        차트보기
                                    </button>
                                    <Modal
                                        open={preleadopen}
                                        onClose={() => setPreleadOpen(false)}
                                    >
                                        <Box
                                            className="modalContent"
                                            sx={{
                                                color: "black",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform:
                                                    "translate(-50%, -50%)",
                                                width: "1000px",
                                                height: "500px",
                                                bgcolor: "#17161D",
                                                p: 3,
                                                borderRadius: 2,
                                                boxShadow: 24,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    marginBottom: 2,
                                                    fontSize: "large",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    width: "1000px",
                                                }}
                                            >
                                                <div
                                                    id="main-chart"
                                                    style={{
                                                        width: "100%",
                                                        height: "400px",
                                                    }}
                                                ></div>
                                            </Box>
                                        </Box>
                                    </Modal>
                                </div>
                            </div>

                            <div className="p-0">
                                <DataGrid
                                    columns={col}
                                    rows={rows}
                                    getRowId={(row) => row.id}
                                    pageSizeOptions={[10, 25, 50, 100]}
                                    checkboxSelection
                                    autoHeight
                                    onRowSelectionModelChange={
                                        handleSelectionChange
                                    }
                                    onRowClick={handleRowclick}
                                    disableRowSelectionOnClick
                                    getCellClassName={(params) => "custom-cell"}
                                    getColumnClassName={(params) =>
                                        "custom-header"
                                    }
                                    isRowSelectable={(purDetails) => {
                                        const bestOrderDate = new Date(
                                            purDetails.row.BestOrderDate
                                        );
                                        const currentDate = new Date();
                                        return bestOrderDate >= currentDate;
                                    }}
                                    getRowClassName={(purDetails) => {
                                        const bestOrderDate = new Date(
                                            purDetails.row.BestOrderDate
                                        );
                                        const currentDate = new Date();
                                        return bestOrderDate < currentDate
                                            ? "overdate"
                                            : "";
                                    }}
                                    slotProps={{
                                        pagination: { labelRowsPerPage: "" },
                                    }}
                                    sx={{
                                        color: "white",
                                        fontWeight: "semi-bold",
                                        border: "none",
                                        alignItems: "center",
                                        width: "100%",
                                        "--DataGrid-containerBackground":
                                            "#ffffff00",
                                        "--DataGrid-rowBorderColor":
                                            "#ffffff2c;",
                                        "& .MuiCheckbox-root.Mui-disabled": {
                                            color: "#868686",
                                            "& svg": { fill: "#868686" },
                                        },
                                        "& .MuiTablePagination-root, .MuiIconButton-root.Mui-disabled":
                                            {
                                                color: "white",
                                            },
                                        "& .MuiDataGrid-virtualScrollerRenderZone":
                                            {
                                                backgroundColor: "#ffffff00",
                                            },
                                        "& .MuiDataGrid-filler": {
                                            display: "none",
                                        },
                                        "& .css-20bmp1-MuiSvgIcon-root": {
                                            fill: "white",
                                        },
                                        "& .MuiDataGrid-withBorderColor": {
                                            borderColor: "#ffffff2c",
                                        },
                                    }}
                                />
                            </div>

                            <div className="">
                                <h2 className="text-[#FFCC6F] font-semibold text-xl">
                                    예상 리드타임 :{" "}
                                    {selrow.length > 0
                                        ? getLongestCheckedLeadTime(selrow)
                                        : "-"}
                                </h2>
                                <div className="flex justify-between items-center text-xl">
                                    <div className="flex">
                                        <h2 className="font-semibold">
                                            총 주문금액:{" "}
                                        </h2>
                                        <div className="ml-2">
                                            {formatTotal(total)}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            className="blue-btn2 text-sm"
                                            onClick={() => setPerchasopen(true)}
                                        >
                                            발주
                                        </button>
                                        <Modal
                                            open={perchasopen}
                                            onClose={() =>
                                                setPerchasopen(false)
                                            }
                                        >
                                            <Box
                                                className="modalContent"
                                                sx={{
                                                    color: "black",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform:
                                                        "translate(-50%, -50%)",
                                                    width: "400px",
                                                    height: "200px",
                                                    bgcolor: "#17161D",
                                                    p: 3,
                                                    borderRadius: 2,
                                                    boxShadow: 24,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        marginBottom: 2,
                                                        fontSize: "large",
                                                        fontWeight: "bold",
                                                        color: "white",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    발주하시겠습니까?
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <button
                                                        className="blue-btn"
                                                        onClick={() =>
                                                            setPerchasopen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        취소
                                                    </button>
                                                    <button
                                                        className="blue-btn2"
                                                        onClick={() => {
                                                            setPerchasopen(
                                                                false
                                                            );
                                                            handlePerchase();
                                                        }}
                                                    >
                                                        확인
                                                    </button>
                                                </Box>
                                            </Box>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {/* 추천상품 시작 */}
                {disablerowcount > 0 ? (
                    <div>
                        <div className="flex items-center justify-center text-xl my-12">
                            <h2 className="font-bold">
                                창고 출고 예정일까지 수령 불가능한 상품이
                                있습니다.
                            </h2>
                            <h2 className="ml-2 text-[#5BF4FF]">
                                ({disablerowcount}건)
                            </h2>
                        </div>

                        <div className="bg-[#00000030] m-5 px-5 py-8 rounded-lg">
                            <div className="flex items-center ml-3">
                                <h4 className="text-[#5BF4FF] text-xl font-bold">
                                    {selectrowitemname || " "}
                                </h4>
                                {selectrowitemname ? (
                                    <h4 className="text-base ml-2">
                                        대체 추천 상품
                                    </h4>
                                ) : (
                                    " "
                                )}
                            </div>
                            <div className="flex items-center justify-start">
                                {clickrow && recommendItem.length === 0 ? (
                                    <div className="w-full">
                                        <div className="flex items-end">
                                            <h1 className="mt-5 ml-3 text-rose-500 font-bold text-2xl">
                                                {" "}
                                                대체 가능한 상품이 없습니다.
                                            </h1>
                                        </div>
                                        <h1 className="mt-4 ml-3 text-lg text-[#ffffff70]">
                                            구매자 :{" "}
                                            {purDetails2[0].username +
                                                ` (${purDetails2[0].alias})`}{" "}
                                            {formatPhoneNumber(
                                                purDetails2[0].tel
                                            )}
                                        </h1>
                                    </div>
                                ) : (
                                    recommendItem.map((detail) => (
                                        <div
                                            key={detail.itemsId}
                                            className="bg-[#373640] border-[#373640] rounded-lg w-1/4 m-3 p-3"
                                            onClick={() =>
                                                handleRecommend(detail.itemsId)
                                            }
                                        >
                                            <div className="text-xl font-bold m-2">
                                                {detail.itemName}
                                            </div>
                                            <div className="flex justify-between items-center m-2">
                                                <div className="text-lg font-bold">
                                                    {detail.supplierName}
                                                </div>
                                                <div className="text-base font-bold">
                                                    {getCurrencySymbol(
                                                        detail.unit
                                                    )}{" "}
                                                    {detail.price}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center m-2">
                                                <div className="text-base font-bold">
                                                    {
                                                        detail.recommendedOrderDate
                                                    }
                                                </div>
                                                <div className="text-[#bebebe] text-sm">
                                                    (예상 리드타임 :{" "}
                                                    {detail.leadtime}일)
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            <Modal open={recoal} onClose={handleclo}>
                <Box
                    className="modalContent"
                    sx={{
                        color: "black",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute", // 또는 'fixed'로 설정
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", // 중앙 정렬
                        width: "400px", // 원하는 너비로 설정
                        height: "200px", // 원하는 높이로 설정
                        bgcolor: "#17161D", // 배경색 설정 (선택 사항)
                        p: 3, // 패딩 설정 (선택 사항)
                        borderRadius: 2, // 모서리 둥글기 (선택 사항)
                        boxShadow: 24, // 그림자 (선택 사항)
                    }}
                >
                    <div>
                        <h1 className="text-white text-2xl font-bold">
                            {" "}
                            supplier를 바꾸세요
                        </h1>
                    </div>
                </Box>
            </Modal>
            <Modal open={recoal2} onClose={handleclo}>
                <Box
                    className="modalContent"
                    sx={{
                        color: "black",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute", // 또는 'fixed'로 설정
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", // 중앙 정렬
                        width: "400px", // 원하는 너비로 설정
                        height: "200px", // 원하는 높이로 설정
                        bgcolor: "#17161D", // 배경색 설정 (선택 사항)
                        p: 3, // 패딩 설정 (선택 사항)
                        borderRadius: 2, // 모서리 둥글기 (선택 사항)
                        boxShadow: 24, // 그림자 (선택 사항)
                    }}
                >
                    <div>
                        <h1 className="text-white text-2xl font-bold">
                            {" "}
                            장바구니에 있는 상품입니다.
                        </h1>
                    </div>
                </Box>
            </Modal>
            <Modal open={pastleadopen} onClose={() => setPastleadOpen(false)}>
                <Box
                    className="modalContent"
                    sx={{
                        color: "black",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute", // 또는 'fixed'로 설정
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", // 중앙 정렬
                        width: "1000px", // 원하는 너비로 설정
                        height: "500px", // 원하는 높이로 설정
                        bgcolor: "#17161D", // 배경색 설정 (선택 사항)
                        p: 3, // 패딩 설정 (선택 사항)
                        borderRadius: 2, // 모서리 둥글기 (선택 사항)
                        boxShadow: 24, // 그림자 (선택 사항)
                    }}
                >
                    {Object.keys(linedata).length > 0 ? (
                        <div
                            id="past-chart"
                            style={{ width: "100%", height: "400px" }}
                        ></div>
                    ) : (
                        <Typography variant="h6" sx={{ color: "white" }}>
                            과거 리드타임이 없습니다.
                        </Typography>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
