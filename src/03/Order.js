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

//////////////////////
//   데이터 처리1    //
//////////////////////

// 상품 판매자별로 새로 배열설정
const groupByUsername = (orderDetails) => {
  return orderDetails.reduce((groups, detail) => {
    const { username } = detail;
    if (!groups[username]) {
      groups[username] = [];
    }
    groups[username].push(detail);
    return groups;
  }, {});
};

// 리드타임으로 계산해서 최적발주일 데이터 추가
const Addbestdate = (basket, selectedDate) => {
  console.log('seldate', selectedDate);
  console.log('basket', basket);
  return basket.map(order => ({
    ...order,
    orderDetails: order.orderDetails.map(detail => ({
      ...detail,
      bestOrderDate: dayjs(selectedDate).subtract(detail.leadtime, 'day').format('YYYY-MM-DD')
    }))
  }));
};

export default function OrderTest() {
  const [expanded, setExpanded] = useState({});
  const [checkedParent, setCheckedParent] = useState(false); // 부모 체크박스 상태
  const [checkedChildren, setCheckedChildren] = useState({}); // 자식 체크박스 상태
  const [checkedGrandchildren, setCheckedGrandchildren] = useState([]); // 손자 체크박스 상태
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
      // 응답이 객체인지 확인하고 cartItem이 정의되어 있는지 확인
      if (orderbasket && orderbasket.cartItem) {
        const basket = {
          orderId: orderbasket.cartItem.cartId,
          createdAt: orderbasket.cartItem.createdAt,
          orderDetails: orderbasket.cartItem.cartItems,
        };
        const lists = Addbestdate([basket], selectedDate);
        setListdatas(lists);
      }
    } catch (error) {
      console.error('Failed to fetch orderbasket:', error);
    }
  };

  //////////////////////
  //   데이터  처리2   //
  //////////////////////

  const orderDetails = listdatas[0]?.orderDetails || [];
  const groupedData = groupByUsername(orderDetails);
  // const isBeforeToday = groupedData[username].map((detail) => {dayjs(detail.bestOrderDate).isBefore(dayjs(), 'day')});

  //////////////////////
  //  날짜 관련 함수   //
  //////////////////////

  const orderdate = selectedDate.format('YYYY-MM-DD');

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
  //  카드 확장 함수   //
  //////////////////////

  const handleExpandClick = (username) => () => {
    setExpanded({
      ...expanded,
      [username]: !expanded[username],
    });
  };

  //////////////////////
  //  체크박스  함수   //
  //////////////////////

  const isSell = () => {

  }

  // 손자 체크박스 비활성화 관리
  const isCheckboxDisabled = (username, cartItemId) => {
    const detail = groupedData[username].find((item) => item.cartItemId === cartItemId);
    const today = new Date();
    return new Date(detail.bestOrderDate) < today;  // 비활성화 조건
  };

  // 자식 체크박스 비활성화 관리
  const isChildCheckboxDisabled = (username) => {
    return groupedData[username].every((detail) => isCheckboxDisabled(username, detail.cartItemId));  // 비활성화 조건
  };

  // 부모 체크박스 상태 관리
  const handleParentChange = (event) => {
    const newCheckedParent = event.target.checked;
    const newCheckedChildren = {};
    const newCheckedGrandchildren = {};

    Object.keys(groupedData).forEach((username) => {
      // Only update children checkboxes that are not disabled
      const isDisabled = groupedData[username].every((detail) => isCheckboxDisabled(username, detail.cartItemId));
      newCheckedChildren[username] = newCheckedParent && !isDisabled;

      groupedData[username].forEach((detail) => {
        if (!isCheckboxDisabled(username, detail.cartItemId)) {
          newCheckedGrandchildren[`${username}-${detail.cartItemId}`] = newCheckedParent;
        }
      });
    });

    setCheckedParent(newCheckedParent);
    setCheckedChildren(newCheckedChildren);
    setCheckedGrandchildren(newCheckedGrandchildren);
  };

  // 자식 체크박스 상태 관리
  const handleChildChange = (username) => (event) => {
    const newChecked = event.target.checked;
    const newCheckedGrandchildren = { ...checkedGrandchildren };
    groupedData[username].forEach((detail) => {
      if (!isCheckboxDisabled(username, detail.cartItemId)) {
        newCheckedGrandchildren[`${username}-${detail.cartItemId}`] = newChecked;
      }
    });

    const newCheckedChildren = { ...checkedChildren, [username]: newChecked };
    const allGrandchildrenDisabled = groupedData[username].every((detail) => isCheckboxDisabled(username, detail.cartItemId));
    setCheckedChildren({ ...newCheckedChildren, [`${username}-disabled`]: allGrandchildrenDisabled });
    setCheckedGrandchildren(newCheckedGrandchildren);

    // Update parent checkbox state
    updateParentCheckState(newCheckedChildren);
  };

  // 손자 체크박스 상태 관리
  const handleGrandchildChange = (username, cartItemId) => (event) => {
    const newChecked = event.target.checked;
    const newCheckedGrandchildren = { ...checkedGrandchildren, [`${username}-${cartItemId}`]: newChecked };

    setCheckedGrandchildren(newCheckedGrandchildren);

    // 자식과 부모 체크박스 상태 업데이트
    updateChildCheckState(username, newCheckedGrandchildren);
  };

  // 자식 체크박스 상태 업데이트
  const updateChildCheckState = (username, newCheckedGrandchildren) => {
    const allGrandchildrenDisabled = groupedData[username].every((detail) => isCheckboxDisabled(username, detail.cartItemId));

    const allGrandchildrenChecked = groupedData[username].every((detail) => {
      const key = `${username}-${detail.cartItemId}`;
      return isCheckboxDisabled(username, detail.cartItemId) || newCheckedGrandchildren[key];
    });

    const newCheckedChildren = {
      ...checkedChildren,
      [username]: allGrandchildrenChecked && !allGrandchildrenDisabled,
    };

    setCheckedChildren(newCheckedChildren);

    // 부모 체크박스 상태 업데이트
    updateParentCheckState(newCheckedChildren);
  };

  // 부모 체크박스 상태 업데이트
  const updateParentCheckState = (newCheckedChildren) => {
    const allChildrenChecked = Object.keys(groupedData).every((username) => {
      const allGrandchildrenChecked = groupedData[username].every((detail) => {
        const key = `${username}-${detail.cartItemId}`;
        return isCheckboxDisabled(username, detail.cartItemId) || checkedGrandchildren[key];
      });

      return !newCheckedChildren[username] ? newCheckedChildren[username] && allGrandchildrenChecked : newCheckedChildren[username] || allGrandchildrenChecked;
    });

    setCheckedParent(allChildrenChecked);
  };

  // 손자 체크박스의 비동기상태를 감시, 자식체크박스에 영향 & 그 반대도 영향
  useEffect(() => {
    const updateCheckboxStates = () => {
      const newCheckedGrandchildren = { ...checkedGrandchildren };
      const newCheckedChildren = { ...checkedChildren };
  
      Object.keys(groupedData).forEach((username) => {
        // 자식 체크박스의 상태를 결정할 변수를 선언
        let hasActiveGrandchildren = false;
  
        groupedData[username].forEach((detail) => {
          const key = `${username}-${detail.cartItemId}`;
          const isDisabled = isCheckboxDisabled(username, detail.cartItemId);
  
          if (isDisabled) {
            newCheckedGrandchildren[key] = false; // 비활성화된 손자 체크박스 해제
          } else {
            // 자식 체크박스의 상태가 true면 손자 체크박스도 true로 설정
            if (newCheckedChildren[username]) {
              newCheckedGrandchildren[key] = true;
            }
  
            if (!isDisabled) {
              hasActiveGrandchildren = true; // 활성화된 손자 체크박스가 있음
            }
          }
        });
  
        // 자식 체크박스 상태 업데이트
        if (!hasActiveGrandchildren) {
          newCheckedChildren[username] = false; // 모든 손자 체크박스가 비활성화된 경우 자식 체크박스도 해제
        } else {
          newCheckedChildren[username] = newCheckedChildren[username]; // 자식 체크박스 상태 유지
        }
      });
  
      // 상태 업데이트
      setCheckedChildren(newCheckedChildren);
      setCheckedGrandchildren(newCheckedGrandchildren);
    };
  
    updateCheckboxStates();
  }, [groupedData, checkedChildren]);
  
  //////////////////////
  //  리드타임  함수   //
  //////////////////////

  const getLongestCheckedLeadTime = (username) => {
    const data = groupedData[username] || [];

    // 체크된 항목들만 필터링하여 leadtime을 추출
    const checkedLeadTimes = data
      .filter((detail) => checkedGrandchildren[`${username}-${detail.cartItemId}`])
      .map((detail) => detail.leadtime);

    // 체크된 항목이 없는 경우 '-'를 반환
    if (checkedLeadTimes.length === 0) return '-';

    return Math.max(...checkedLeadTimes) + ' 일'; // 가장 긴 leadtime을 반환
  };

  //////////////////////
  //  통화 단위 함수   //
  //////////////////////

  // 통화 기호를 반환하는 헬퍼 함수
  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'KRW': return '₩';
      case 'USD': return '$';
      case 'JPY': return '¥';
      case 'EUR': return '€';
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

  // 카드안에서 총합계
  const getFormattedCardTotal = (username) => {
    const data = groupedData[username] || [];

    // 총합계 계산
    const totalAmount = data.reduce((total, detail) => {
      if (checkedGrandchildren[`${username}-${detail.cartItemId}`]) {
        const amount = detail.price * detail.quantity;
        return total + amount;
      }
      return total;
    }, 0);

    // 첫 번째 항목에서 통화 단위를 가져옴
    const currency = data[0]?.unit;
    return formatPrice(totalAmount, 1, currency);
  };

  // 전체 총합계
  const calculateTotalByCurrency = () => {
    const totals = {};

    Object.keys(groupedData).forEach((username) => {
      groupedData[username].forEach((detail) => {
        const key = `${username}-${detail.cartItemId}`;
        if (checkedGrandchildren[key]) { // 체크된 항목만 고려
          const currency = detail.unit;
          const amount = detail.price * detail.quantity;

          if (!totals[currency]) {
            totals[currency] = 0;
          }

          totals[currency] += amount;
        }
      });
    });

    return totals;
  };

  const totals = calculateTotalByCurrency();

  //////////////////////
  //  정보 추출 함수   //
  //////////////////////

  // 선택한 항목의 아이디 추출 
  const getItemIds = (cartItemId) => {
    return Object.keys(groupedData).flatMap((username) => {
      // 각 username 그룹에서 해당 cartItemId를 가진 항목을 필터링하여 추출
      return groupedData[username]
        .filter((detail) => detail.cartItemId === cartItemId)
        .map((detail) => detail.itemsId);
    });
  };

  // 체크된 항목의 아이디 추출
  const getcheckedItemIds = () => {
    return Object.keys(groupedData).flatMap((username) => {
      return groupedData[username]
        .filter((item) => checkedGrandchildren[`${username}-${item.cartItemId}`] || false)
        .map((item) => ({
          itemsId: item.itemsId,
        }));
    });
  };

  // 체크된 항목의 아이디와 수량을 추출
  const getCheckedItemsWithQuantity = () => {
    return Object.keys(groupedData).flatMap((username) => {
      return groupedData[username]
        .filter((item) => checkedGrandchildren[`${username}-${item.cartItemId}`] || false)
        .map((item) => ({
          itemsId: item.itemsId,
          quantity: item.quantity,
        }));
    });
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
          <FormControlLabel
            label="전체 선택"
            control={
              <Checkbox
                checked={checkedParent}
                onChange={handleParentChange}
                sx={{ color: 'white' }}
              />
            }
          />
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
        {Object.keys(groupedData).map((username) => (
          <div key={username} className="bg-[#2F2E38] text-white rounded-xl m-5 border border-[#69686F]">
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
              <FormControlLabel
                label={username}
                control={
                  <Checkbox
                    checked={checkedChildren[username] || false}
                    onChange={handleChildChange(username)}
                    disabled={isChildCheckboxDisabled(username)}
                    sx={{ color: 'white' }}
                  />
                }
              />
              <IconButton
                onClick={handleExpandClick(username)}
                aria-expanded={expanded[username] || false}
                aria-label="show more"
                className={`transition-transform ${expanded[username] ? 'rotate-180' : ''}`}
                sx={{ color: 'white', marginLeft: 'auto' }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
            <Collapse in={expanded[username]} timeout="auto" unmountOnExit>
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
                    {groupedData[username].map((detail) => {
                      return (
                        // <TableRow key={detail.cartItemId}  className={dayjs(detail.bestOrderDate).isBefore(dayjs(), 'day') ? 'activerow' : 'normalrow'}>
                        <TableRow key={detail.cartItemId} className={new Date(detail.bestOrderDate) <= dayjs() ? 'activerow' : 'normalrow'}>
                          <TableCell padding='checkbox' sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>
                            <Checkbox
                              checked={checkedGrandchildren[`${username}-${detail.cartItemId}`] || false}
                              onChange={handleGrandchildChange(username, detail.cartItemId, detail.quantity)}
                              disabled={isCheckboxDisabled(username, detail.cartItemId)}
                              sx={{ color: 'white' }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category1Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category2Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category3Name}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.itemName}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.quantity}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>
                            {formatPrice(detail.price, detail.quantity, detail.unit)}
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.bestOrderDate}({detail.leadtime}일)</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}><Button className='greenbutton'>과거 리드타임</Button></TableCell>
                          {/* <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}><IconButton onClick={()=>handledeleteitem(detail.cartItemId)} size='small' sx={{ color: 'white' }}><DeleteIcon fontSize="inherit" /></IconButton></TableCell> */}
                          <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}><IconButton onClick={() => handledeleteitem(detail.cartItemId)} size='small' sx={{ color: 'white' }}><ClearOutlinedIcon fontSize="inherit" /></IconButton></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className='flex justify-between p-2'>
                <h2>
                  주문 금액 : {getFormattedCardTotal(username)}
                </h2>
                <h2 className='text-[#FFCC6F] font-semibold'>
                  예상 리드타임 : {getLongestCheckedLeadTime(username)}
                </h2>
              </div>
            </Collapse>
          </div>
        ))}
        <div className='flex justify-between m-2 p-2'>
          <div className='flex'>
            <h2>총 주문금액: </h2>
            <div className=''>
              {Object.entries(totals).map(([currency, total]) => (
                <div key={currency} className='ml-2'>
                  <h2>
                    {getCurrencySymbol(currency)} {total.toLocaleString()}
                  </h2>
                </div>
              ))}
            </div>
          </div>
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
      <div className="bg-[#2F2E38] m-5 p-5 rounded-lg">

      </div>
    </div>
  );
}
