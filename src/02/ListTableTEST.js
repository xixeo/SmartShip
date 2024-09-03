// restAPI 추가하기전

import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Paper, TextField, InputAdornment, Select, MenuItem, Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import RegisterModal from "./RegisterModal";
import LeadTimeModal from './LeadTimeModal';
import GradientButton from '../Compo/GradientButton'
import { useNavigate } from 'react-router-dom';

// 데이터 생성 함수
function createData(category_name, category2_name, item_name, part1, part2, price, unit, supplier_name, leadtime) {
  return { category_name, category2_name, item_name, part1, part2, price, unit, supplier_name, leadtime };
}

// 초기 데이터
const initialRows = [
  createData('식품', '과일', '수박', '012526', '', '180', 'EUR', '쿠팡', '1일'),
  createData('음료', '탄산음료', '콜라', '015789', '321456', '120', 'USD', '이마트', '2일'),
  createData('음료', '탄산음료', '사이다', '015782', '321457', '120', 'KRW', '이마트', '2일'),
  createData('음료', '커피', '', '015783', '321458', '170', 'KRW', '롯데슈퍼', '3일'),
  createData('간식', '과자', '포테이토칩', '019876', '654321', '1500', 'JPY', '롯데마트', '4일'),
  createData('유제품', '우유', '서울우유', '021345', '987654', '200', 'KRW', '홈플러스', '5일'),
  createData('건강식품', '비타민', '비타민C', '023456', '789012', '250', 'EUR', '네이버쇼핑', '6일'),
  createData('과일', '사과', '후지사과', '025678', '345678', '220', 'USD', '마켓컬리', '7일'),
];

// 테이블 헤더 정의
const headCells = [
  { id: 'category_name', numeric: false, disablePadding: true, label: 'Category 1', width: '13%' },
  { id: 'category2_name', numeric: false, disablePadding: false, label: 'Category 2', width: '13%' },
  { id: 'item_name', numeric: false, disablePadding: false, label: '물품명', width: '14%' },
  { id: 'part1', numeric: true, disablePadding: false, label: 'Part No. 1', width: '13%' },
  { id: 'part2', numeric: true, disablePadding: false, label: 'Part No. 2', width: '13%' },
  { id: 'price', numeric: true, disablePadding: false, label: '가격', width: '10%' },
  { id: 'supplier_name', numeric: false, disablePadding: false, label: '발주처', width: '10%' },
  { id: 'leadtime', numeric: false, disablePadding: false, label: '리드타임', width: '9%' },
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

// 테이블 헤더 컴포넌트
function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount, allRowsSelected }) {
  return (
    <TableHead
      sx={{ 
        backgroundColor: '#f0f0f0', // 연회색 배경
        '& th': {
          fontWeight: 'bold', // 글자 굵게
        }
      }}>
      <TableRow>
        <TableCell padding="checkbox" style={{ width: '5%' }}>
          <Checkbox
            color="default"
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
  const navigate = useNavigate();
  const [selected, setSelected] = useState(new Set()); // 선택된 항목 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const [rowsPerPage, setRowsPerPage] = useState(5); // 페이지당 항목 수
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리
  const [category_name, setCategory_name] = useState(''); // Category 1 필터
  const [category2_name, setCategory2_name] = useState(''); // Category 2 필터
  const [modalOpen, setModalOpen] = useState(false); // 모달 표시 상태
  const [leadTimeModalOpen, setLeadTimeModalOpen] = useState(false); // LeadTimeModal 표시 상태
  const [selectedLeadTimeData, setSelectedLeadTimeData] = useState([]); // 선택된 리드타임 데이터

  // Category 1의 고유 값 리스트
  const category1Options = [...new Set(initialRows.map((row) => row.category_name))];

  // Category 2의 고유 값 리스트 (선택된 Category 1에 따라 필터링됨)
  const category2Options = useMemo(() => {
    return [...new Set(initialRows.filter((row) => row.category_name === category_name).map((row) => row.category2_name))];
  }, [category_name]);

  // 필터링된 행 데이터
  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      const matchesCategory1 = category_name ? row.category_name === category_name : true;
      const matchesCategory2 = category2_name ? row.category2_name === category2_name : true;
      const matchesSearchQuery = searchQuery
        ? row.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.category2_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.part1.includes(searchQuery) ||
          row.part2.includes(searchQuery) ||
          row.price.includes(searchQuery) ||
          row.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesCategory1 && matchesCategory2 && matchesSearchQuery;
    });
  }, [searchQuery, category_name, category2_name]);

  // 검색, 카테고리, 페이지 크기 변경 시 페이지를 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category_name, category2_name, rowsPerPage]);

 // 전체 선택 핸들러
