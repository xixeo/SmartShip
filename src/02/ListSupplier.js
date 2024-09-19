import React, { useState, useMemo, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox,
  Button, Paper, TextField, InputAdornment, Select, MenuItem, Box, FormControlLabel,
  Switch, IconButton, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import './ListTable.scss';
import Modal from '../Compo/Modal';

// 테이블 헤더 정의
const headCells = [
  { id: 'no', label: 'No.', width: '2%' },
  { id: 'category1Name', label: 'Category 1', width: '12%' },
  { id: 'category2Name', label: 'Category 2', width: '12%' },
  { id: 'category3Name', label: 'Category 3', width: '12%' },
  { id: 'itemName', label: '물품명', width: '10%' },
  { id: 'part1', label: 'part 1', width: '10%' },
  { id: 'part2', label: 'part 2', width: '10%' },
  { id: 'totalPrice', label: '가격', width: '10%' },
  { id: 'supplierName', label: '화폐단위', width: '7%' },
  { id: 'saleStatus', label: '판매여부', width: '10%' },
]; 

// 테이블 헤더 컴포넌트
function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount, allRowsSelected }) {
  return (
    <TableHead
      sx={{
        backgroundColor: '#47464F', '& th': { fontWeight: 'bold', color: '#fff' }
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
            padding='normal'
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
function ListSupplier() {
  const navigate = useNavigate();
  const [initialRows, setInitialRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1); // 현재 페이지
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [category1Name, setCategoryName] = useState('');
  const [category2Name, setCategory2Name] = useState('');
  const [category3Name, setCategory3Name] = useState('');
  const [showSelected, setShowSelected] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState({}); // 선택된 공급업체 상태
  const [saleStatus, setSaleStatus] = useState({}); // 판매여부 상태를 관리할 객체
  const currencyDisplayNames = { USD: '달러', EUR: '유로', JPY: '엔화', KRW: '원화' };

   // 사용자 이름을 로컬 스토리지에서 가져옴
   const username = localStorage.getItem('username') || 'Guest';
   const alias = localStorage.getItem('alias') || 'Guest';
   const token = localStorage.getItem('token');

   const generateKey = (row) => {
    return `${row.category1Name}-${row.category2Name}-${row.category3Name}-${row.itemName}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/finditem',
        {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
        }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
      
        // 사용자의 역할 확인
        const userRole = localStorage.getItem('role'); // 역할이 로컬 스토리지에 저장되어 있다고 가정
        const filteredData = userRole === 'ROLE_SUPPLIER'
            ? data.filter(item => item.supplierName === username) // 공급업체 역할일 경우 필터링
            : data;

        const processedData = filteredData.map(item => ({
            ...item,
            quantity: 1,
            leadtime: 1
        }));
    
      setInitialRows(processedData);
      setRows(processedData);
    } catch (error) {
      console.error('데이터 로딩 중 오류 발생:', error);
    }
  };
  
    fetchData();
}, [username, token]);

  const category1Options = [...new Set(rows.map((row) => row.category1Name))];
  
  const category2Options = useMemo(() => {
    return [...new Set(rows.filter((row) => row.category1Name === category1Name).map((row) => row.category2Name))];
  }, [category1Name, rows]);

  const category3Options = useMemo(() => {
    return [...new Set(rows.filter((row) => row.category2Name === category2Name).map((row) => row.category3Name))];
  }, [category2Name, rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesCategory1 = category1Name ? row.category1Name === category1Name : true;
      const matchesCategory2 = category2Name ? row.category2Name === category2Name : true;
      const matchesCategory3 = category3Name ? row.category3Name === category3Name : true;
      const matchesSearchQuery = searchQuery ? row.itemName.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesCategory1 && matchesCategory2 && matchesCategory3 && matchesSearchQuery;
  });
}, [rows, category1Name, category2Name, category3Name, searchQuery, showSelected]);

  const filteredRowsBySelection = useMemo(() => {
    return showSelected ? filteredRows.filter(row => selected.has(row.itemId)) : filteredRows;
  }, [filteredRows, showSelected, selected]);

  const uniqueRows = useMemo(() => {
    const seen = new Set();
    return filteredRowsBySelection.filter(row => {
      const key = `${row.category1Name}-${row.category2Name}-${row.category3Name}-${row.itemName}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [filteredRowsBySelection]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category1Name, category2Name, category3Name, rowsPerPage, showSelected]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = new Set(uniqueRows.map((row) => row.itemId));
      setSelected((prevSelected) => new Set([...prevSelected, ...newSelected]));
    } else {
      setSelected((prevSelected) => {
        const newSelected = new Set(
          [...prevSelected].filter(item => !uniqueRows.some(row => row.itemId === item))
        );
        return newSelected;
      });
    }
  };

  const handleClick = (event, itemName) => {
    const newSelected = new Set(selected);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleCategory1Change = (event) => {
    setCategoryName(event.target.value);
    setCategory2Name('');
    setCategory3Name('');
  };

  const handleCategory2Change = (event) => {
    setCategory2Name(event.target.value);
    setCategory3Name('');
  };

  const handleCategory3Change = (event) => {
    setCategory3Name(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleQuantityChange = (itemId, event) => {
    const newQuantity = Math.max(1, parseInt(event.target.value, 10));
    setRows(rows.map(row =>
      row.itemId === itemId ? { ...row, quantity: newQuantity } : row
    ));
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

  const allRowsSelected = useMemo(() => {
    return uniqueRows.length > 0 && uniqueRows.every(row => selected.has(row.itemId));
  }, [uniqueRows, selected]);

  const handleSearchReset = () => {
    setSearchQuery('');
    setRows(initialRows);
  };

  const handleSearchButtonClick = () => {
    setRows(filteredRows);
    setPage(1);
  };

  // 공급업체를 선택할 때 현재 선택된 품목의 공급업체를 변경 (같은 itemName이라도 다른 물품이면 다른 supplier 고를 수 있음)
  const handleSupplierChange = (itemId, supplierName) => {
    setSelectedSupplier(prev => ({
      ...prev,
      [itemId]: supplierName
    }));
  };

  // 공통 데이터 조회 함수
  const getRowData = (row) => {
    return rows.find(
      r =>
        r.category1Name === row.category1Name &&
        r.category2Name === row.category2Name &&
        r.category3Name === row.category3Name &&
        r.itemName === row.itemName
    ) || {};
  };

  const handleItemNameChange = (itemId, event) => {
    const newItemName = event.target.value;
    setRows(rows.map(row =>
      row.itemId === itemId ? { ...row, itemName: newItemName } : row
    ));
  };
  
  const handlePriceChange = (itemId, event) => {
    const newPrice = parseFloat(event.target.value) || 0;
    setRows(rows.map(row =>
      row.itemId === itemId ? { ...row, totalPrice: newPrice } : row
    ));
  };
  
  const handleCurrencyChange = (itemId, event) => {
    const newCurrency = event.target.value;
    setRows(rows.map(row =>
      row.itemId === itemId ? { ...row, currency: newCurrency } : row
    ));
  };

  const handleSaleStatusChange = (itemId, event) => {
    const newSaleStatus = event.target.checked ? 'In Stock' : 'Out of Stock';
    setRows(rows.map(row =>
      row.itemId === itemId ? { ...row, saleStatus: newSaleStatus } : row
    ));
  };

  const isItemSelected = (itemId) => selected.has(itemId);

  const currencyOptions = ['USD', 'EUR', 'JPY', 'KRW'];

  return (
    <div className="list-table-root flex flex-col p-6">
      <div className="text-xl font-semibold text-white mb-4">{`[ ${alias} ] 물품 관리`}</div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Select
            value={category1Name}
            onChange={handleCategory1Change}
            displayEmpty
            className="select-custom"
          >
            <MenuItem value=""><div>Categories 1</div></MenuItem>
            {category1Options.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          <Select
            value={category2Name}
            onChange={handleCategory2Change}
            displayEmpty
            className="select-custom"
          >
            <MenuItem value=""><div>Categories 2</div></MenuItem>
            {category2Options.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          <Select
            value={category3Name}
            onChange={handleCategory3Change}
            displayEmpty
            className="select-custom"
          >
            <MenuItem value=""><div>Categories 3</div></MenuItem>
            {category3Options.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="물품명 검색"
            size="small"
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
                      onClick={handleSearchReset}
                      edge="end"
                      sx={{ color: 'white' }}
                    >
                      <CloseIcon sx={{ color: 'white', fontSize: 20 }} />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            className='custom-textfield'
          />

        </div>
        <div className='flex space-x-3'>
        <Button
          onClick={handleSearchButtonClick}
          variant="contained"
          className="bluebutton"
        >
          검색
        </Button>
        <Button
        //   onClick={handleSearchButtonClick}
          variant="contained"
          className="bluebutton"
        >
          등록
        </Button>
        <Button
        //   onClick={handleSearchButtonClick}
          variant="contained"
          className="bluebutton"
        >
          삭제
        </Button>
        <Button
        //   onClick={handleSearchButtonClick}
          variant="contained"
          className="bluebutton"
        >
          저장
        </Button>
        </div>
      </div>

      <div className="bg-custom">
        <TableContainer component={Paper} sx={{ minHeight: '400px', width: '100%' }}>
          <Table>
            <EnhancedTableHead
              onSelectAllClick={handleSelectAllClick}
              numSelected={selected.size}
              rowCount={uniqueRows.length}
              allRowsSelected={allRowsSelected}
            />
            <TableBody>
            {uniqueRows.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => (
                <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected(row.itemId)}
                tabIndex={-1}
                key={row.itemId}
                selected={isItemSelected(row.itemId)}
                >
                <TableCell padding="checkbox">
                    <Checkbox
                    color="default"
                    checked={isItemSelected(row.itemId)}
                    onChange={(event) => handleClick(event, row.itemId)}
                    />
                </TableCell>
                <TableCell align="center" className="item-cell">{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                        {/* Category 1 드롭다운 */}
                        <FormControl fullWidth>
                            <Select
                                className="select-supplier"
                                value={category1Name}
                                onChange={(e) => setCategoryName(e.target.value)}
                            >
                                {category1Options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                </TableCell>
                <TableCell>
                        {/* Category 2 드롭다운 */}
                        <FormControl fullWidth>
                            <Select
                                className="select-supplier"
                                value={category2Name}
                                onChange={(e) => setCategory2Name(e.target.value)}
                                disabled={!category1Name}
                            >
                                {category2Options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                </TableCell>
                <TableCell>
                        {/* Category 3 드롭다운 */}
                        <FormControl fullWidth>
                            <Select
                                className="select-supplier"
                                value={category3Name}
                                onChange={(e) => setCategory3Name(e.target.value)}
                                disabled={!category2Name}
                            >
                                {category3Options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                </TableCell>
                <TableCell align="center" className="item-cell">{row.itemName}</TableCell>
                <TableCell align="center" className="item-cell">{row.part1}</TableCell>
                <TableCell align="center" className="item-cell">{row.part2}</TableCell>
                <TableCell align="center">
                    <TextField
                    className="custom-quantity"
                    type="number"
                    value={row.totalPrice}
                    onChange={(event) => handlePriceChange(row.itemId, event)}
                    fullWidth
                    />
                </TableCell>
                <TableCell align="center">
                <Select
                    className="select-supplier"
                    value={row.currency}
                    onChange={(event) => handleCurrencyChange(row.itemId, event)}
                    fullWidth
                >
                    {Object.entries(currencyDisplayNames).map(([code, displayName]) => (
                    <MenuItem key={code} value={code}>
                        {displayName}
                    </MenuItem>
                    ))}
                </Select>
                </TableCell>
                <TableCell align="center">
                    <Switch
                      checked={row.saleStatus === 'In Stock'}
                      onChange={(event) => handleSaleStatusChange(row.itemId, event)}
                    />
                  </TableCell>
                </TableRow>
            ))}
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
      </div>
    </div>
  );
}

export default ListSupplier;