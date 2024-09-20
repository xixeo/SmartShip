import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import '../03/Order.scss';
import Modal from '@mui/material/Modal'
import Loading from '../Compo/Loading';
import { useParams } from 'react-router-dom';

export default function OrderTest() {
  const [purDetails, setPurDetails] = useState([]);
  const [checkedChildren, setCheckedChildren] = useState({}); // 자식 체크박스 상태
  const [checkedGrandchildren, setCheckedGrandchildren] = useState([]); // 손자 체크박스 상태
  const [pastleadopen, setPastleadOpen] = useState(false);
  const [preleadopen, setPreleadOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const { orderId } = useParams(); // URL에서 orderId 가져오기

  const token = localStorage.getItem('token');
  console.log('id',orderId);

  //  ==================
  // | 발주관리 get api |
  //  ==================

  useEffect(() => {
    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`getOrderDetail/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch order details");
            }
            const details = await response.json();
            setPurDetails(details);
        } catch (e) {
            console.error('Error fetching order details:', e);
        } finally {
            setLoading(false);
        }
    };

    fetchOrderDetails();
}, [orderId, token]);

console.log(purDetails)

  //   ======================
  //   || 대체 추천 상품 시작 ||
  //    ======================

  // // 비활성화된 손자체크박스 갯수
  // const countDisabledGrandchildren = () => {
  //   let disabledCount = 0;

  //   Object.keys(groupedData).forEach((username) => {
  //     groupedData[username].forEach((detail) => {
  //       const key = `${username}-${detail.cartItemId}`;
  //       if (isCheckboxDisabled(username, detail.cartItemId)) {
  //         disabledCount += 1;
  //       }
  //     });
  //   });

  //   return disabledCount;
  // };

  // const disabledCount = countDisabledGrandchildren();
  // // console.log(`비활성화된 자손 체크박스의 개수: ${disabledCount}`);
  // const [selectedRow, setSelectedRow] = useState(null);
  // const [recommenditem, setRecommendItem] = useState([]);

  // const handleClickrow = async (cartItemId, orderdate) => {
  //   setSelectedRow(cartItemId);
  //   const selectitem = getItemIds(cartItemId);
  //   console.log(selectitem);
  //   // const recoitems = [{
  //   //   'itemsId': 2,
  //   //   'itemName': '청바지',
  //   //   'price': 40100.00,
  //   //   'unit': 'KRW',
  //   //   'supplierName': '수플린',
  //   //   'leadtime': 20,
  //   //   'recommendedOrderDate': '2024-10-10'
  //   // },];
  //   try {
  //       const response = await fetch(`recommend?selectedItemId=${selectitem}&releaseDate=${orderdate}`,
  //         {
  //           headers: {
  //             'Authorization': `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       if (!response.ok) {
  //         throw new Error('Recommend item response was not ok');
  //       };
  //       const recoitems = await response.json();
  //     console.log('reco',recoitems);
  //     setRecommendItem(recoitems);
  //     console.log('최종',recommenditem)
  //   } catch (error) {
  //     console.error('Failed to fetch recommend:', error);
  //   }
  // }

  return (
    <div>
      {loading ? (<Loading/> ): (
    <div className="flex-col text-white OrderBasket">
      <div className="bg-[#2F2E38] m-5 p-5 rounded-lg">
        <div className='flex m-2'>
          <h4 className='m-2'>창고 출고 예정일 </h4>
          <div>{purDetails.bestOrderDate}</div>
        </div>
        <div className='flex justify-between m-2 p-2'>
          <Button className='bluebutton' onClick={() => setPreleadOpen(true)} >차트보기</Button>
          <Modal open={preleadopen} setOpen={() => setPreleadOpen}>
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
        {purDetails.map((order) => (
          <div key={order.orderId} className="bg-[#2F2E38] text-white rounded-xl m-5 border border-[#69686F]">
              <div className="w-full p-4">
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        'th, td': {
                          bgcolor: '#47454F',
                          color: 'white',
                          fontWeight: 'bold',
                          border: 'none',
                        },
                      }}
                    >
                      <TableCell padding='checkbox'></TableCell>
                      <TableCell align="center">Category1 Name</TableCell>
                      <TableCell align="center">Category2 Name</TableCell>
                      <TableCell align="center">Category3 Name</TableCell>
                      <TableCell align="center">Item Name</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">BestOrderDate</TableCell>
                      <TableCell align="center">PastLeadtime</TableCell>
                      <TableCell padding='checkbox' align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderDetails.map((detail) => {
                      return (
                        // <TableRow key={detail.cartItemId}  className={dayjs(detail.bestOrderDate).isBefore(dayjs(), 'day') ? 'activerow' : 'normalrow'}>
                        <TableRow key={detail.orderDetailId} 
                        // onClick={() => handleClickrow(detail.orderDetailId, orderdate)} 
                        // className={new Date(detail.bestOrderDate) < yesterday ? 'activerow' : 'normalrow'}
                        >
                          <TableCell padding='checkbox' sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}></TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category1Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category2Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category3Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.itemName}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.quantity}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>
                            {/* {formatPrice(detail.price, detail.quantity, detail.unit)} */}
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.bestOrderDate}({detail.leadtime}일)</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}><Button className='greenbutton'>과거 리드타임</Button></TableCell>
                          {/* <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}><IconButton onClick={()=>handledeleteitem(detail.cartItemId)} size='small' sx={{ color: 'white' }}><DeleteIcon fontSize="inherit" /></IconButton></TableCell> */}
                          {/* <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}><IconButton onClick={() => handledeleteitem(detail.orderDetailId)} size='small' sx={{ color: 'white' }}><ClearOutlinedIcon fontSize="inherit" /></IconButton></TableCell> */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className='flex justify-between p-2'>
                <h2>
                  주문 금액 : 
                  {/* {getFormattedCardTotal(username)} */}
                </h2>
                <h2 className='text-[#FFCC6F] font-semibold'>
                  예상 리드타임 : 
                  {/* {getLongestCheckedLeadTime(username)} */}
                </h2>
              </div>
          </div>
        ))}
        <div className='flex justify-between m-2 p-2'>
          <div className='flex'>
            <h2>총 주문금액: </h2>
            <div className=''>
              {/* {Object.entries(totals).map(([currency, total]) => (
                <div key={currency} className='ml-2'>
                  <h2>
                    {getCurrencySymbol(currency)} {total.toLocaleString()}
                  </h2>
                </div>
              ))} */}
            </div>
          </div>
          <Button className='bluebutton2'>발주</Button>
          {/* <Modal open={perchasopen} setOpen={() => setPerchasOpen}>
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
                주문하시겠습니까?
                <h4 className='text-sm'>창고 출고 예정일 : {orderdate}</h4>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button sx={{ color: 'white', bgcolor: '#43C5FE' }}
                  onClick={() => {
                    setPerchasOpen(false);
                    handlePerchase(orderdate);
                  }}>
                  확인
                </Button>
                <Button className='graybutton' sx={{ color: 'white', bgcolor: '#BFBFBF' }}
                  onClick={() => {
                    setPerchasOpen(false);
                  }}>
                  취소
                </Button>
              </Box>
            </Box>
          </Modal> */}
        </div>
      </div>
      {/* 추천상품 시작 */}
     {/* { disabledCount>0 ?<div>
        <div className='flex items-center justify-center'>
          <h2 className='font-bold'>창고 출고 예정일까지 수령 불가능한 상품이 있습니다.</h2>
          <h2 className='ml-2 text-[#5BF4FF]'>({disabledCount}건)</h2>
        </div>
        <div className="bg-[#2F2E38] m-5 p-5 rounded-lg">
          <div className='flex items-center ml-3'>
            <h4 className='text-[#5BF4FF] text-xl font-bold'>{getItemName(selectedRow)}</h4>
            <h4 className='font-bold text-base ml-2'>대체 추천 상품</h4>
          </div>
          <div className='flex items-center justify-start'>
        {recommenditem.map(detail => (
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
            ))}
          </div>
        </div>
      </div>:null} */}
    </div>
    )}
    </div>
  );
}
