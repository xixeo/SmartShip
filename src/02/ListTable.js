// TODO : category2 placeholder 흰색으로 처음부터 띄우기, 검색란 hover 수정

import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button,Paper, TextField, InputAdornment, Select, MenuItem, Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import RegisterModal from "./RegisterModal";

// 데이터 생성 함수
function createData(category1, category2, itemName, partNo1, partNo2, price, supplier, leadTime) {
  return { category1, category2, itemName, partNo1, partNo2, price, supplier, leadTime };
}

// 초기 데이터
const initialRows = [
  createData('식품', '과일', '수박', '012526', '', '$180', '쿠팡', '1일'),
  createData('음료', '탄산음료', '콜라', '015789', '321456', '$120', '이마트', '2일'),
  createData('음료', '탄산음료', '사이다', '015782', '321457', '$120', '이마트', '2일'),
  createData('음료', '커피', '', '015783', '321458', '$120', '이마트', '3일'),
  createData('간식', '과자', '포테이토칩', '019876', '654321', '$150', '롯데마트', '4일'),
  createData('유제품', '우유', '서울우유', '021345', '987654', '$200', '홈플러스', '5일'),
  createData('건강식품', '비타민', '비타민C', '023456', '789012', '$250', '네이버쇼핑', '6일'),
  createData('과일', '사과', '후지사과', '025678', '345678', '$220', '마켓컬리', '7일'),
];

// 테이블 헤더 정의
const headCells = [
  { id: 'category1', numeric: false, disablePadding: true, label: 'Category 1', width: '13%' },
  { id: 'category2', numeric: false, disablePadding: false, label: 'Category 2', width: '13%' },
  { id: 'itemName', numeric: false, disablePadding: false, label: '물품명', width: '14%' },
  { id: 'partNo1', numeric: true, disablePadding: false, label: 'Part No. 1', width: '13%' },
  { id: 'partNo2', numeric: true, disablePadding: false, label: 'Part No. 2', width: '13%' },
  { id: 'price', numeric: true, disablePadding: false, label: '가격', width: '10%' },
  { id: 'supplier', numeric: false, disablePadding: false, label: '발주처', width: '10%' },
  { id: 'leadTime', numeric: false, disablePadding: false, label: '리드타임', width: '9%' },
];

// 셀 값 포맷팅 함수
const formatCellValue = (value) => {
  return value == null || value === '' ? '-' : value;
};

// 테이블 헤더 컴포넌트
function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount, allRowsSelected }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" style={{ width: '5%' }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={allRowsSelected}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            style={{ width: headCell.width }}
            className="cursor-pointer"
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  allRowsSelected: PropTypes.bool.isRequired,
};

// 메인 테이블 컴포넌트
function ListTable() {
  const [selected, setSelected] = useState(new Set()); // 선택된 항목 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const [rowsPerPage, setRowsPerPage] = useState(5); // 페이지당 항목 수
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리
  const [category1, setCategory1] = useState(''); // Category 1 필터
  const [category2, setCategory2] = useState(''); // Category 2 필터
  const [modalOpen, setModalOpen] = useState(false); // 모달 표시 상태

  // Category 1의 고유 값 리스트
  const category1Options = [...new Set(initialRows.map((row) => row.category1))];

  // Category 2의 고유 값 리스트 (선택된 Category 1에 따라 필터링됨)
  const category2Options = useMemo(() => {
    return [...new Set(initialRows.filter((row) => row.category1 === category1).map((row) => row.category2))];
  }, [category1]);

  // 필터링된 행 데이터
  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      const matchesCategory1 = category1 ? row.category1 === category1 : true;
      const matchesCategory2 = category2 ? row.category2 === category2 : true;
      const matchesSearchQuery = searchQuery
        ? row.category1.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.category2.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.partNo1.includes(searchQuery) ||
          row.partNo2.includes(searchQuery) ||
          row.price.includes(searchQuery) ||
          row.supplier.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesCategory1 && matchesCategory2 && matchesSearchQuery;
    });
  }, [searchQuery, category1, category2]);

  // 검색, 카테고리, 페이지 크기 변경 시 페이지를 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category1, category2, rowsPerPage]);

 // 전체 선택 핸들러
