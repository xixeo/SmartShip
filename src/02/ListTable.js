// db연결전 + 연결후 (4개 변경 +)

import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Paper, TextField, InputAdornment, Select, MenuItem, Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import LeadTimeModal from './LeadTimeModal';
import GradientButton from '../Compo/GradientButton'
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

// 1) db연결전
// 데이터 생성 함수
function createData(category1Name, category2Name, category3Name, itemName, price, unit, supplierName, leadtime) {
  return { category1Name, category2Name, category3Name, itemName, price, unit, supplierName, leadtime };
}
// 초기 데이터
const initialRows = [
  createData('식품', '과일', '수박/참외', '수박', '18', 'EUR', '쿠팡', 1),
  createData('음료', '탄산음료', '콜라', '코카콜라', '12', 'USD', '이마트', 2),
  createData('음료', '탄산음료', '사이다', '칠성사이다', '1200', 'KRW', '이마트', 2),
  createData('음료', '커피', '커피', '아메리카노', '1700', 'KRW', '롯데슈퍼', 3),
  createData('간식', '과자', '포테이토칩', '스윙칩',  '150', 'JPY', '롯데마트', 4),
  createData('유제품', '우유', '서울우유', '저지방 서울우유', '2000', 'KRW', '홈플러스', 5),
  createData('건강식품', '비타민', '비타민', '비타민C', '25', 'EUR', '네이버쇼핑', 6),
  createData('과일', '사과', '후지사과', '유기농 후지사과', '2', 'USD', '마켓컬리', 7),
];

// // 2) db연결후
// // 데이터 요청 함수
// const fetchItems = async (category1Name, category2Name) => {
//   try {
//     const response = await fetch(`/finditem?category1Name=${encodeURIComponent(category1Name)}&category2Name=${encodeURIComponent(category2Name)}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching items:', error);
//     return [];
//   }
// };
// // 초기 데이터 상태
// const initialRows = [];

