import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, TextField, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ListTable.scss';

// 데이터 생성 함수
function createData(category1Name, category2Name, category3Name, itemName, price, unit, supplierName, leadtime) {
  return { category1Name, category2Name, category3Name, itemName, price, unit, supplierName, leadtime };
}

const initialRows = [
  createData('식품', '과일', '수박/참외', '수박', 18, 'EUR', '쿠팡', 1),
  createData('음료', '탄산음료', '콜라', '코카콜라', 12, 'USD', '이마트', 1),
  createData('음료', '탄산음료', '사이다', '칠성사이다', 1200, 'KRW', '이마트', 1),
  createData('음료', '커피', '커피', '아메리카노', 1700, 'KRW', '롯데슈퍼', 1),
  createData('간식', '과자', '포테이토칩', '스윙칩', 150, 'JPY', '롯데마트', 1),
  createData('유제품', '우유', '서울우유', '저지방 서울우유', 200, 'KRW', '홈플러스', 1),
  createData('건강식품', '비타민', '비타민', '비타민C', 25, 'EUR', '네이버쇼핑', 1),
  createData('과일', '사과', '후지사과', '유기농 후지사과', 2, 'USD', '마켓컬리', 1),
];

// 테이블 헤더 정의
const headCells = [
  { id: 'category1Name', label: 'Category 1', width: '14%' },
  { id: 'category2Name', label: 'Category 2', width: '14%' },
  { id: 'category3Name', label: 'Category 3', width: '14%' },
  { id: 'itemName', label: '물품명', width: '14%' },
  { id: 'calculateTotalPrice', label: '가격', width: '10%' },
  { id: 'quantity', label: '수량', width: '10%' },
  { id: 'supplierName', label: '판매자', width: '10%' },
  { id: 'leadtime', label: '', width: '9%' },
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
        return value;
    }
  }

  return value;
};

// 메인 테이블 컴포넌트
function ListTableTest() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(initialRows.map(row => ({ ...row, quantity: 1 })));
  const [selected, setSelected] = useState(new Set()); // 선택된 항목 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const rowsPerPage = 5; // Number of rows per page

  // 수량 변경 핸들러
  const handleQuantityChange = (itemName, value) => {
    const quantity = Math.max(1, parseInt(value, 10) || 1); // 수량을 숫자로 변환
    setRows(prevItems =>
      prevItems.map(row =>
        row.itemName === itemName ? { ...row, quantity } : row
      )
    );
  };

  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 현재 페이지의 데이터
  const paginatedRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  return (
    <div className="list-table-root flex flex-col p-6">
      <div className="bg-custom">
        <TableContainer component={Paper} sx={{ minHeight: '400px', width: '100%' }}>
          <Table>
            <TableBody>
              {paginatedRows.map((row) => {
                const price = parseFloat(row.price) || 0;
                const quantity = parseInt(row.quantity, 10) || 1;
                const totalPrice = price * quantity;

                return (
                  <TableRow
                    hover
                    key={row.itemName}
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell padding="checkbox" style={{ width: '5%' }}>
                    </TableCell>
                    <TableCell align="center" style={{ width: '14%' }}>
                      {formatCellValue(row.category1Name)}
                    </TableCell>
                    <TableCell align="center" style={{ width: '14%' }}>
                      {formatCellValue(row.category2Name)}
                    </TableCell>
                    <TableCell align="center" style={{ width: '14%' }}>
                      {formatCellValue(row.category3Name)}
                    </TableCell>
                    <TableCell align="center" style={{ width: '14%' }}>
                      {formatCellValue(row.itemName)}
                    </TableCell>
                    <TableCell align="center" style={{ width: '10%' }}>
                      {formatCellValue(totalPrice, row.unit)}
                    </TableCell>
                    <TableCell align="center" style={{ width: '10%' }}>
                      <TextField
                        type="number"
                        inputProps={{ min: 1 }}
                        value={row.quantity}
                        onChange={(e) => handleQuantityChange(row.itemName, e.target.value)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center" style={{ width: '10%' }}>
                      {formatCellValue(row.supplierName)}
                    </TableCell>
                    <TableCell align="center" style={{ width: '9%' }}>
                      {formatCellValue(row.leadtime)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="pagination-container">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
}

export default ListTableTest;