const handleSelectAllClick = (event) => {
  if (event.target.checked) {
    const newSelected = new Set(filteredRows.map((row) => row.itemName));
    setSelected((prevSelected) => new Set([...prevSelected, ...newSelected]));
  } else {
    setSelected((prevSelected) => {
      const newSelected = new Set(
        [...prevSelected].filter(item => !filteredRows.some(row => row.itemName === item))
      );
      return newSelected;
    });
  }
};

  // 행 클릭 핸들러
  const handleClick = (event, itemName) => {
    const newSelected = new Set(selected);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelected(newSelected);
  };

  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 페이지당 항목 수 변경 핸들러
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Category 1 변경 핸들러
  const handleCategory1Change = (event) => {
    setCategory1(event.target.value);
    setCategory2('');
  };

  // Category 2 변경 핸들러
  const handleCategory2Change = (event) => {
    setCategory2(event.target.value);
  };

  // 항목이 선택되었는지 여부 확인
  const isSelected = (itemName) => selected.has(itemName);

  // 빈 행 계산
  const emptyRows = useMemo(
    () => (page > 1 ? Math.max(0, (page - 1) * rowsPerPage + rowsPerPage - filteredRows.length) : 0),
    [page, rowsPerPage, filteredRows.length]
  );

  // 총 페이지 수 계산
  const totalPages = useMemo(() => Math.ceil(filteredRows.length / rowsPerPage), [filteredRows.length, rowsPerPage]);

  // 모든 행이 선택되었는지 여부 확인
  const allRowsSelected = useMemo(() => {
    return filteredRows.length > 0 && filteredRows.every(row => selected.has(row.itemName));
  }, [filteredRows, selected]);

  // 모달 열기 핸들러
  const openModal = () => setModalOpen(true);

  // 모달 닫기 핸들러
  const closeModal = () => setModalOpen(false);

  return (
    <div className="p-6">
      <div className="text-xl font-semibold text-white mb-4">선용품 리스트</div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">

{/* Category 1 선택 필터 */}
<Select
  value={category1}
  onChange={handleCategory1Change}
  displayEmpty
  className="bg-transparent rounded-md"
  sx={{
    minWidth: 120,
    backgroundColor: 'transparent', // Background color transparent
    '& .MuiSelect-select': {
      color: 'white', // Text color white
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Border color white
    },
    '& .MuiSvgIcon-root': {
      color: 'white', // Icon color white
    },
    // Remove hover effect
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Keep border color white on hover
    },
  }}
>
  <MenuItem value="">
    <em>Category 1</em>
  </MenuItem>
  {category1Options.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ))}
</Select>

{/* Category 2 선택 필터 */}
<Select
  value={category2}
  onChange={handleCategory2Change}
  displayEmpty
  className="bg-transparent rounded-md"
  disabled={!category1} // 'Category 1'이 선택되지 않았을 때만 비활성화
  sx={{
    minWidth: 120,
    backgroundColor: 'transparent', // Background color transparent
    '& .MuiSelect-select': {
      color: 'white', // Text color white
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Border color white
    },
    '& .MuiSvgIcon-root': {
      color: 'white', // Icon color white
    },
    // Remove hover effect
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Keep border color white on hover
    },
    // Disabled state styling
    '&.Mui-disabled': {
      '& .MuiSelect-select': {
        color: 'white', // Text color white when disabled
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white', // Border color white when disabled
      },
    },
  }}
>
  <MenuItem value="" sx={{ color: 'white' }}>
    <em>Category 2</em>
  </MenuItem>
  {category2Options.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ))}
</Select>

{/* 검색 필드 */}
<TextField
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="검색"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon sx={{ color: 'white' }} />
      </InputAdornment>
    ),
  }}
  className="bg-transparent rounded-md"
  sx={{
    flexGrow: 1,
    maxWidth: 300,
    backgroundColor: 'transparent',
    '& .MuiInputBase-input': {
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
    }
  }}
/>

{/* 페이지당 항목 수 선택 */}
<Select
  value={rowsPerPage}
  onChange={handleChangeRowsPerPage}
  className="bg-transparent rounded-md"
  sx={{
    minWidth: 120,
    backgroundColor: 'transparent', // Background color transparent
    '& .MuiSelect-select': {
      color: 'white', // Text color white
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Border color white
    },
    '& .MuiSvgIcon-root': {
      color: 'white', // Icon color white
    },
    // Remove hover effect
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Keep border color white on hover
    },
  }}
>
  {[5, 10, 15].map((option) => (
    <MenuItem key={option} value={option}>
      페이지당 항목수 : {option}
    </MenuItem>
  ))}
</Select>
</div>
        {/* 새상품 등록 버튼 */}
        <Button
          variant="contained"
          color="primary"
          className="text-white bg-indigo-400"
          onClick={openModal} // 버튼 클릭 시 모달 열기
        >
          새상품 등록
        </Button>
      </div>

      <Box className="bg-white rounded-lg shadow-md">
        <TableContainer component={Paper}>
          <Table>
            <EnhancedTableHead
              numSelected={selected.size}
              onSelectAllClick={handleSelectAllClick}
              rowCount={filteredRows.length}
              allRowsSelected={allRowsSelected}
            />
            <TableBody>
              {/* 페이지네이션에 따른 행 데이터 표시 */}
              {filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.itemName);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.itemName)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.itemName}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox" style={{ width: '5%' }}>
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
                      {formatCellValue(row.category1)}
                    </TableCell>
                    <TableCell align="center">{formatCellValue(row.category2)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.itemName)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.partNo1)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.partNo2)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.price)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.supplier)}</TableCell>
                    <TableCell align="center" style={{ width: '9%' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                      >
                        리드타임
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          {/* 페이지네이션 컴포넌트 */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Box>
      </Box>
      <div className="flex justify-end gap-4 mt-6">
        {/* 발주하기 버튼 */}
        <Button variant="contained" color="primary" className="text-white bg-indigo-400">
          발주하기
        </Button>
      </div>
     {/* 새상품 등록 모달 */}
     <RegisterModal open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
}

export default ListTable;
