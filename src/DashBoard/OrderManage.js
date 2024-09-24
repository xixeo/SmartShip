import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'
import Loading from '../Compo/Loading';
import { useParams } from 'react-router-dom';
import './OrderManage.scss';

export default function OrderTest() {
  const { orderId } = useParams(); // URL에서 orderId 가져오기
  const [purDetails, setPurDetails] = useState([]);
  const [quantityState, setQuantityState] = useState({});
  const [pastleadopen, setPastleadOpen] = useState(false);
  const [preleadopen, setPreleadOpen] = useState(false);
  const [perchasopen, setPerchasopen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selrow, setSelrow] = useState([]);
  const [totalAmounts, setTotalAmounts] = useState({});
  const token = localStorage.getItem('token');
  // console.log('id', orderId);

  //  ==================
  // | 발주관리 get api |
  //  ==================

  useEffect(() => {
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
        console.log('formattedData', formattedData)
        setPurDetails(formattedData);
        const initialQuantities = formattedData.reduce((acc, detail) => {
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

    fetchOrderDetails();
  }, [orderId]);

  console.log('purdetails', purDetails)

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
  const calculateTotalAmount = (selectedIds) => {
    const selectedDetails = purDetails.filter(detail => selectedIds.includes(detail.itemid));
    const totals = selectedDetails.reduce((acc, detail) => {
      const { unit, price, quantity } = detail;
      const totalPrice = price * quantity; // 숫자만 추출하여 계산

      if (!acc[unit]) {
        acc[unit] = 0;
      }
      acc[unit] += totalPrice;
      return acc;
    }, {});

    setTotalAmounts(totals);
  };

  useEffect(() => {
    if (selrow.length > 0) {
      calculateTotalAmount(selrow);
    }
  }, [purDetails, selrow]);

  console.log('total', totalAmounts)

  //////////////////////
  //  리드타임 함수   //
  //////////////////////

  // 선택된 행 중 리드타임 제일 긴 항목 추출
  const getLongestCheckedLeadTime = (selectedIds) => {
    const selectedDetails = purDetails.filter(detail => selectedIds.includes(detail.itemid));
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
    { field: 'itemName', headerName: 'ItemName', width: 130 },
    { field: 'part1', headerName: 'Part 1', width: 130 },
    { field: 'unitprice', headerName: 'Unit Price', width: 130 },
    { field: 'quantity', headerName: 'Quantity', width: 80, renderCell: (params) => (<input type='number' value={quantityState[params.row.itemid]} onChange={(e) => handleQnt(e, params.row.itemid)} className='bg-[#67666E] text-white w-10' />), },
    { field: 'amount', headerName: 'amount', width: 130 },
    { field: 'BestOrderDate', headerName: 'BestOrderDate', width: 130 },
    { field: 'supplier', headerName: 'Supplier', width: 130 },
    { field: 'Pastlead', headerName: 'PastLeadTime', width: 130, renderCell: (params) => (<div onClick={(e) => { e.stopPropagation() }}><Button className='greenbutton'>과거리드타임</Button></div>), },
  ];

  // 수량 변경 함수
  const handleQnt = (e, itemid) => {
    const newQuantity = e.target.value;

    // quantityState 업데이트
    setQuantityState((prevState) => ({
      ...prevState,
      [itemid]: newQuantity,
    }));

    // purDetails 업데이트
    setPurDetails((prevDetails) =>
      prevDetails.map((detail) => {
        if (detail.itemid === itemid) {
          // 새로운 수량을 기반으로 amount 재계산
          const newAmount = formatPrice(detail.price, newQuantity, detail.unit);
          return {
            ...detail,
            quantity: newQuantity, // 수량 업데이트
            amount: newAmount,     // amount 업데이트
          };
        }
        return detail;
      })
    );
  };

  ///////////////////////
  //  선택행 처리 함수  //
  ///////////////////////

  // 체크된 행 배열값 전달
  const handleSelectionChange = (newSelection) => {
    // console.log('newsel', newSelection)
    setSelrow(newSelection);
    calculateTotalAmount(newSelection);
    getDetaildata(newSelection);
  };

  const getDetaildata = (selectedIds) =>{
    
    const selectedDetails = purDetails.filter(detail => selectedIds.includes(detail.itemid));
    const orderdetailid = selectedDetails.map((detail) => detail.orderdetailid);
    const itemid = selectedDetails.map((detail) => detail.itemid);
    const qnt = selectedDetails.map((detail) => detail.quantity);
    setSelectrowOrderid(orderdetailid);
    setSelectrowqnt(qnt);
    setSelectrowitemid(itemid)
    console.log('체크박스orderid', selectrowOrderid)
    console.log('체크박스itid', selectrowitemid)
    console.log('체크박스qnt', selectrowqnt)
  }

  // 선택 행 값 전달
  const handleRowclick = (clickrow, event) => {
    getOrderDetaildata(clickrow, event)
    fetchRecommenditems(clickrow, event)
  };

  // 선택 행 정보 추출 함수
  const getOrderDetaildata = (clickrow, event) => {
    event.preventDefault();
    // console.log('clickrow',clickrow)

    if (event.target.closest('input[type="checkbox"]') === null) {
      const itemname = clickrow.row.itemName;
      // console.log('행선택itemname', typeof itemname)
    }
  };

  //////////////////////
  //  버튼 관련 함수   //
  //////////////////////

  //  ===============
  // | 발주 하기 api |
  //  ===============
const handlePerchase = () => {
  const id = selectrowOrderid;
  const itid = selectrowitemid;
  const qnt = selectrowqnt;
  console.log('발주할 id',id)
  console.log('발주할 itid',itid)
  console.log('발주할 qnt',qnt)

  const fetchOrdering = async () => {
    const preordering = [];
    console.log('peeeeeee',preordering)
    try{
      const response = await fetch(`orderUpdate`,{
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body:{
          
        },
      })
      if(!response.ok) {
        throw new Error("Ordering response was not ok");
      }
    }catch(e){
      console.error('Failed to fetch Ordering: ',e)
    }
  }
  fetchOrdering()
}

  // ======================
  // || 대체 추천 상품 시작 ||
  //  ======================

  const [disablerowcount, setDisablerowcount] = useState(0);
  const [willrecommenditemid, setWillrecommenditemid] = useState({});
  const [selectrowitemid, setSelectrowitemid] = useState({});
  const [selectrowOrderid, setSelectrowOrderid] = useState([]);
  const [selectrowqnt, setSelectrowqnt] = useState([]);
  const [selectrowitemname, setSelectrowitemname] = useState();
  const [recommendItem, setRecommendItem] = useState([]);

  // 비활성화된 행 갯수
  const countdisablerow = (rows) => {
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
    countdisablerow(purDetails)
  }, [purDetails])

  // 전화번호 - 표시
  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  //  ==================
  // | 추천 아이템 api |
  // =================

  // 행선택 시 itemid 추출 후 추천아이템 가져오기
  const fetchRecommenditems = async (clickrow, event) => {
    event.preventDefault();
    console.log('clickrow', clickrow)
    const orderdate = purDetails[0].releaseDate;

    if (event.target.closest('input[type="checkbox"]') === null) {
      const itemid = clickrow.id
      console.log('행선택itemid', itemid)
      setWillrecommenditemid(itemid)
    }
    // setLoading(true)
    try {
      const recoitems = [{
        'itemsId': 2,
        'itemName': '청바지',
        'price': 40100.00,
        'unit': 'KRW',
        'supplierName': '수플린',
        'leadtime': 20,
        'recommendedOrderDate': '2024-10-10'
      },];
      // const response = await fetch(`/recommend?selectedItemId=${willrecommenditemid}&releaseDate=${orderdate}`,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //     },
      //   }
      // )
      // if (!response.ok) {
      //   throw new Error('Recommend item response was not ok');
      // };
      // const recoitems = await response.json();
      console.log('reco', recoitems);
      setRecommendItem(recoitems);
      // console.log('최종',recommenditem)
    } catch (error) {
      console.error('Failed to fetch recommend:', error);
    } finally {
      // setLoading(false);
    }
  };

  console.log('추천data', recommendItem)

  return (
    <div>
      {loading ? (<Loading />) : (
        <div className="flex-col text-white OrderManage">
          <div className='flex m-2 items-center'>
            <h4 className='font-bold text-xl m-2'>창고 출고 예정일 </h4>
            <div className='text-2xl font-bold'>{purDetails[0].releaseDate}</div>
          </div>
          <div className="bg-[#162136] m-5 p-5 rounded-lg">
            <div className='flex justify-between'>
              <div>
                <h1 className='font-bold text-xl'>요청 물품 목록</h1>
              </div>
              <div className='flex justify-between m-2 p-2'>
                <Button className='bluebutton' onClick={() => setPreleadOpen(true)} >차트보기</Button>
                <Modal open={preleadopen} setOpen={() => setPreleadOpen} onClose={() => setPreleadOpen(false)}>
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
                    <Box sx={{ marginBottom: 2, fontSize: 'large', fontWeight: 'bold', color: 'white' }}>여기 차트 올거임</Box>
                  </Box>
                </Modal>
              </div>
            </div>
            <div className='p-6'>
              <DataGrid
                columns={col}
                rows={purDetails}
                getRowId={(purDetails) => purDetails.itemid}
                pageSizeOptions={[10, 25, 50, 100]}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionChange}
                onRowClick={handleRowclick}
                disableRowSelectionOnClick
                isRowSelectable={(purDetails) => {
                  const bestOrderDate = new Date(purDetails.row.BestOrderDate); // BestOrderDate를 Date 객체로 변환
                  const currentDate = new Date(); // 현재 날짜

                  // BestOrderDate가 현재 날짜보다 이전이면 행 선택을 막기 (체크박스 비활성화)
                  return bestOrderDate >= currentDate;
                }}
                getRowClassName={(purDetails) => {
                  const bestOrderDate = new Date(purDetails.row.BestOrderDate); // BestOrderDate를 Date 객체로 변환
                  const currentDate = new Date(); // 현재 날짜

                  // BestOrderDate가 현재 날짜보다 이전인 경우 'overdate' 클래스 적용
                  return bestOrderDate < currentDate ? 'overdate' : '';
                }}
                sx={{
                  color: 'white',
                  fontWeight: 'semi-bold',
                  border: 'none',
                  alignItems: 'center',
                  '--DataGrid-containerBackground': '#47454F',
                  ' --DataGrid-rowBorderColor': '#272530',
                  '--unstable_DataGrid-headWeight': '',
                  '& .MuiCheckbox-root.Mui-disabled': {
                    color: '#868686', // 비활성화된 체크박스 색상
                    '& svg': {
                      fill: '#868686', // SVG 아이콘 색상 변경
                    },
                  },
                  '& .MuiTablePagination-root, .css-rm9hue-MuiSvgIcon-root-MuiSelect-icon, .css-1kcqes5-MuiButtonBase-root-MuiIconButton-root.Mui-disabled, .css-20bmp1-MuiSvgIcon-root, .css-18w7uxr-MuiSvgIcon-root': {
                    color: 'white',
                  },
                  '& .css-wop1k0-MuiDataGrid-footerContainer': {
                    borderTop: 'none',
                  },
                  '& .css-s1v7zr-MuiDataGrid-virtualScrollerRenderZone': {
                    backgroundColor: '#67666E',
                  },
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
                  <div className='ml-2'>
                    {Object.entries(totalAmounts).map(([unit, amount]) => (
                      <div key={unit}>
                        {amount == null ? '-' : `${getCurrencySymbol(unit)} ${amount.toLocaleString()}`}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Button className='bluebutton2' onClick={()=> setPerchasopen(true)}>발주</Button>
                  <Modal open={perchasopen} setOpen={() => setPerchasopen}>
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
                      <Box
                        sx={{
                          marginBottom: 2,
                          fontSize: 'large',
                          fontWeight: 'bold',
                          color: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center', // 수평 중앙 정렬
                          justifyContent: 'center', // 수직 중앙 정렬
                        }}
                      >
                        발주하시겠습니까?
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button sx={{ color: 'white', bgcolor: '#43C5FE' }}
                          onClick={() => {
                            setPerchasopen(false);
                            handlePerchase();
                          }}>
                          확인
                        </Button>
                        <Button className='graybutton' sx={{ color: 'white', bgcolor: '#BFBFBF' }}
                          onClick={() => {
                            setPerchasopen(false);
                          }}>
                          취소
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
                </div>
              </div>
            </div>
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
                {Array.isArray(recommendItem) && recommendItem.length < 0 ? 
                <div className='w-full'>
                <div className='flex items-end'>
                  <h1 className='mt-5 ml-5 text-rose-500 font-bold text-2xl'> 대체 가능한 상품이 없습니다.</h1>
                  {/* <h1 className='ml-5 text-base font-bold text-rose-500'>담당자 연락 필</h1> */}
                </div>
                <h1 className='mt-2 ml-5 text-xl font-bold'>구매자 : {purDetails[0].username + ` (${purDetails[0].alias})`} {formatPhoneNumber(purDetails[0].tel)}</h1>
              </div>
              :
                  recommendItem.map(detail => (
                    <div key={detail.itemsId} className='bg-[#373640] border-[#373640] rounded-lg w-1/4 m-3 p-3'>
                      <div className='text-xl font-bold m-2'>{detail.itemName}</div>
                      <div className='flex justify-between items-center m-2'>
                        <div className='text-lg font-bold'>{detail.supplierName}</div>
                        <div className='text-base font-bold'>{getCurrencySymbol(detail.unit)} {detail.price}</div>
                      </div>
                      <div className='flex justify-between items-center m-2'>
                        <div className='text-base font-bold'>{detail.recommendedOrderDate}</div>
                        <div className='text-[#bebebe] text-sm'>(예상 리드타임 : {detail.leadtime}일)</div>
                      </div>
                    </div>
                  )) 
                }
              </div>
            </div>
          </div> : null}
        </div>
      )}
    </div>
  );
}
