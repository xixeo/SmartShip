import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'
import Loading from '../Compo/Loading';
import { json, useParams } from 'react-router-dom';
import './OrderManage.scss';

export default function OrderTest() {
  const { orderId } = useParams(); // URL에서 orderId 가져오기
  const [oriData, setOriData] = useState([]);
  const [purDetails, setPurDetails] = useState([]);
  const [purDetails2, setPurDetails2] = useState([]);
  const [quantityState, setQuantityState] = useState({});
  const [pastleadopen, setPastleadOpen] = useState(false);
  const [preleadopen, setPreleadOpen] = useState(false);
  const [perchasopen, setPerchasopen] = useState(false);
  const [recoal, setrecoal] = useState(false);
  const [recoal2, setrecoal2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selrow, setSelrow] = useState([]);
  const [totalAmounts, setTotalAmounts] = useState({});
  const [total, setTotal] = useState({});
  const [clickrow, setClickrow] = useState(null);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState({});
  const [selectrowOrderid, setSelectrowOrderid] = useState([]);
  const [selectrowitemid, setSelectrowitemid] = useState({});
  const [Currentrow, setCurrentrow] = useState({});
  const [rows, setRows] = useState([]);
  const token = localStorage.getItem('token');
  // console.log('id', orderId);
  const [eey, setEey] = useState([])
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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const details = await response.json();
      console.log('od목록', details)
      setOriData(details)
      console.log('odddddddd', oriData.map(d => d.orderDetails).length == 0)
      console.log('호라아아아앙아아', Array.isArray(oriData))
      // 서버에서 받은 데이터를 rows 형식에 맞게 변환해서 저장
      const formattedData = (Array.isArray(details) ? details : [details]).flatMap((order) =>
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
          amount: formatPrice(detail.price, detail.quantity, detail.unit),
          supplier: detail.username,
          BestOrderDate: detail.recommendedOrderDate + `(${detail.leadtime}일)`,
          unit: detail.unit,
          leadtime: detail.leadtime,
        }))
      );
      // console.log('formattedData', formattedData)
      setPurDetails2(formattedData);
      const formatted = Array.isArray(details) ? details : [details];

      const groupedData = formatted.reduce((acc, order) => {
        order.orderDetails.forEach(detail => {
          const key = `${detail.category1Name}-${detail.category2Name}-${detail.category3Name}-${detail.itemName}-${detail.part1}`;
          setEey(key)
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
            unitprice: getCurrencySymbol(detail.unit) + detail.price.toLocaleString(),
            amount: formatPrice(detail.price, detail.quantity, detail.unit),
            supplier: detail.username,
            BestOrderDate: detail.recommendedOrderDate + `(${detail.leadtime}일)`,
            unit: detail.unit,
            leadtime: detail.leadtime,
          });
        });
        return acc;
      }, {});
      const groupedDataArray = Object.keys(groupedData).map(key => { return { key: key, detail: groupedData[key] } });
      // console.log('gro', groupedData)
      // console.log('groA', groupedDataArray)
      setPurDetails(groupedDataArray);
      const initialQuantities = [groupedData].reduce((acc, detail) => {
        acc[detail.itemid] = detail.quantity;
        return acc;
      }, {});
      setQuantityState(initialQuantities);
    } catch (e) {
      console.error('Error fetching order details:', e);
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
      case 'KRW': return '₩ ';
      case 'USD': return '$ ';
      case 'JPY': return '¥ ';
      case 'EUR': return '€ ';
      default: return '';
    }
  };

  // 총 주문금액 통화기호 반환
  const formatTotal = (totals) => {
    const formattedTotals = [];

    if (totals.KRW) {
      formattedTotals.push(`${getCurrencySymbol('KRW')}${totals.KRW.toLocaleString()}`);
    }
    if (totals.USD) {
      formattedTotals.push(`${getCurrencySymbol('USD')}${totals.USD.toLocaleString()}`);
    }
    if (totals.JPY) {
      formattedTotals.push(`${getCurrencySymbol('JPY')}${totals.JPY.toLocaleString()}`);
    }
    if (totals.EUR) {
      formattedTotals.push(`${getCurrencySymbol('EUR')}${totals.EUR.toLocaleString()}`);
    }

    return formattedTotals.map((line, index) => (
      <div key={index}>{line}</div>
    ));
  };

  // 수량에 맞춰 가격 계산 + 단위 붙이기
  const formatPrice = (price, quantity, unit) => {
    const totalPrice = price * quantity;
    switch (unit) {
      case 'KRW': return `₩ ${totalPrice.toLocaleString()}`;
      case 'USD': return `$ ${totalPrice.toLocaleString()}`;
      case 'JPY': return `¥ ${totalPrice.toLocaleString()}`;
      case 'EUR': return `€ ${totalPrice.toLocaleString()}`;
      default: return totalPrice.toLocaleString();
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
    selectedRowIds.forEach(rowId => {
      const row = updatedRows.find(r => r.id === rowId); // updatedRows에서 가져옴
      if (row) {
        // 현재 선택된 공급자의 detail 찾기
        const currentDetail = row.details.find(detail => detail.supplier === row.selectedSupplier);
        if (currentDetail) {
          const amount = parseFloat(currentDetail.amount.replace(/[₩$, ¥, €]/g, '').replace(',', '')); // 문자열을 숫자로 변환
          switch (currentDetail.unit) { // 현재 공급자의 unit 가져오기
            case 'KRW':
              totals.KRW += amount;
              break;
            case 'USD':
              totals.USD += amount;
              break;
            case 'JPY':
              totals.JPY += amount;
              break;
            case 'EUR':
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


  console.log('total', total)

  //////////////////////
  //  리드타임 함수   //
  //////////////////////

  // 선택된 행 중 리드타임 제일 긴 항목 추출
  const getLongestCheckedLeadTime = (selectedIds) => {
    console.log('리드타임 id', selectedIds)
    const selectedDetails = purDetails2.filter(detail => selectedIds.includes(detail.itemid));
    const checkedLeadTimes = selectedDetails.map((detail) => detail.leadtime)

    return Math.max(...checkedLeadTimes) + ' 일'; // 가장 긴 leadtime을 반환
  };

  //////////////////////
  //   Table  설정   //
  /////////////////////

  // 열 설정
  const col = [
    { field: 'Category1', headerName: 'Category 1', width: 130 },
    { field: 'Category2', headerName: 'Category 2', width: 130 },
    { field: 'Category3', headerName: 'Category 3', width: 130 },
    { field: 'itemName', headerName: 'Item Name', width: 130 },
    { field: 'part1', headerName: 'Part 1', width: 130 },
    { field: 'unitprice', headerName: 'Unit Price', width: 90 },
    {
      field: 'quantity', headerName: 'Quantity', width: 80, renderCell: (params) => {
        return params.row.details
          .filter(detail => detail.supplier === params.row.selectedSupplier) // 현재 선택된 공급자에 맞는 detail만 필터링
          .map((detail) => (
            <div onClick={(e) => { e.stopPropagation() }}>
              <input
                key={detail.itemid}
                type='number'
                min={1}
                value={quantityState[detail.itemid] || detail.quantity}
                onChange={(e) => handleQnt(e, params.row.id, detail.itemid)}
                className={`bg-[#67666E] w-10 ${isDisabledRow(params.row.BestOrderDate) ? 'text-[#868686]' : 'text-white'}`}
                disabled={isDisabledRow(params.row.BestOrderDate)}
              />
            </div>
          ));
      }
    },
    {
      field: 'amount', headerName: 'Amount', width: 130, renderCell: (params) => {
        // 현재 선택된 공급자에 맞는 detail만 찾아서 amount 표시
        const currentDetail = params.row.details.find(detail => detail.supplier === params.row.selectedSupplier);
        return currentDetail ? formatPrice(currentDetail.price, currentDetail.quantity, currentDetail.unit) : 0;
      }
    },
    { field: 'BestOrderDate', headerName: 'Best Order Date', width: 130 },
    {
      field: 'suppliers', headerName: 'Supplier', width: 130, renderCell: (params) => {
        const rowKey = params.row.id; // 행의 ID

        return (
          <div onClick={(e) => { e.stopPropagation() }}>
            <select
              className="w-full bg-[#67666E]"
              value={params.row.selectedSupplier}
              onChange={(e) => handleSupplierChange(rowKey, e.target.value)}
            >
              {params.row.details.map((detail, index) => (
                <option key={index} value={detail.supplier}>
                  {detail.supplier}
                </option>
              ))}
            </select>
          </div>
        );
      }
    },
    {
      field: 'Pastlead', headerName: 'Past Lead Time', width: 130, renderCell: (params) => (
        <div onClick={(e) => { e.stopPropagation() }}>
          <Button className='greenbutton' onClick={() => setPastleadOpen(true)}>과거리드타임</Button>
        </div>
      )
    },
    {
      field: 'delete', headerName: '', width: 7, renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.orderdetailid)}>
          <ClearOutlinedIcon />
        </IconButton>
      )
    },
  ];

  // setRows값이 없을때 purDetails값을 초기값으로 설정
  useEffect(() => {
    const initialRows = purDetails.map((entry, index) => {
      const firstDetail = entry.detail[0]; // 첫 번째 공급자의 정보를 가져옴
      return {
        id: `row-${index}`, // 고유한 ID
        key: entry.key, // 카테고리 key
        details: entry.detail, // 공급자별 상세 정보를 포함
        selectedSupplier: firstDetail.supplier, // 기본적으로 첫 번째 공급자 선택
        // 나머지 정보
        ...firstDetail,
      };
    });

    setRows(initialRows); // 상태 초기화
  }, [purDetails]);

  console.log('rows', rows)

  // 테이블에서 공급자 바뀌면 해당 행에 정보 업데이트
  const handleSupplierChange = (rowKey, selectedSupplier) => {
    setRows(prevRows =>
      prevRows.map(r => {
        if (r.id === rowKey) {
          // 선택된 공급자에 해당하는 detail 찾기
          const selectedDetail = r.details.find(detail => detail.supplier === selectedSupplier);
          if (selectedDetail) { // selectedDetail이 존재하는 경우
            return {
              ...r,
              selectedSupplier: selectedSupplier,
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

    setRows(prevRows => {
      const updatedRows = prevRows.map(row => {
        if (row.id === rowId) {
          const updatedDetails = row.details.map(detail => {
            // 현재 선택된 공급자에 맞는 detail만 업데이트
            if (detail.supplier === row.selectedSupplier) {
              const updatedAmount = formatPrice(detail.price, newQuantity, detail.unit); // 새 amount 계산
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
            return total + parseFloat(detail.amount.replace(/[₩$, ¥, €]/g, '').replace(',', '')); // 각 detail의 amount 합산
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
      const selectedRowIds = updatedRows.filter(row => row.selected).map(row => row.id);
      // 선택된 행의 총합계 계산
      const newTotals = calculateTotal(selectedRowIds, updatedRows); // updatedRows를 인자로 전달
      setTotal(newTotals); // 총합계 업데이트

      return updatedRows; // 업데이트된 rows 반환
    });
  };


  useEffect(() => {
    //     console.log("Rows updated:", rows); // rows의 현재 상태
    // const newTotals = calculateTotal(selrow);
    // console.log("New totals:", newTotals); // 계산된 총합
    //     setTotal(newTotals);
  }, [rows, selrow]);  // rows가 변경될 때마다 total을 계산


  // 행 삭제
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/cancelOrderItem/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('ordering cancel item response was not ok');
      };
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  ///////////////////////
  //  선택행 처리 함수  //
  ///////////////////////

  // 체크된 행 배열값 전달
  const handleSelectionChange = (newSelection) => {
    const selectedItemIds = newSelection.map((rowId) => {
      // 선택된 rowId를 가진 행을 찾기
      const selectedRow = rows.find(row => row.id === rowId);
      console.log('sR', selectedRow.details); // 확인용
      if (selectedRow) {
        // 현재 선택된 공급자에 해당하는 detail 찾기
        const selectedDetail = selectedRow.details.find(detail => detail.supplier === selectedRow.selectedSupplier);
        return selectedDetail ? selectedDetail.itemid : null; // 해당 공급자의 itemid 반환
      }
      return null; // rowId에 해당하는 행이 없으면 null 반환
    }).filter(Boolean); // null 제거하여 유효한 itemid만 반환

    console.log('체크박스로우', newSelection); // 확인용
    console.log('체크박스', selectedItemIds); // 확인용
    // rows의 선택 상태 업데이트
    setRows(prevRows => {
      return prevRows.map(row => ({
        ...row,
        selected: newSelection.includes(row.id) // 선택된 행인지 확인
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
    const senddata = rows.filter(row => rowid.includes(row.id)) // rowid가 포함된 행 필터링
      .map(detail => detail.details) // 각 행의 details 가져오기
      .flatMap(detailsArray => detailsArray.map(dt => ({
        itemsId: dt.itemid,
        orderDetailId: dt.orderdetailid,
        quantity: dt.quantity
      }))).filter(i => selectedIds.includes(i.itemsId));
    // console.log('발주할 데이터',senddata)
    setSelectrowforordering(senddata)
  }

  // 선택 행 값 전달
  const handleRowclick = (params, event) => {
    const currentRow = rows.find(row => row.id === params.id);
    setCurrentrow(currentRow)
    // console.log('currentRow:', currentRow);
    if (currentRow) {
      // 현재 선택된 공급자의 정보를 가져옴
      const selectedDetail = currentRow.details.find(detail => detail.supplier === currentRow.selectedSupplier);
      // console.log('Selected Row Data:', selectedDetail);

      // 선택 행 값 전달
      setClickrow(selectedDetail);
      getOrderDetaildata(selectedDetail, event);
      const id = selectedDetail.itemid;
      // console.log('클릭한 id', id)
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
      const itemid = clickrow.itemid;
      // console.log('행선택itemname', itemname)
      // console.log('행선택orderdetailid', orderdetailid)
      setSelectrowitemname(itemname)
      setSelectrowOrderid(orderdetailid)
      setSelectrowitemid(itemid)
    }
  };

  //  ===============
  // | 발주 하기 api |
  //  ===============
  const handlePerchase = () => {
    const fetchOrdering = async () => {
      const preordering = selectrowforordering;
      console.log('peeeeeee', preordering)
      try {
        const response = await fetch(`/orderUpdate`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preordering),
        })
        if (!response.ok) {
          throw new Error("Ordering response was not ok");
        }
      } catch (e) {
        console.error('Failed to fetch Ordering: ', e)
      }
    }
    fetchOrdering()
    window.location.reload();
  };

  const handleclo = () => { setrecoal(false); setrecoal2(false); }

  //  ================
  // | 물품 바꾸기 api |
  //  ================
  const handleRecommend = (reco) => {

    // 선택한 물품이 공급업체를 바꾸기만 하면되면 모달
    if (Currentrow.details.map(detail => detail.itemid).includes(reco)) {
      return setrecoal(true)
    }
    // 선택한 물품이 이미 장바구니에 있을 때 모달
    if (rows.map(detail => detail.itemid).includes(reco)) {
      return setrecoal2(true)
    }
    const fetchChangeitem = async () => {
      try {
        const response =
          await fetch(`/updateItem?orderDetailId=${selectrowOrderid}&newItemId=${reco}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          })
        if (!response.ok) {
          throw new Error("Changeitem response was not ok");
        }
        // 선택한 행을 해제
        setClickrow(null);
        fetchOrderDetails();
      } catch (e) {
        console.error('Failed to fetch Changeitem :', e)
      }
    }
    fetchChangeitem()
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
    const count = rows.filter(row => {
      const bestOrderDate = new Date(row.BestOrderDate);
      return bestOrderDate < currentDate;
    }).length;
    setDisablerowcount(count);
  };

  // console.log('dis', disablerowcount)

  // 비활성화 행 감시
  useEffect(() => {
    countdisablerow(rows)
  }, [rows.length > 0 ? rows : ""])

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
    setRecommendItem([])
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
      const response = await fetch(`/recommend?selectedItemId=${id}&releaseDate=${orderdate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error('Recommend item response was not ok');
      };
      const recoitems = await response.json();
      // console.log('reco', recoitems);
      setRecommendItem(recoitems);
      // console.log('최종',recommenditem)
    } catch (error) {
      console.error('Failed to fetch recommend:', error);
    } finally {
      // setLoading(false);
    }
  };

  // console.log('추천data', recommendItem)

  return (
    <div>
      <div className="flex-col text-white OrderManage">
        <div className='flex m-2 items-center'>
          <h4 className='font-bold text-xl m-2'>창고 출고 예정일 </h4>
          <div className='text-2xl font-bold'>{purDetails2.length > 0 ? purDetails2[0].releaseDate : ' '}</div>
        </div>
        <div className="bg-[#162136] m-5 p-5 rounded-lg">
          {(Array.isArray(oriData) ? oriData : [oriData]).every(d => d.orderDetails.length === 0) ? (
            <div className='flex justify-center text-2xl font-semibold'>
              모든 물품을 발주 하였습니다.
            </div>
          ) : (
            <>
              <div className='flex justify-between'>
                <div>
                  <h1 className='font-bold text-xl'>요청 물품 목록</h1>
                </div>
                <div className='flex justify-between m-2 p-2'>
                  <Button className='bluebutton' onClick={() => setPreleadOpen(true)}>
                    차트보기
                  </Button>
                  <Modal open={preleadopen} onClose={() => setPreleadOpen(false)}>
                    <Box
                      className="modalContent"
                      sx={{
                        color: 'black',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        height: '200px',
                        bgcolor: '#17161D',
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 24,
                      }}
                    >
                      <Box sx={{ marginBottom: 2, fontSize: 'large', fontWeight: 'bold', color: 'white' }}>
                        여기 차트 올거임
                      </Box>
                    </Box>
                  </Modal>
                </div>
              </div>

              <div className='p-6'>
                <DataGrid
                  columns={col}
                  rows={rows}
                  getRowId={(row) => row.id}
                  pageSizeOptions={[10, 25, 50, 100]}
                  checkboxSelection
                  onRowSelectionModelChange={handleSelectionChange}
                  onRowClick={handleRowclick}
                  disableRowSelectionOnClick
                  isRowSelectable={(purDetails) => {
                    const bestOrderDate = new Date(purDetails.row.BestOrderDate);
                    const currentDate = new Date();
                    return bestOrderDate >= currentDate;
                  }}
                  getRowClassName={(purDetails) => {
                    const bestOrderDate = new Date(purDetails.row.BestOrderDate);
                    const currentDate = new Date();
                    return bestOrderDate < currentDate ? 'overdate' : '';
                  }}
                  sx={{
                    color: 'white',
                    fontWeight: 'semi-bold',
                    border: 'none',
                    alignItems: 'center',
                    '--DataGrid-containerBackground': '#47454F',
                    '--DataGrid-rowBorderColor': '#272530',
                    '& .MuiCheckbox-root.Mui-disabled': {
                      color: '#868686',
                      '& svg': { fill: '#868686' },
                    },
                    '& .MuiTablePagination-root, .MuiIconButton-root.Mui-disabled': {
                      color: 'white',
                    },
                    '& .MuiDataGrid-virtualScrollerRenderZone': {
                      backgroundColor: '#67666E',
                    },
                    '& .MuiDataGrid-filler': { display: 'none' },
                    '& .css-20bmp1-MuiSvgIcon-root' : {fill:'white'},
                    '& .MuiDataGrid-withBorderColor' : { borderColor: 'black'}
                  }}
                />
              </div>

              <div className='p-2'>
                <h2 className='text-[#FFCC6F] font-semibold'>
                  예상 리드타임 : {selrow.length > 0 ? getLongestCheckedLeadTime(selrow) : '-'}
                </h2>
                <div className='flex justify-between items-center'>
                  <div className='flex'>
                    <h2 className='font-semibold'>총 주문금액: </h2>
                    <div className='ml-2'>{formatTotal(total)}</div>
                  </div>
                  <div>
                    <Button className='bluebutton2' onClick={() => setPerchasopen(true)}>
                      발주
                    </Button>
                    <Modal open={perchasopen} onClose={() => setPerchasopen(false)}>
                      <Box
                        className="modalContent"
                        sx={{
                          color: 'black',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '400px',
                          height: '200px',
                          bgcolor: '#17161D',
                          p: 3,
                          borderRadius: 2,
                          boxShadow: 24,
                        }}
                      >
                        <Box
                          sx={{
                            marginBottom: 2,
                            fontSize: 'large',
                            fontWeight: 'bold',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          발주하시겠습니까?
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            sx={{ color: 'white', bgcolor: '#43C5FE' }}
                            onClick={() => {
                              setPerchasopen(false);
                              handlePerchase();
                            }}
                          >
                            확인
                          </Button>
                          <Button
                            className='graybutton'
                            sx={{ color: 'white', bgcolor: '#BFBFBF' }}
                            onClick={() => setPerchasopen(false)}
                          >
                            취소
                          </Button>
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
        {disablerowcount > 0 ? <div>
          <div className='flex items-center justify-center'>
            <h2 className='font-bold'>창고 출고 예정일까지 수령 불가능한 상품이 있습니다.</h2>
            <h2 className='ml-2 text-[#5BF4FF]'>({disablerowcount}건)</h2>
          </div>
          <div className="bg-[#162136] m-5 p-5 rounded-lg">
            <div className='flex items-center ml-3'>
              <h4 className='text-[#5BF4FF] text-xl font-bold'>{selectrowitemname || " "}</h4>
              {selectrowitemname ? <h4 className='font-bold text-base ml-2'>대체 추천 상품</h4> : " "}
            </div>
            <div className='flex items-center justify-start'>
              {
                clickrow && recommendItem.length === 0 ?
                  <div className='w-full'>
                    <div className='flex items-end'>
                      <h1 className='mt-5 ml-5 text-rose-500 font-bold text-2xl'> 대체 가능한 상품이 없습니다.</h1>
                    </div>
                    <h1 className='mt-2 ml-5 text-xl font-bold'>구매자 : {purDetails2[0].username + ` (${purDetails2[0].alias})`} {formatPhoneNumber(purDetails2[0].tel)}</h1>
                  </div>
                  :
                  recommendItem.map(detail => (
                    <div key={detail.itemsId} className='bg-[#373640] border-[#373640] rounded-lg w-1/4 m-3 p-3' onClick={() => handleRecommend(detail.itemsId)}>
                      <div className='text-xl font-bold m-2'>{detail.itemName}</div>
                      <div className='flex justify-between items-center m-2'>
                        <div className='text-lg font-bold'>{detail.supplierName}</div>
                        <div className='text-base font-bold'>{getCurrencySymbol(detail.unit)} {detail.price}</div>
                      </div>
                      <div className='flex justify-between items-center m-2'>
                        <div className='text-base font-bold'>{detail.recommendedOrderDate}</div>
                        <div className='text-[#bebebe] text-sm'>(예상 리드타임 : {detail.leadtime}일)</div>
                      </div>
                    </div>)
                  )
              }
            </div>
          </div>
        </div> : null}
      </div>
      <Modal open={recoal} onClose={handleclo}>
        <Box
          className="modalContent"
          sx={{
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute', // 또는 'fixed'로 설정
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // 중앙 정렬
            width: '400px',  // 원하는 너비로 설정
            height: '200px', // 원하는 높이로 설정
            bgcolor: '#17161D', // 배경색 설정 (선택 사항)
            p: 3, // 패딩 설정 (선택 사항)
            borderRadius: 2, // 모서리 둥글기 (선택 사항)
            boxShadow: 24, // 그림자 (선택 사항)
          }}
        >
          <div>
            <h1 className='text-white text-2xl font-bold'> supplier를 바꾸세요</h1>
          </div>
        </Box>
      </Modal>
      <Modal open={recoal2} onClose={handleclo}>
        <Box
          className="modalContent"
          sx={{
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute', // 또는 'fixed'로 설정
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // 중앙 정렬
            width: '400px',  // 원하는 너비로 설정
            height: '200px', // 원하는 높이로 설정
            bgcolor: '#17161D', // 배경색 설정 (선택 사항)
            p: 3, // 패딩 설정 (선택 사항)
            borderRadius: 2, // 모서리 둥글기 (선택 사항)
            boxShadow: 24, // 그림자 (선택 사항)
          }}
        >
          <div>
            <h1 className='text-white text-2xl font-bold'> 장바구니에 있는 상품입니다.</h1>
          </div>
        </Box>
      </Modal>
      <Modal open={pastleadopen} onClose={() => setPastleadOpen(false)}>
        <Box
          className="modalContent"
          sx={{
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute', // 또는 'fixed'로 설정
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // 중앙 정렬
            width: '400px',  // 원하는 너비로 설정
            height: '200px', // 원하는 높이로 설정
            bgcolor: '#17161D', // 배경색 설정 (선택 사항)
            p: 3, // 패딩 설정 (선택 사항)
            borderRadius: 2, // 모서리 둥글기 (선택 사항)
            boxShadow: 24, // 그림자 (선택 사항)
          }}
        >
          <h1 className='text-white'>과거리드타임차트,, 어케들고오냐</h1>
        </Box>
      </Modal>
    </div>
  );
}
