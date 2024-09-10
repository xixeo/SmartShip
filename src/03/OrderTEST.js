import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import './style.css';
import BasicDatePicker from './BasicDatePicker';
import dayjs from 'dayjs';

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

// Helper function: 그룹을 username별로 나누기
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

const Addbestdate = (basket, selectedDate) => {
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
  const [checkedParent, setCheckedParent] = useState({}); // 부모 체크박스 상태
  const [checkedChildren, setCheckedChildren] = useState({}); // 자식 체크박스 상태
  const [listdatas, setListdatas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem('selectedDate');
    return savedDate ? dayjs(savedDate) : dayjs().add(1, 'month');
  });

  const fetchorderlist = async (selectedDate) => {
    const basket = [
      {
        orderId: 1,
        username: 'AWS선박',
        alias: '유승호',
        orderDate: '2024-09-06',
        orderDetails: [
          {
            orderDetailId: 1,
            category1Name: '옷',
            category2Name: '바지',
            category3Name: '여성바지',
            itemName: '청바지',
            quantity: 10,
            price: 39900.0,
            unit: 'KRW',
            username: '민주샵',
            leadtime: 10,
          },
          {
            orderDetailId: 7,
            category1Name: '옷',
            category2Name: '바지',
            category3Name: '남성바지',
            itemName: '청바지',
            quantity: 5,
            price: 39900.0,
            unit: 'KRW',
            username: '민주샵',
            leadtime: 30,
          },
          {
            orderDetailId: 8,
            category1Name: '옷',
            category2Name: '바지',
            category3Name: '남성바지',
            itemName: '청바지',
            quantity: 10,
            price: 59900.0,
            unit: 'KRW',
            username: '수플린',
            leadtime: 5,
          },
        ],
      },
    ];
    try {
      const lists = Addbestdate(basket, selectedDate);
      setListdatas(lists);
    } catch (error) {
      console.error('Failed to fetch orderbasket:', error);
    }
  };

  useEffect(() => {
    fetchorderlist(selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  // username별로 그룹화된 데이터를 받아옴
  const orderDetails = listdatas[0]?.orderDetails || [];
  const groupedData = groupByUsername(orderDetails);

  // 전체 체크 상태 결정
  const handleParentChange = (event) => {
    const newCheckedParent = event.target.checked;
    const newCheckedChildren = { ...checkedChildren };

    Object.keys(groupedData).forEach((username) => {
      newCheckedChildren[username] = newCheckedParent; // 모든 자식 체크박스 상태 변경
    });

    setCheckedParent({ all: newCheckedParent });
    setCheckedChildren(newCheckedChildren);
  };

  const handleChildChange = (username, groupedData) => (event) => {
    const newCheckedChildren = { ...checkedChildren, [username]: event.target.checked };
    console.log('check',checkedChildren,username,event.target.checked)
    console.log('new',newCheckedChildren, groupedData);
    // 자식 체크박스들이 모두 선택되었는지 확인하여 부모 체크박스 상태 업데이트
    const allChecked = Object.values(newCheckedChildren).every(Boolean);
    console.log('allcheck',allChecked);
    setCheckedParent({ all: allChecked });
    setCheckedChildren(newCheckedChildren);
  };

  const handleExpandClick = (username) => () => {
    setExpanded({
      ...expanded,
      [username]: !expanded[username],
    });
  };

  const handleExpandAll = () => {
    const newExpanded = {};
    Object.keys(groupedData).forEach((username) => {
      newExpanded[username] = true;
    });
    setExpanded(newExpanded);
  };

  const handleCollapseAll = () => {
    const newExpanded = {};
    Object.keys(groupedData).forEach((username) => {
      newExpanded[username] = false;
    });
    setExpanded(newExpanded);
  };

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

  return (
    <div className="flex-col text-white">
      <div className="w-full flex justify-between">
        <h2 className="text-xl font-semibold text-white mb-4">장바구니</h2>
      </div>
      <div className="bg-[#2F2E38] m-5 p-5 rounded-lg">
        <div className='flex justify-end m-2 p-2'>
          <Button
            variant="contained"
            onClick={handleExpandAll}
            style={{ marginRight: '10px' }}
            sx={{ bgcolor: '#43C5FE' }}
          >
            전체 열기
          </Button>
          <Button variant="contained" onClick={handleCollapseAll} sx={{ bgcolor: '#43C5FE' }}>
            전체 닫기
          </Button>
        </div>
        <div className='flex justify-between m-2 p-2'>
          {/* 부모 체크박스 */}
          <FormControlLabel
            label="전체 선택"
            control={
              <Checkbox
                checked={checkedParent.all || false}
                onChange={handleParentChange}
                sx={{ color: 'white' }}
              />
            }
          />
          <BasicDatePicker onDateAccept={(date) => setSelectedDate(date)} />
        </div>
        {Object.keys(groupedData).map((username) => (
          <div key={username} className="bg-[#2F2E38] text-white rounded-xl m-5 border ">
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
              <FormControlLabel
                label={username}
                control={
                  <Checkbox
                    checked={checkedChildren[username] || false}
                    onChange={handleChildChange(username, groupedData[username])}
                    sx={{ color: 'white' }}
                  />
                }
                sx={{ color: 'white' }}
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
                <Table aria-label="simple table">
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
                      <TableCell align="center"></TableCell>
                      <TableCell align="center">Category1 Name</TableCell>
                      <TableCell align="center">Category2 Name</TableCell>
                      <TableCell align="center">Category3 Name</TableCell>
                      <TableCell align="center">Item Name</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">BestOrderDate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedData[username].map((detail) => (
                      <TableRow
                      key={detail.orderDetailId}
                      sx={{}}
                      >
                        <TableCell padding='checkbox' sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>
                          <Checkbox 
                          checked={checkedChildren[username]?true:false}
                          onChange={handleChildChange(orderDetailId)}
                          sx={{color:'white'}} /></TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category1Name}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category2Name}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category3Name}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.itemName}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.quantity}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>
                          {formatPrice(detail.price, detail.quantity, detail.unit)}
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.bestOrderDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className='p-2'>
                <h2> 주문 금액 :  {groupedData[username].reduce((total, detail) => {
                                  return total + (detail.unit === 'KRW' ? detail.price * detail.quantity :
                                                  detail.unit === 'USD' ? detail.price * detail.quantity :
                                                  detail.unit === 'JPY' ? detail.price * detail.quantity :
                                                  detail.unit === 'EUR' ? detail.price * detail.quantity :
                                                  detail.price * detail.quantity);
                                }, 0).toLocaleString()}</h2>
              </div>
            </Collapse>
          </div>
        ))}
        <div className='flex justify-between m-2 p-2'>
          <h2>총 합계: 화폐 어떻게 할지 정해야해,,,</h2>
          <div>
          <button className='rounded-lg bg-[#43C5FE] m-1 p-2 text-white font-bold'>구매신청</button>
          <button className='rounded-lg bg-[#43C5FE] m-1 p-2 text-white font-bold'>삭제하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