// 테이블 헤더 정의
const headCells = [
  { id: 'category1Name', label: 'Category 1', width: '13%' },
  { id: 'category2Name', label: 'Category 2', width: '13%' },
  { id: 'category3Name', label: 'Category 3', width: '13%' },
  { id: 'itemName', label: '물품명', width: '14%' },
  { id: 'price', label: '가격', width: '10%' },
  { id: 'quantity', label: '수량', width: '10%' },
  { id: 'supplierName', label: '판매자', width: '10%' },
  { id: 'leadtime', label: '리드타임', width: '9%' },
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
        backgroundColor: '#f0f0f0', 
        '& th': {
          fontWeight: 'bold', 
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
  const [rows, setRows] = useState(initialRows); // 서버에서 가져온 데이터
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

// 1) db연결전
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

// // 2) db연결후
//   const category1Options = useMemo(() => {
//     return [...new Set(rows.map((row) => row.category1Name))];
//   }, [rows]);

//   const category2Options = useMemo(() => {
//     return [...new Set(rows.filter((row) => row.category1Name === category1Name).map((row) => row.category2Name))];
//   }, [category1Name, rows]);

//   useEffect(() => {
//     const loadItems = async () => {
//       const data = await fetchItems(category1Name, category2Name);
//       setRows(data);
//     };

//     loadItems();
//   }, [category1Name, category2Name]);

  // 필터링된 행 데이터
  const filteredRows = useMemo(() => {
    return displayedRows.filter((row) => {
      const matchesCategory1 = category1Name ? row.category1Name === category1Name : true;
      const matchesCategory2 = category2Name ? row.category2Name === category2Name : true;
      const matchesCategory3 = category3Name ? row.category3Name === category3Name : true;

      return matchesCategory1 && matchesCategory2 && matchesCategory3;
    });
  }, [displayedRows, category1Name, category2Name, category3Name]); // `displayedRows`를 의존성 배열에 추가 // 1) db연결전 -> 2) db연결후 rows 추가

  // 검색, 카테고리, 페이지 크기 변경 시 페이지를 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category1Name, category2Name, category3Name, rowsPerPage]);

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
    setCategoryName(event.target.value);
    setCategory2Name('');
  };

  // Category 2 변경 핸들러
  const handleCategory2Change = (event) => {
    setCategory2Name(event.target.value);
  };

  // Category 3 변경 핸들러
  const handleCategory3Change = (event) => {
    setCategory3Name(event.target.value);
  };

  // 항목이 선택되었는지 여부 확인
  const isSelected = (itemName) => selected.has(itemName);

  // 선택된 항목 보기 버튼 클릭 시
  const handleShowSelected = () => {
    setShowSelected(!isSelected);
  };

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

  // 리드타임 버튼 클릭 핸들러
  const handleLeadTimeClick = (leadtime) => {
    // 리드타임 데이터를 가공하여 모달에 전달
    const leadTimeData = Array.from({ length: parseInt(leadtime, 10) }, (_, i) => Math.random() * 10 + 5); // 예시 데이터
    setSelectedLeadTimeData(leadTimeData);
    setLeadTimeModalOpen(true); // 모달 열기
  };

  return (
    <div className="flex flex-col p-6">
      <div className="text-xl font-semibold text-white mb-4">선용품 리스트</div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">

          {/* Category 1 선택 필터 */}
          <Select
            value={category1Name}
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
            value={category2Name}
            onChange={handleCategory2Change}
            displayEmpty
            className="select-category bg-transparent rounded-md"
            disabled={!category1Name} // 'Category 1'이 선택되지 않았을 때만 비활성화
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
              '&.Mui-disabled': {
                '& .MuiSelect-select': {
                  color: 'white', 
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', 
                },
              },
            }}
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
            className="bg-transparent rounded-md"
            disabled={!category2Name} // 'Category 2'이 선택되지 않았을 때만 비활성화
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
              '&.Mui-disabled': {
                '& .MuiSelect-select': {
                  color: 'white', 
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', 
                },
              },
            }}
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
          {/* 선택 품목 보기 버튼 */}
          <Button variant="contained" onClick={handleShowSelected}>
            {showSelected ? "모든 품목 보기" : "선택 품목 보기"}
          </Button>
          <Button
              onClick={() => {
                // 검색 버튼 클릭 시 필터링된 데이터 설정
                const filteredData = initialRows.filter((row) => { // db연결 후에는 initialRows 대신 rows 사용
                  return row.category1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.category2Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.category3Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.part1.includes(searchQuery) ||
                        row.part2.includes(searchQuery) ||
                        row.price.includes(searchQuery) ||
                        row.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
                });
                setDisplayedRows(filteredData);
                setPage(1); // 검색 시 페이지를 1로 초기화
              }}
              variant="contained"
              sx={{ 
                ml: 2, mr: 2,
                backgroundColor: '#A0B2FB',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#6685FF',
                },
              }}
            >
              검색
            </Button>

          </div>
      </div>

      <div className="bg-white rounded-lg shadow-md ">
        <TableContainer component={Paper} sx={{ minHeight: '400px' }}>
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
                        color="default"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" align="center">
                      {formatCellValue(row.category1Name)}
                    </TableCell>
                    <TableCell align="center">{formatCellValue(row.category2Name)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.category3Name)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.itemName)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.part1)}</TableCell>
                    <TableCell align="center">{formatCellValue(row.part2)}</TableCell>
                    <TableCell align="center">
                      {formatCellValue(row.price, row.unit)} 
                    </TableCell>
                    <TableCell align="center">{formatCellValue(row.supplierName)}</TableCell>
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
      </div>
      <div className='flex justify-between items-center mt-6'>
      <div className="flex gap-4">
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
      <div className="flex gap-4">
        {/* 발주하기 버튼 */}
        <GradientButton
          onClick={() => navigate('/order')}>
          발주하기
        </GradientButton>
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