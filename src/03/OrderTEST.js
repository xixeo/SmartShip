import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import './Order.scss';
import BasicDatePicker from './BasicDatePicker';
import dayjs from 'dayjs';
import Modal from '@mui/material/Modal'
import { CheckBox } from '@mui/icons-material';


export default function OrderTest() {
  const [listdatas, setListdatas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    () => {
      const savedDate = localStorage.getItem('selectedDate');
      return savedDate ? dayjs(savedDate) : dayjs().add(1, 'month');
    }
  );
  const [deleteopen, setDeleteOpen] = useState(false);
  const [perchasopen, setPerchasOpen] = useState(false);


  const token = localStorage.getItem('token');

  //  ==================
  // | 장바구니 get api |
  //  ==================

  const fetchorderlist = async (selectedDate) => {
    const orderbasket = [
      //   {
      //     "message": "장바구니 내역이 성공적으로 조회되었습니다.",
      //     "cartItem": {
      //       "cartId": 9,
      //       "username": "유승호",
      //       "alias": "a해운선사",
      //       "releaseDate": "2024-09-11",
      //       "bestOrderDate": "2024-08-13",
      //       "createdAt": "2024-09-11T14:43:26",
      //       "cartItems": [
      //         {
      //           "cartItemId": 7,
      //           "category1Name": "패션의류",
      //           "category2Name": "여성패션",
      //           "category3Name": "팬츠",
      //           "itemsId": 1,
      //           "itemName": "청바지",
      //           "quantity": 15,
      //           "price": 39900.00,
      //           "unit": "KRW",
      //           "username": "민주샵",
      //           "leadtime": 30,
      //           "recommendedOrderDate": "2024-08-21"
      //         },
      //         {
      //           "cartItemId": 8,
      //           "category1Name": "패션의류",
      //           "category2Name": "여성패션",
      //           "category3Name": "팬츠",
      //           "itemsId": 2,
      //           "itemName": "청바지",
      //           "quantity": 15,
      //           "price": 40100.00,
      //           "unit": "KRW",
      //           "username": "수플린",
      //           "leadtime": 15,
      //           "recommendedOrderDate": "2024-08-22"
      //         },
      //         {
      //           "cartItemId": 9,
      //           "category1Name": "패션의류",
      //           "category2Name": "남성패션",
      //           "category3Name": "팬츠",
      //           "itemsId": 3,
      //           "itemName": "청바지",
      //           "quantity": 15,
      //           "price": 39800.00,
      //           "unit": "KRW",
      //           "username": "민주샵",
      //           "leadtime": 25,
      //           "recommendedOrderDate": "2024-08-28"
      //         },
      //         {
      //           "cartItemId": 10,
      //           "category1Name": "패션의류",
      //           "category2Name": "캐주얼/유니섹스",
      //           "category3Name": "팬츠",
      //           "itemsId": 4,
      //           "itemName": "청바지",
      //           "quantity": 15,
      //           "price": 38800.00,
      //           "unit": "KRW",
      //           "username": "쿠팡",
      //           "leadtime": 31,
      //           "recommendedOrderDate": "2024-08-26"
      //         },
      //         {
      //           "cartItemId": 11,
      //           "category1Name": "패션잡화",
      //           "category2Name": "모자/장갑/ACC",
      //           "category3Name": "양말/ACC",
      //           "itemsId": 5,
      //           "itemName": "양말",
      //           "quantity": 15,
      //           "price": 12500.00,
      //           "unit": "KRW",
      //           "username": "토라삭스",
      //           "leadtime": 10,
      //           "recommendedOrderDate": "2024-09-08"
      //         },
      //         {
      //           "cartItemId": 12,
      //           "category1Name": "뷰티",
      //           "category2Name": "향수",
      //           "category3Name": "여성향수",
      //           "itemsId": 6,
      //           "itemName": "NO.5",
      //           "quantity": 15,
      //           "price": 299000.00,
      //           "unit": "KRW",
      //           "username": "첼시마켓",
      //           "leadtime": 20,
      //           "recommendedOrderDate": "2024-08-24"
      //         },
      //         {
      //           "cartItemId": 19,
      //           "category1Name": "뷰티",
      //           "category2Name": "향수",
      //           "category3Name": "캔들/디퓨저",
      //           "itemsId": 7,
      //           "itemName": "양키캔들",
      //           "quantity": 5,
      //           "price": 49900.00,
      //           "unit": "KRW",
      //           "username": "첼시마켓",
      //           "leadtime": 4,
      //           "recommendedOrderDate": "2024-08-13"
      //         }
      //       ]
      //     }
      //   }
    ];
    try {
      const response = await fetch(`getCart/${selectedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      if (!response.ok) {
        throw new Error('orderbasket response was not ok');
      };
      const orderbasket = await response.json();
      // 응답이 객체인지 확인하고 cartItem이 정의되어 있는지 확인 후 배열로 전환
      // if (orderbasket && orderbasket.cartItem) {
        const basket = {
          orderId: orderbasket.cartItem.cartId,
          createdAt: orderbasket.cartItem.createdAt,
          orderDetails: orderbasket.cartItem.cartItems,
        };
        setListdatas(basket);
      // }
      console.log(listdatas);
    } catch (error) {
      console.error('Failed to fetch orderbasket:', error);
    }
  };

  //////////////////////
  //  날짜 관련 함수   //
  //////////////////////

  const orderdate = selectedDate.format('YYYY-MM-DD');
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  useEffect(() => {
    fetchorderlist(selectedDate.format('YYYY-MM-DD'));
    // console.log('sel1', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('selectedDate', orderdate);
  }, [selectedDate]);

  useEffect(() => {
    // 새로고침 시 localStorage 비우기
    localStorage.removeItem('selectedDate');
  }, []);


  //////////////////////
  //  정보 추출 함수   //
  //////////////////////

  // 선택한 항목의 아이템아이디 추출 
  const getItemIds = (cartItemId) => {
      return listdatas
        .filter((detail) => detail.cartItemId === cartItemId)
        .map((detail) => detail.itemsId);
    };

  // 체크된 항목의 아이디 추출
  const getcheckedItemIds = () => {
     return null;
  };

  // 체크된 항목의 아이디와 수량을 추출
  const getCheckedItemsWithQuantity = () => {
    return null;
  };

  //////////////////////
  //  버튼 관련 함수   //
  //////////////////////

  // 삭제버튼 - 체크한 행 itemsid
  const handleDelete = async () => {
    // 손자 체크박스에서 체크된 아이템 필터링
    const checkedItemIds = getcheckedItemIds();
    console.log('checkeditemsids', checkedItemIds);
    const itemsId = checkedItemIds.map(item => item.itemsId);
    console.log('array', Array.isArray(checkedItemIds));
    console.log('itemsid', itemsId);

    try {
      const response = await fetch(`delItem`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemsId),
        }
      );
      if (!response.ok) {
        throw new Error('orderbasket delete item response was not ok');
      };
      setDeleteOpen(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // 행삭제버튼 - 선택한 행 itemsid
  const handledeleteitem = async (cartItemId) => {
    //선택한 행들 아이템 아이디 뽑아야함
    const selectitemsid = getItemIds(cartItemId);
    console.log('selectitemid', selectitemsid);

    try {
      const response = await fetch(`delItem`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectitemsid),
        }
      );
      if (!response.ok) {
        throw new Error('orderbasket delete item response was not ok');
      };
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // 구매버튼
  const handlePerchase = async (orderdate) => {

    const checkitemidandquantity = getCheckedItemsWithQuantity();

    console.log('checkedItemDetails', checkitemidandquantity);
    // console.log('seldate', orderdate);

    try {
      const response = await fetch(`saveToOrder/${orderdate}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkitemidandquantity),
        }
      );
      if (!response.ok) {
        throw new Error('orderbasket perchase item response was not ok');
      };
      setPerchasOpen(false);
      // window.location.reload(); 새로고침하는건데 새로고침보다는... 내 주문목록으로 넘겨주는게 맞는걸까?
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-col text-white OrderBasket">
      <div className="bg-[#2F2E38] m-5 p-5 rounded-lg">
        <div className='flex m-2'>
          <h4 className='m-2'>창고 출고 예정일 </h4>
          <BasicDatePicker onDateAccept={(date) => setSelectedDate(date)} />
        </div>
        <div className='flex justify-between m-2 p-2'>
          <Button className='bluebutton' onClick={() => setDeleteOpen(true)} >삭제</Button>
          <Modal open={deleteopen} setOpen={() => setDeleteOpen}>
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
              <Box sx={{ marginBottom: 2, fontSize: 'large', fontWeight: 'bold', color: 'white' }}>정말 삭제하시겠습니까?</Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button sx={{ color: 'white', bgcolor: '#43C5FE' }}
                  onClick={() => {
                    setDeleteOpen(false);
                    handleDelete();
                  }}>
                  확인
                </Button>
                <Button className='graybutton' sx={{ color: 'white', bgcolor: '#BFBFBF' }}
                  onClick={() => {
                    setDeleteOpen(false);
                  }}>
                  취소
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>
        {/* 판매자별 카드 시작 */}
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
                      <TableCell padding='checkbox'><CheckBox></CheckBox> </TableCell>
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
                    {listdatas.map((detail) => {
                      return (
                        <TableRow key={detail.cartItemId}>
                          <TableCell padding='checkbox' sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>
                            <Checkbox
                              // checked={checkedGrandchildren[`${username}-${detail.cartItemId}`] || false}
                              // onChange={(event) => handleCheckboxClick(event, username, detail.cartItemId, detail.quantity)}
                              // disabled={isCheckboxDisabled(username, detail.cartItemId)}
                              // sx={{ color: 'white' }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category1Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category2Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category3Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.itemName}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.quantity}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}><IconButton onClick={() => handledeleteitem(detail.cartItemId)} size='small' sx={{ color: 'white' }}><ClearOutlinedIcon fontSize="inherit" /></IconButton></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
        <div className='flex justify-between m-2 p-2'>
          <Button className='bluebutton2' onClick={() => setPerchasOpen(true)}>구매신청</Button>
          <Modal open={perchasopen} setOpen={() => setPerchasOpen}>
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
          </Modal>
        </div>
      </div>
    </div>
  );
}
