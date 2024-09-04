// TODO: 년월 출력형식 변경, 요일도 알파벳3개 뜨도록

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, Select, MenuItem, InputAdornment, TextField, Button, Box, IconButton, Typography, Collapse } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

function createData(name, calories, fat, carbs, protein, price) {
  return { name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

// EnhancedTableHead.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   rowCount: PropTypes.number.isRequired,
//   allRowsSelected: PropTypes.bool.isRequired,
// };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, '&:hover': { backgroundColor: '#f5f5f5' } }}>
      <TableCell padding="checkbox" style={{ width: '5%' }}>
          {/* <Checkbox
            color="default"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={allRowsSelected}
            onChange={onSelectAllClick}
          /> */}
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                  {row.history.map((historyRow) => (
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
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

// 년, 월 형식 변경
function CustomCaption({ month }) {
  const year = month.getFullYear();
  const monthName = month.toLocaleString('ko-KR', { month: 'long' });
  return <div>{`${year}년 ${monthName}`}</div>;
}

function Order() {
  const [selected, setSelected] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

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
                  Caption: CustomCaption, 
                }}
                locale={{
                  formatCaption: (date) => date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                  }),
                  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                  firstDayOfWeek: 0, // Sunday as the first day
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
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Order;