const handleSelectAllClick = (event) => {
  if (event.target.checked) {
    const newSelected = new Set(filteredRows.map((row) => row.item_name));
    setSelected((prevSelected) => new Set([...prevSelected, ...newSelected]));
  } else {
    setSelected((prevSelected) => {
      const newSelected = new Set(
        [...prevSelected].filter(item => !filteredRows.some(row => row.item_name === item))
      );
      return newSelected;
    });
  }
};

  // 행 클릭 핸들러
  const handleClick = (event, item_name) => {
    const newSelected = new Set(selected);
    if (newSelected.has(item_name)) {
      newSelected.delete(item_name);
    } else {
      newSelected.add(item_name);
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
    setCategory_name(event.target.value);
    setCategory2_name('');
  };

  // Category 2 변경 핸들러
  const handleCategory2Change = (event) => {
    setCategory2_name(event.target.value);
  };

  // 항목이 선택되었는지 여부 확인
  const isSelected = (item_name) => selected.has(item_name);

  // 빈 행 계산
  const emptyRows = useMemo(
    () => (page > 1 ? Math.max(0, (page - 1) * rowsPerPage + rowsPerPage - filteredRows.length) : 0),
    [page, rowsPerPage, filteredRows.length]
  );

  // 총 페이지 수 계산
  const totalPages = useMemo(() => Math.ceil(filteredRows.length / rowsPerPage), [filteredRows.length, rowsPerPage]);

  // 모든 행이 선택되었는지 여부 확인
  const allRowsSelected = useMemo(() => {
    return filteredRows.length > 0 && filteredRows.every(row => selected.has(row.item_name));
  }, [filteredRows, selected]);

  // 모달 열기 핸들러
  const openModal = () => setModalOpen(true);

  // 리드타임 버튼 클릭 핸들러
  const handleLeadTimeClick = (leadtime) => {
    // 리드타임 데이터를 가공하여 모달에 전달
    const leadTimeData = Array.from({ length: parseInt(leadtime, 10) }, (_, i) => Math.random() * 10 + 5); // 예시 데이터
    setSelectedLeadTimeData(leadTimeData);
    setLeadTimeModalOpen(true); // 모달 열기
  };

  return (
    <div className="p-6">
      <div className="text-xl font-semibold text-white mb-4">선용품 리스트</div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">

{/* Category 1 선택 필터 */}
<Select
  value={category_name}
  onChange={handleCategory1Change}
  displayEmpty
  className="bg-transparent rounded-md"
  sx={{
    height: 40, 
    minWidth: 120,
    backgroundColor: 'transparent', 
    '& .MuiSelect-select': {
      color: 'white', 
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
    '& .MuiSvgIcon-root': {
      color: 'white', 
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', 
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', 
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
  value={category2_name}
  onChange={handleCategory2Change}
  displayEmpty
  className="bg-transparent rounded-md"
  disabled={!category_name} // 'Category 1'이 선택되지 않았을 때만 비활성화
  sx={{
    height: 40, 
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
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Keep border color white on hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Keep border color white when focused
    },
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
        <SearchIcon sx={{ color: 'white' , fontSize: 20}} />
      </InputAdornment>
    ),
  }}
  className="bg-transparent rounded-md"
  sx={{
    height: 40, 
    flexGrow: 1,
    maxWidth: 300,
    backgroundColor: 'transparent',
    '& .MuiInputBase-input': {
      color: 'white', 
      height: '100%',
    },
    '& .MuiOutlinedInput-root': {
      height: 40, 
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
/>

{/* 페이지당 항목 수 선택 */}
<Select
  value={rowsPerPage}
  onChange={handleChangeRowsPerPage}
  className="bg-transparent rounded-md"
  sx={{
    height: 40, 
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
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Keep border color white on hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white', // Keep border color white when focused
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
        <GradientButton
          onClick={openModal} // 버튼 클릭 시 모달 열기
        >
          새상품 등록
        </GradientButton>
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
                const isItemSelected = isSelected(row.item_name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.item_name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.item_name}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox" style={{ width: '5%' }}>
                      <Checkbox
                        color="default"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
                      {formatCellValue(row.category_name)}
                    </TableCell>
                    <TableCell align="center">{formatCellValue(row.category2_name)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.item_name)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.part1)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.part2)}</TableCell>
                    <TableCell align="center">
                      {formatCellValue(row.price, row.unit)} 
                    </TableCell>
                    <TableCell align="center">{formatCellValue(row.supplier_name)}</TableCell>
                    <TableCell align="center" style={{ width: '9%' }}>
                    <Button onClick={() => handleLeadTimeClick(row.leadtime)}
                      variant="contained"
                      sx={{ 
                        ml: 2,
                        backgroundColor: '#A0B2FB',
                        color: 'black', 
                        '&:hover': {
                          backgroundColor: '#6685FF', 
                        },
                      }}
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
            color="original"
          />
        </Box>
      </Box>
      <div className="flex justify-end gap-4 mt-6">
        {/* 발주하기 버튼 */}
        <GradientButton
          onClick={() => navigate('/order')}>
          발주하기
        </GradientButton>
      </div>
     {/* 새상품 등록 모달 */}
     <RegisterModal open={modalOpen} setOpen={setModalOpen} />

     {/* 리드타임 모달 */}
     <LeadTimeModal
          open={leadTimeModalOpen}
          setOpen={setLeadTimeModalOpen}
          leadTimeData={selectedLeadTimeData} // 선택된 리드타임 데이터 전달
     />
    </div>
  );
}

export default ListTable;
