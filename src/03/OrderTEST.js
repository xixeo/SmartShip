import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, Select, MenuItem, InputAdornment, TextField, Button, Box, IconButton, Typography, Collapse } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { ko } from 'date-fns/locale'

function createData(category1_name, category2_name, item_name, part1, part2, price, unit, quantity, supplier_name, pre_leadtime_id) {
  return { category1_name, category2_name, item_name, part1, part2, price, unit, quantity, supplier_name, pre_leadtime_id };
}

// 초기 데이터
const initialRows = [
  createData('식품', '과일', '수박', '012526', '', '180', 'EUR', 100, '쿠팡', 1),
  createData('음료', '탄산음료', '콜라', '015789', '321456', '120', 'USD', 200, '이마트', 2),
  createData('음료', '탄산음료', '사이다', '015782', '321457', '120', 'KRW', 250, '이마트', 3),
  createData('음료', '커피', '', '015783', '321458', '170', 'KRW', 100, '롯데슈퍼', 3),
  createData('간식', '과자', '포테이토칩', '019876', '654321', '1500', 'JPY', 300, '롯데마트', 4),
  createData('유제품', '우유', '서울우유', '021345', '987654', '200', 'KRW', 50, '홈플러스', 5),
  createData('건강식품', '비타민', '비타민C', '023456', '789012', '250', 'EUR', 70, '네이버쇼핑', 6),
  createData('과일', '사과', '후지사과', '025678', '345678', '220', 'USD', 100, '마켓컬리', 7),
];

// 테이블 헤더 정의
const headCells = [
  { id: 'category1_name', label: 'Category 1', width: '13%' },
  { id: 'category2_name', label: 'Category 2', width: '13%' },
  { id: 'item_name', label: '물품명', width: '14%' },
  { id: 'price', label: '단가', width: '10%' },
  { id: 'quantity', label: '수량', width: '10%' },
  { id: 'price*quantity', label: '금액', width: '10%' },
  { id: 'optimalOrderDate', label: '최적 발주일', width: '10%' },
  { id: 'pre_leadtime_id', label: '과거 리드타임', width: '9%' },
];

// null값 처리 & 가격 단위 구분 함수
const formatCellValue = (value, unit) => {
  if (value == null || value === '') {
    return '-';
  }

  if (unit) {
    switch (unit) {
      case 'USD':
        return `$ ${value}`;
      case 'KRW':
        return `₩ ${value}`;
      case 'EUR':
        return `€ ${value}`;
      case 'JPY':
        return `¥ ${value}`;
      default:
        return value; // 기본값
    }
  }

  return value;
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, '&:hover': { backgroundColor: '#f5f5f5' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.category1_name}</TableCell>
        <TableCell>{row.category2_name}</TableCell>
        <TableCell>{row.item_name}</TableCell>
        <TableCell align="right">{formatCellValue(row.price, row.unit)}</TableCell>
        <TableCell align="right">{row.quantity}</TableCell>
        <TableCell align="right">{formatCellValue(row.price * row.quantity, row.unit)}</TableCell>
        <TableCell align="right">{row.optimalOrderDate || '-'}</TableCell>
        <TableCell align="right">{row.pre_leadtime_id}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history && row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    category1_name: PropTypes.string.isRequired,
    category2_name: PropTypes.string.isRequired,
    item_name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    unit: PropTypes.string,
    optimalOrderDate: PropTypes.string,
    pre_leadtime_id: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

function CustomCaption({ date }) {
  const month = date;
  const year = month.getFullYear();
  const monthName = month.toLocaleString('ko-KR', { month: 'long' });
  return <div>{`${year}년 ${monthName}`}</div>;
}

function OrderTEST() {
  const [selected, setSelected] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // rows 변수 추가
  const rows = initialRows;

  return (
    <div className='p-6'>
      <div className="text-xl font-semibold text-white mb-4">발주 스케줄링</div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4 relative">
          <Typography className="text-white" sx={{ mr: 2 }}>창고 출고 예정일:</Typography>
          <TextField
            className='text-white'
            value={selected ? selected.toLocaleDateString() : ''}
            onClick={() => setCalendarOpen(!calendarOpen)}
            InputProps={{
              endAdornment: (
                <IconButton position="end" onClick={() => setCalendarOpen(!calendarOpen)}>
                  <CalendarTodayIcon sx={{ color: 'white' }} />
                </IconButton>
              ),
            }}
            sx={{
              height: 40,
              backgroundColor: 'transparent',
              '& .MuiInputBase-root': {
                color: 'white', 
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', 
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', 
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', 
              },
              '& .MuiInputBase-input': {
                color: 'white', 
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
            }}
            readOnly
            variant="outlined"
            size="small"
          />
          {calendarOpen && (
            <Box sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 300, 
              transform: 'translateY(4px)', // 아이콘 바로 아래에 띄우기 위해 변환
              bgcolor: 'white', 
              borderRadius: 1, 
              boxShadow: 3,
              zIndex: 1,
              p: 1,
              width: 'fit-content', 
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton 
                  size="small" 
                  onClick={() => setCalendarOpen(false)}
                  sx={{ color: 'black' }}
                >
                  <CloseIcon/>
                </IconButton>
              </Box>
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                components={{
                  Caption: CustomCaption, // 커스텀 캡션 적용
                }}
                locale={{
                  formatCaption: (date) => date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                  }),
                  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                  firstDayOfWeek: 0,
                }}
                footer={
                  selected ? `[ ${selected.toLocaleDateString()} 창고 출고 예정 ]` : ""
                }
              />
            </Box>
          )}
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead
            sx={{ 
              backgroundColor: '#f0f0f0', 
              '& th': { fontWeight: 'bold' } 
            }}>
            <TableRow>
              <TableCell />
              <TableCell align="center">Category 1</TableCell>
              <TableCell align="center">Category 2</TableCell>
              <TableCell align="center">물품명</TableCell>
              <TableCell align="center">단가</TableCell>
              <TableCell align="center">수량</TableCell>
              <TableCell align="center">금액</TableCell>
              <TableCell align="center">최적 발주일</TableCell>
              <TableCell align="center">과거 리드타임</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.item_name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default OrderTEST;
