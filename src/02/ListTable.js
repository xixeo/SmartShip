import React, { useState, useMemo, useEffect } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Paper, TextField, InputAdornment, Select, MenuItem, Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import LeadTimeModal from './LeadTimeModal';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Switch from '@mui/material/Switch';
import './ListTable.scss';
import FormControlLabel from '@mui/material/FormControlLabel';

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
        return value; // 기본값
    }
  }

  return value;
};

// 테이블 헤더 컴포넌트
function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount, allRowsSelected }) {
  return (
    <TableHead
      sx={{ backgroundColor: '#47464F', '& th': { fontWeight: 'bold', color: '#fff' }
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

// 메인 테이블 컴포넌트
function ListTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(initialRows.map(row => ({ ...row, quantity: 1 })));
  const [selected, setSelected] = useState(new Set()); // 선택된 항목 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const [rowsPerPage, setRowsPerPage] = useState(5); // 페이지당 항목 수
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리
  const [category1Name, setCategoryName] = useState(''); // Category 1 필터
  const [category2Name, setCategory2Name] = useState(''); // Category 2 필터
  const [category3Name, setCategory3Name] = useState(''); // Category 3 필터
  const [modalOpen, setModalOpen] = useState(false); // 모달 표시 상태
  const [leadTimeModalOpen, setLeadTimeModalOpen] = useState(false); // LeadTimeModal 표시 상태
  const [selectedLeadTimeData, setSelectedLeadTimeData] = useState([]); // 선택된 리드타임 데이터
  const [displayedRows, setDisplayedRows] = useState(initialRows); // 현재 화면에 표시되는 데이터
  const [showSelected, setShowSelected] = useState(false); // 선택된 항목만 보기 여부

  // Category 1의 고유 값 리스트
  const category1Options = [...new Set(initialRows.map((row) => row.category1Name))];

  // Category 2의 고유 값 리스트 (선택된 Category 1에 따라 필터링됨)
  const category2Options = useMemo(() => {
    return [...new Set(initialRows.filter((row) => row.category1Name === category1Name).map((row) => row.category2Name))];
  }, [category1Name]);

  // Category 3의 고유 값 리스트 (선택된 Category 2에 따라 필터링됨)
  const category3Options = useMemo(() => {
    return [...new Set(initialRows.filter((row) => row.category2Name === category2Name).map((row) => row.category3Name))];
  }, [category2Name]);


  // 필터링된 행 데이터
  const filteredRows = useMemo(() => {
    return displayedRows.filter((row) => {
      const matchesCategory1 = category1Name ? row.category1Name === category1Name : true;
      const matchesCategory2 = category2Name ? row.category2Name === category2Name : true;
      const matchesCategory3 = category3Name ? row.category3Name === category3Name : true;
      const matchesSearchQuery = searchQuery ? 
        row.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        row.category1Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        row.category2Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        row.category3Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        row.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) : true;

      return matchesCategory1 && matchesCategory2 && matchesCategory3 && matchesSearchQuery;
    });
  }, [displayedRows, category1Name, category2Name, category3Name, searchQuery, showSelected]); // `displayedRows`를 의존성 배열에 추가 

  // 선택된 항목만 보기 필터링
  const filteredRowsBySelection = useMemo(() => {
    return showSelected ? filteredRows.filter(row => selected.has(row.itemName)) : filteredRows;
  }, [filteredRows, showSelected, selected]);

  // 검색, 카테고리, 페이지 크기 변경 시 페이지를 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category1Name, category2Name, category3Name, rowsPerPage, showSelected]);

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
  // 클릭된 요소가 수량 변경 또는 리드타임 버튼인 경우 함수 종료
  if (event.target.classList.contains('quantity-button') || event.target.classList.contains('leadtime-button')) {
    return;
  }

  // 체크박스 선택/해제 처리
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
    setCategoryName(event.target.value);
    setCategory2Name(''); // 카테고리 2 리셋
    setCategory3Name(''); // 카테고리 3 리셋
  };

  // Category 2 변경 핸들러
  const handleCategory2Change = (event) => {
    setCategory2Name(event.target.value);
    setCategory3Name(''); // 카테고리 3 리셋
  };


  // Category 3 변경 핸들러
  const handleCategory3Change = (event) => {
    setCategory3Name(event.target.value);
  };

  // 항목이 선택되었는지 여부 확인
  const isSelected = (itemName) => selected.has(itemName);

  // 선택된 항목만 보기 버튼 핸들러
  const handleShowSelected = () => {
    setShowSelected((prev) => {
      if (!prev) setPage(1); // 선택품목보기 버튼 클릭 시 페이지를 1로 초기화
      return !prev;
    });
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (itemName, value) => {
    const quantity = Math.max(1, parseInt(value, 10) || 1); // 수량을 숫자로 변환
    setRows(prevItems =>
      prevItems.map(row =>
        row.itemName === itemName ? { ...row, quantity } : row
      )
    );
  };

  // 빈 행 계산
  const emptyRows = useMemo(() => {
    const rowsCount = showSelected ? filteredRowsBySelection.length : filteredRows.length;
    return page > 1 ? Math.max(0, (page - 1) * rowsPerPage + rowsPerPage - rowsCount) : 0;
  }, [page, rowsPerPage, filteredRows.length, filteredRowsBySelection.length, showSelected]);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    const rowsCount = showSelected ? filteredRowsBySelection.length : filteredRows.length;
    return Math.ceil(rowsCount / rowsPerPage);
  }, [filteredRows.length, filteredRowsBySelection.length, rowsPerPage, showSelected]);
  
  // 모든 행이 선택되었는지 여부 확인
  const allRowsSelected = useMemo(() => {
    return filteredRows.length > 0 && filteredRows.every(row => selected.has(row.itemName));
  }, [filteredRows, selected]);

  // 모달 열기 핸들러
  const openModal = () => setModalOpen(true);

  // 리드타임 버튼 클릭 핸들러
  const handleLeadTimeClick = (leadtime) => {
    // 리드타임 데이터를 가공하여 모달에 전달
    const leadTimeData = Array.from({ length: parseInt(leadtime, 10) }, (_, i) => Math.random() * 10 + 5); // 예시 데이터 그냥 넣어둠
    setSelectedLeadTimeData(leadTimeData);
    setLeadTimeModalOpen(true); // 모달 열기
  };

  return (
    <div className="list-table-root flex flex-col p-6">
      <div className="text-xl font-semibold text-white mb-4">물품 리스트</div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Category 1 선택 필터 */}
          <Select
            value={category1Name}
            onChange={handleCategory1Change}
            displayEmpty
            className="select-custom"
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
            value={category2Name}
            onChange={handleCategory2Change}
            displayEmpty
            className="select-custom"
          >
            <MenuItem value="">
              <em>Category 2</em>
            </MenuItem>
            {category2Options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          {/* Category 3 선택 필터 */}
          <Select
            value={category3Name}
            onChange={handleCategory3Change}
            displayEmpty
            className="select-custom"
          >
            <MenuItem value="">
              <em>Category 3</em>
            </MenuItem>
            {category3Options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          {/* 검색 필드 */}
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="물품명 검색"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton
                      onClick={() => {
                        setSearchQuery(''); // 검색 값 초기화
                        setDisplayedRows(initialRows); // 검색 값 초기화 시 전체 데이터 다시 설정
                      }}
                      edge="end"
                      sx={{ color: 'white' }}
                    >
                      <CloseIcon sx={{ color: 'white', fontSize: 20 }} />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            className="custom-textfield"
          />

          <FormControlLabel
          control={
            <Switch
              checked={showSelected}
              onChange={handleShowSelected}
              color="default"
            />
          }
          label={showSelected ? '선택 품목 보기' : '전체 품목 보기'}
          className="custom-toggle"
          />
          </div>
          <Button
              onClick={() => {
                // 검색 버튼 클릭 시 필터링된 데이터 설정
                const filteredData = initialRows.filter((row) => { 
                  return row.category1Name.toLocaleLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.category2Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.category3Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.price.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
                        row.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
                });
                setDisplayedRows(filteredData);
                setPage(1); // 검색 시 페이지를 1로 초기화
              }}
              variant="contained"
              className="bluebutton"
            >
              검색
            </Button>
      </div>

      <div className="bg-custom">
        <TableContainer component={Paper} sx={{ minHeight: '400px',  width: '100%' }}>
          <Table>
            <EnhancedTableHead
              numSelected={selected.size}
              onSelectAllClick={handleSelectAllClick}
              rowCount={filteredRowsBySelection.length}
              allRowsSelected={allRowsSelected}
            />
            <TableBody>
              {/* 페이지네이션에 따른 행 데이터 표시 */}
              {filteredRowsBySelection.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.itemName);
                const labelId = `enhanced-table-checkbox-${index}`;

                const price = parseFloat(row.price) || 0;
                const quantity = parseInt(row.quantity, 10) || 1;
                const totalPrice = price * quantity;

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
                        color="default"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" align="center" className="item-cell">
                      {formatCellValue(row.category1Name)}
                    </TableCell>
                    <TableCell align="center" className="item-cell">
                      {formatCellValue(row.category2Name)}
                    </TableCell>
                    <TableCell align="center" className="item-cell">
                      {formatCellValue(row.category3Name)}
                    </TableCell>
                    <TableCell align="center" className="item-cell">
                      {formatCellValue(row.itemName)}
                    </TableCell>
                    <TableCell align="center" className='price-cell'>{formatCellValue(totalPrice, row.unit)}</TableCell>
                    <TableCell align="center" className='item-cell'>
                    <TextField
                      className="custom-textfield"
                      type="number" // 숫자 입력 필드로 설정
                      inputProps={{ min: 1 }} 
                      value={row.quantity} 
                      onChange={(e) => handleQuantityChange(row.itemName, e.target.value)}
                      size="small" // 필드 크기 조정
                      color='white'
                    />
                    </TableCell>
                    <TableCell align="center" className="item-cell">
                      {formatCellValue(row.supplierName)}
                    </TableCell>
                    <TableCell align="center" style={{ width: '9%' }}>
                    <Button
                      onClick={() => handleLeadTimeClick(row.leadtime)}
                      variant="contained"
                      className="greenbutton"
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
      </div>
      <div className="pagination-container">
          {/* 페이지네이션 컴포넌트 */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
          />
        </div>
      <div className='flex justify-between items-center mt-6'>
      <div className="flex gap-4">
          {/* 페이지당 항목 수 선택 */}
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="select-custom"
          >
            {[5, 10, 15].map((option) => (
              <MenuItem key={option} value={option}>
              {option}
              </MenuItem>
            ))}
          </Select>
      </div>
      <div className="flex gap-4">
        {/* 장바구니 담기 버튼 */}
        <Button
          className='bluebutton2'
          onClick={() => navigate('/order')}>
          장바구니 담기
        </Button>
      </div>
    </div>

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