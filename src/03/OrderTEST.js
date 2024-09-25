import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableHead, TableRow, TableCell, Box, Button, Checkbox, Modal, Collapse } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Delete as DeleteIcon, ClearOutlined as ClearOutlinedIcon, ExpandMore as ExpandMoreIcon, CheckBox } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import './Order.scss';
import BasicDatePicker from './BasicDatePicker';
import dayjs from 'dayjs';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Modal2 from '../Compo/Modal2';

export default function OrderTest() {
  const [listdatas, setListdatas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    () => {
      const savedDate = localStorage.getItem('selectedDate');
      return savedDate ? dayjs(savedDate) : dayjs().add(1, ' onth');
    }
  );
  const [deleteopen, setDeleteOpen] = useState(false);
  const [perchasopen, setPerchasOpen] = useState(false);


  const token = localStorage.getItem('token');

  //  ==================
  // | 장바구니 get api |
  //  ==================

  const fetchorderlist = async (selectedDate) => {
    try {
      const response = await fetch(`getCart/${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error('orderbasket response was not ok');
      }
      const orderbasket = await response.json();

      console.log(orderbasket);

      // orderDetails를 배열로 설정
      const basket = {
        orderId: orderbasket.cartItem.cartId,
        createdAt: orderbasket.cartItem.createdAt,
        orderDetails: orderbasket.cartItem.cartItems || [], // cartItems가 없으면 빈 배열
      };

      setListdatas(basket.orderDetails); // orderDetails를 listdatas에 설정
    } catch (error) {
      console.error('Failed to fetch orderbasket:', error);
    }
  };

  //////////////////////
  //  날짜 관련 함수   //
  //////////////////////

  const orderdate = selectedDate.format('YYYY-MM-DD');

  useEffect(() => {
    fetchorderlist(selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('selectedDate', orderdate);
  }, [selectedDate]);

  useEffect(() => {
    // 새로고침 시 localStorage 비우기
    localStorage.removeItem('selectedDate');
  }, []);

  useEffect(() => {
    setFilteredData(listdatas);
  }, [listdatas]);

  //////////////////////
  //  수량 변경 함수   //
  //////////////////////

  const handleQuantityChange = (itemsId, newQuantity) => {
    setListdatas(prevList =>
      prevList.map(item =>
        item.itemsId === itemsId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  //////////////////////
  //  정보 추출 함수   //
  //////////////////////

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    const allItemIds = isChecked
      ? new Set((filteredData.length > 0 ? filteredData : listdatas).map(item => item.itemsId))
      : new Set();

    setSelectedItems(allItemIds);
    setSelectAll(isChecked);
  };

  // 전체 선택 체크박스의 체크 상태를 업데이트하는 함수
  const isAllSelected = () => {
    return selectedItems.size > 0 && selectedItems.size === (filteredData.length > 0 ? filteredData.length : listdatas.length);
  };


  // 선택한 항목의 아이템아이디 추출 
  const getItemIds = (cartItemId) => {
    return listdatas
      .filter((detail) => detail.cartItemId === cartItemId)
      .map((detail) => detail.itemsId);
  };

  // 체크된 항목의 아이디와 수량을 추출
  const getCheckedItemsWithQuantity = () => {
    return Array.from(selectedItems).map(itemId => {
      const item = listdatas.find(detail => detail.itemsId === itemId);
      return {
        itemId,
        quantity: item.quantity,
      };
    });
  };

  //////////////////////
  //  버튼 관련 함수   //
  //////////////////////

  // 검색 처리 함수
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(listdatas);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      // 검색 쿼리가 비어 있으면 전체 데이터 표시
      setFilteredData(listdatas);
    } else {
      const filtered = listdatas.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // X 버튼 핸들러
  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredData(listdatas);
  };

  /////////////////////////////
  //  페이지네이션 관련 함수   //
  /////////////////////////////

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 현재 페이지에 따라 표시할 데이터의 인덱스를 계산하는 함수
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  //////////////////
  // currentItem2 //
  //////////////////

   // 동일한 category1Name, category2Name, category3Name, itemName, part1을 가진 항목 중 itemId가 작은 항목만 추출
   const currentItem2 = currentItems.reduce((acc, item) => {
    const key = `${item.category1Name}-${item.category2Name}-${item.category3Name}-${item.itemName}-${item.part1}`;
    
    // key에 해당하는 항목이 없다면 현재 item을 추가
    if (!acc[key]) {
      acc[key] = item;
    } else if (item.itemId < acc[key].itemId) {
      // 이미 저장된 항목보다 itemId가 작으면 업데이트
      acc[key] = item;
    }
    
    return acc;
  }, {});

  // currentItem2는 객체이므로 배열로 변환
  const currentItem2Array = Object.values(currentItem2);

  // 페이지네이션 버튼함수
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDelete = async () => {
    const itemsToDelete = Array.from(selectedItems);
    if (itemsToDelete.length === 0) {
      alert('삭제할 항목을 선택해 주세요.');
      return;
    }

    try {
      const response = await fetch(`delItem`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemsToDelete), // 수정된 부분
      });

      if (!response.ok) {
        throw new Error('orderbasket delete item response was not ok');
      }

      setSelectedItems(new Set()); // 선택된 항목 초기화
      setDeleteOpen(false);

      // 데이터 다시 가져오기
      fetchorderlist(selectedDate.format('YYYY-MM-DD'));
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteitem = async (cartItemId) => {
    const selectitemsid = getItemIds(cartItemId);
    console.log('selectitemid', selectitemsid);

    if (selectitemsid.length === 0) {
      alert('삭제할 항목이 없습니다.');
      return;
    }

    try {
      const response = await fetch(`delItem`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectitemsid),
      });

      if (!response.ok) {
        throw new Error('orderbasket delete item response was not ok');
      }

      // 데이터 다시 가져오기
      fetchorderlist(selectedDate.format('YYYY-MM-DD'));
    } catch (error) {
      console.log(error);
    }
  };

  // 비고
  const [memo, setMemo] = useState(''); // 비고 상태 추가


  // 구매버튼
  const handlePerchase = async (orderdate) => {
    const checkitemidandquantity = getCheckedItemsWithQuantity();
    const purchaseData = {
      cartItems: checkitemidandquantity.map(item => ({
        itemsId: item.itemId,
        quantity: item.quantity
      })),
      memo: memo
    };

    try {
      console.log('Sending purchase data:', purchaseData);
      const response = await fetch(`saveToOrder/${orderdate}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchaseData),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error('주문 저장 실패:', errorText);
        throw new Error('주문 장바구니 구매 아이템 응답이 올바르지 않음');
      }

      setPerchasOpen(false);
      console.log('주문이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.log('구매 중 오류 발생:', error);
    }
  };

  return (
    <div className="list-table-root flex flex-col p-6">
      <div className="text-xl font-semibold text-white mb-4">장바구니</div>
      <div className="flex-col text-white OrderBasket">
        <div className="bg-[#2F2E38] m-5 p-5 rounded-lg">
          <div className='flex items-center m-2 mb-5 gap-7'>
            <h4 className='m-0'>창고 출고 예정일</h4>
            <BasicDatePicker onDateAccept={(date) => setSelectedDate(date)} />
          </div>
          <div className='flex mr-5 ml-5 items-center justify-between'>
            <div className='flex items-center'>
              <div className='items-center ml-0.5'>물품목록</div>
              <div className='ml-16 gap-4 flex items-center'>
                <TextField
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="물품명 검색"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'white', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      searchQuery && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClearSearch}
                            edge="end"
                            sx={{ color: 'white' }}
                          >
                            <ClearOutlinedIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    ),
                  }}
                  className='custom-textfield items-center'
                />
                <Button onClick={handleSearch} variant="contained" className="bluebutton items-center">검색</Button>
              </div>
            </div>
            <div className='flex justify-between'>
              <Button className='bluebutton items-end' onClick={() => setDeleteOpen(true)} >선택삭제</Button>
              <Modal2
                open={deleteopen}
                setOpen={setDeleteOpen}
                title="정말 삭제하시겠습니까?"
                onConfirm={handleDelete}
              />
            </div>
          </div>
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
                  <TableCell padding='checkbox'><Checkbox
                    checked={isAllSelected()} // 여기서 업데이트된 체크 상태 사용
                    onChange={handleSelectAllChange}
                    sx={{ color: 'white', width: '80px' }}
                  /></TableCell>
                  <TableCell align="center">Category 1</TableCell>
                  <TableCell align="center">Category 2</TableCell>
                  <TableCell align="center">Category 3</TableCell>
                  <TableCell align="center">물품명</TableCell>
                  <TableCell align="center">part 1</TableCell>
                  <TableCell align="center">수량</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItem2Array.map((detail) => {
                  return (
                    <TableRow key={detail.itemsId}>
                      <TableCell padding='checkbox' sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none', width: '5%' }}>
                        <Checkbox
                          checked={selectedItems.has(detail.itemsId)}
                          onChange={() => handleCheckboxChange(detail.itemsId)}
                          sx={{ width: '80px' }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none', width: '15%' }}>{detail.category1Name}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none', width: '15%' }}>{detail.category2Name}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none', width: '15%' }}>{detail.category3Name}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none', width: '15%' }}>{detail.itemName}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none', width: '15%' }}>{detail.part1}</TableCell>
                      <TableCell align="center">
                        <TextField
                          className="custom-orderquantity"
                          type="number"
                          value={detail.quantity}
                          onChange={(e) => handleQuantityChange(detail.itemsId, e.target.value)}
                          inputProps={{ min: 1 }} // 최소값 1 설정
                          sx={{ width: '10%' }} // Set fixed width
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}><IconButton onClick={() => handledeleteitem(detail.cartItemId)} size='small' sx={{ color: 'white' }}><ClearOutlinedIcon fontSize="inherit" /></IconButton></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="pagination-container">
            <Pagination
              count={Math.ceil(filteredData.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              shape="rounded"
            />
          </div>
          <div>
            <Select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(e.target.value);
                setCurrentPage(1);
              }}
              className="select-custom ml-5"
            >
              {[5, 10, 15].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select></div>

          <div className='m-5'>
            <div className='mb-3'>비고</div>
            <TextField
              className='memo-textfield'
              multiline
              rows={3}  // 기본 3줄
              maxRows={3}  // 최대 3줄까지 보여주고 스크롤
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
          <div className='flex justify-end m-5'>
            <Button className='bluebutton2' onClick={() => setPerchasOpen(true)}>구매신청</Button>
            <Modal2
              open={perchasopen}
              setOpen={setPerchasOpen}
              title="주문하시겠습니까?"
              onConfirm={() => handlePerchase(orderdate)}
              orderDate={orderdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
