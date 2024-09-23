 import React, { useState, useMemo, useEffect } from 'react';
import { Checkbox, Select, Switch, MenuItem, Button, IconButton, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const username = localStorage.getItem('username') || 'Guest';
const alias = localStorage.getItem('alias') || 'Guest';
const token = localStorage.getItem('token');

const ListSupplier2 = () => {

  // 각 행의 카테고리 선택
  const [category1Map, setCategory1Map] = useState([]);
  const [category2Map, setCategory2Map] = useState(new Map());
  const [category3Map, setCategory3Map] = useState(new Map());

  // 검색
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [initialRows, setInitialRows] = useState([]);

  ////////////////////////////////
  // 공급업체의 아이템만 가져오기 //
  ////////////////////////////////

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/finditem', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        console.log('Fetched data:', data);

        const processedData = data.map(item => ({
          ...item
        }));
        setRows(processedData);

        // 각 행의 카테고리 값을 초기화
        const initialSelectedCategories = processedData.reduce((acc, item) => {
          const category1Id = category1Map.find(cat => cat.category1Name === item.category1Name)?.category1Id || '';

          const category2Id = category2Map.get(category1Id)?.find(cat => cat.category2Name === item.category2Name)?.category2Id || '';

          const category3Id = category3Map.get(category2Id)?.find(cat => cat.category3Name === item.category3Name)?.category3Id || '';

          acc[item.itemId] = {
            category1: category1Id,
            category2: category2Id,
            category3: category3Id,
          };

          return acc;
        }, {});

        setSelectedCategories(initialSelectedCategories);
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error);
      }
    };

    fetchData();
  }, [category1Map, category2Map, category3Map]);

  const [rows, setRows] = useState([]);
  const [selectCategory1, setSelectCategory1] = useState('');
  const [selectCategory2, setSelectCategory2] = useState('');
  const [selectCategory3, setSelectCategory3] = useState('');

  // 선택된 카테고리 이름
  const category1Options = [...new Set(rows.map((row) => row.category1Name))];
  const category2Options = useMemo(() => {
    return [...new Set(rows.filter((row) => row.category1Name === selectCategory1).map((row) => row.category2Name))];
  }, [selectCategory1, rows]);
  const category3Options = useMemo(() => {
    return [...new Set(rows.filter((row) => row.category2Name === selectCategory2).map((row) => row.category3Name))];
  }, [selectCategory2, rows]);

  ///////////////////////////////////////////////
  // 전체 카테고리 목록 가져오기 (각 행에서 변경) //
  ///////////////////////////////////////////////

  const fetchCategories = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  // 드롭다운에서 각 카테고리 선택
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const [data1, data2, data3] = await Promise.all([
        fetchCategories('/category1'),
        fetchCategories('/category2'),
        fetchCategories('/category3'),
      ]);

      const category2Map = new Map();
      data2.forEach((item) => {
        const { category1, category2Id, category2Name } = item;
        const { category1Id } = category1;
        if (!category2Map.has(category1Id)) {
          category2Map.set(category1Id, []);
        }
        category2Map.get(category1Id).push({ category2Id, category2Name });
      });

      const category3Map = new Map();
      data3.forEach((item) => {
        const { category2, category3Id, category3Name } = item;
        const { category2Id } = category2;
        if (!category3Map.has(category2Id)) {
          category3Map.set(category2Id, []);
        }
        category3Map.get(category2Id).push({ category3Id, category3Name });
      });

      setCategory1Map(data1);
      setCategory2Map(category2Map);
      setCategory3Map(category3Map);
    };

    loadCategories();
  }, []);

  const handleCategoryChange = (itemId, categoryLevel, value) => {
    const newSelectedCategories = { ...selectedCategories };
  
    if (!newSelectedCategories[itemId]) {
      newSelectedCategories[itemId] = { category1: '', category2: '', category3: '' };
    }
  
    if (categoryLevel === 1) {
      newSelectedCategories[itemId].category1 = value;
      newSelectedCategories[itemId].category2 = '';
      newSelectedCategories[itemId].category3 = '';
    } else if (categoryLevel === 2) {
      newSelectedCategories[itemId].category2 = value;
      newSelectedCategories[itemId].category3 = ''; // Reset category 3
    } else {
      newSelectedCategories[itemId].category3 = value;
    }
  
    setSelectedCategories(newSelectedCategories);
  };

  //////////////////
  // 판매상태 제어 //
  //////////////////

  const currencyDisplayNames = { USD: '달러', EUR: '유로', JPY: '엔화', KRW: '원화' };

  const handlePriceChange = (itemId, event) => {
    const newPrice = parseFloat(event.target.value) || 0;
    setRows(rows.map(row =>
      row.itemId === itemId ? { ...row, price: newPrice } : row
    ));
  };

  const handleCurrencyChange = (itemId, event) => {
    const newCurrency = event.target.value;
    setRows(rows.map(row =>
      row.itemId === itemId ? { ...row, unit: newCurrency } : row
    ));
  };

  const handleSaleStatusChange = (itemId, event) => {
    const newSaleStatus = event.target.checked;
    setRows(rows.map(row =>
      row.itemId === itemId ? { ...row, saleStatus: newSaleStatus } : row
    ));
  };

  //////////////////
  // 체크박스 관리 //
  //////////////////

  // 체크박스 상태 관리
  const [selectedItems, setSelectedItems] = useState(new Set());

  // 전체 선택 핸들러
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allSelected = new Set(rows.map(row => row.itemId));
      setSelectedItems(allSelected);
    } else {
      setSelectedItems(new Set());
    }
  };

  // 각 행의 체크박스 핸들러
  const handleRowSelect = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  ////////////////
  // 물품명 검색 //
  ////////////////

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchReset = () => {
    setSearchQuery('');
    setAppliedSearchQuery('');
    setRows(initialRows);
  };

  const handleSearchButtonClick = () => {
    setAppliedSearchQuery(searchQuery);
    // setPage(1);
  };

  const filteredRows = useMemo(() => {
    if (!appliedSearchQuery) return rows;
    return rows.filter(row => row.itemName.includes(appliedSearchQuery));
  }, [appliedSearchQuery, rows]);
  
  // 각 행에서 카테고리 수정(저장) 핸들러 //
  const handleSave = async () => {
    try {
      console.log('selectedCategories:', selectedCategories);
  
      // selectedCategories가 객체 형태일 경우 배열로 변환
      const selectedCategoriesArray = Object.values(selectedCategories);
  
      const dataToSave = selectedCategoriesArray.map(cat => {
        const row = rows.find(r => r.itemId === cat.itemId);
        if (!row) {
          console.warn(`Item with ID ${cat.itemId} not found.`);
          return null; // 존재하지 않는 경우 null 반환
        }
        return {
          itemId: row.itemId,
          category1Name: cat.category1,
          category2Name: cat.category2,
          category3Name: cat.category3,
          itemName: row.itemName,
          part1: row.part1,
          part2: row.part2,
          price: row.price,
          unit: row.unit,
          purchaseCount: row.purchaseCount,
          supplierName: row.supplierName,
          alias: row.alias,
          leadtime: row.leadtime,
          forSale: row.forSale,
        };
      }).filter(item => item !== null); // null 값을 필터링하여 제거
  
      if (dataToSave.length === 0) {
        throw new Error('저장할 데이터가 없습니다.');
      }
  
      console.log('Data to save:', JSON.stringify(dataToSave, null, 2));
  
      await fetch('/supplier/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
  
      alert('Saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    }
  };
  
  return (
    <div className="list-table-root flex flex-col p-6">
      {/* 공급업체의 아이템 중 <Select> */}
      <div className="text-xl font-semibold text-white mb-4">{`[ ${alias} ] 물품 관리`}</div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Select
            value={selectCategory1}
            onChange={(e) => setSelectCategory1(e.target.value)}
            displayEmpty
            className="select-custom"
          >
            <MenuItem value=""><div>Categories 1</div></MenuItem>
            {category1Options.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          <Select
            value={selectCategory2}
            onChange={(e) => setSelectCategory2(e.target.value)}
            displayEmpty
            className="select-custom"
          >
            <MenuItem value=""><div>Categories 2</div></MenuItem>
            {category2Options.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          <Select
            value={selectCategory3}
            onChange={(e) => setSelectCategory3(e.target.value)}
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
            onClick={handleSave}
            variant="contained"
            className="bluebutton"
          >
            저장
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: '#47464F',
              '& th': {
                fontWeight: 'bold',
                color: '#fff',
              },
            }}
          >
            <TableRow>
              <TableCell padding="checkbox" style={{ width: '5%' }}>
                <Checkbox
                  color="default"
                  checked={selectedItems.size === rows.length && rows.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ width: '2%', textAlign: 'center' }}>No.</TableCell>
              <TableCell sx={{ width: '13%', textAlign: 'center' }}>Category 1</TableCell>
              <TableCell sx={{ width: '13%', textAlign: 'center' }}>Category 2</TableCell>
              <TableCell sx={{ width: '13%', textAlign: 'center' }}>Category 3</TableCell>
              <TableCell sx={{ width: '13%', textAlign: 'center' }}>물품명</TableCell>
              <TableCell sx={{ width: '13%', textAlign: 'center' }}>part 1</TableCell>
              <TableCell sx={{ width: '16%', textAlign: 'center' }}>가격</TableCell>
              <TableCell sx={{ width: '6%', textAlign: 'center' }}>화폐단위</TableCell>
              <TableCell sx={{ width: '6%', textAlign: 'center' }}>판매여부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="items-center">
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox"  style={{ width: '5%' }}>
                  <Checkbox
                    color="default"
                    checked={selectedItems.has(row.itemId)}
                    onChange={() => handleRowSelect(row.itemId)}
                  />
                </TableCell>
                <TableCell className="item-cell" sx={{ width: '2%' }}>{index + 1}</TableCell>
                {/* 전체 카테고리 목록 중 <Select> */}
                <TableCell sx={{ width: '13%' }}>
                  <Select
                    className="select-supplier items-center"
                    value={selectedCategories[row.itemId]?.category1 || ''}
                    onChange={(e) => handleCategoryChange(row.itemId, 1, e.target.value)}
                  >
                    <MenuItem value=""><em>Select Category1</em></MenuItem>
                    {category1Map.map((cat) => (
                      <MenuItem key={cat.category1Id} value={cat.category1Id}>
                        {cat.category1Name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ width: '13%' }}>
                  <Select
                    className="select-supplier items-center"
                    value={selectedCategories[row.itemId]?.category2 || ''}
                    onChange={(e) => handleCategoryChange(row.itemId, 2, e.target.value)}
                    disabled={!selectedCategories[row.itemId]?.category1}
                  >
                    <MenuItem value=""><em>Select Category2</em></MenuItem>
                    {(category2Map.get(selectedCategories[row.itemId]?.category1) || []).map((cat) => (
                      <MenuItem key={cat.category2Id} value={cat.category2Id}>
                        {cat.category2Name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ width: '13%' }}>
                  <Select
                    className="select-supplier items-center"
                    value={selectedCategories[row.itemId]?.category3 || ''}
                    onChange={(e) => handleCategoryChange(row.itemId, 3, e.target.value)}
                    disabled={!selectedCategories[row.itemId]?.category2}
                  >
                    <MenuItem value=""><em>Select Category3</em></MenuItem>
                    {(category3Map.get(selectedCategories[row.itemId]?.category2) || []).map((cat) => (
                      <MenuItem key={cat.category3Id} value={cat.category3Id}>
                        {cat.category3Name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ width: '13%' }} align="center" className="item-cell">{row.itemName}</TableCell>
                <TableCell sx={{ width: '13%' }} align="center" className="item-cell">{row.part1}</TableCell>
                <TableCell align="center">
                  <TextField
                    sx={{ width: '16%' }}
                    className="custom-quantity"
                    type="number"
                    value={row.price}
                    onChange={(event) => handlePriceChange(row.itemId, event)}
                    fullWidth
                  />
                </TableCell>
                <TableCell align="center">
                  <Select
                    sx={{ width: '6%' }}
                    className="select-supplier"
                    value={row.unit || ''} // unit이 빈 문자열일 경우를 대비
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
                <TableCell  sx={{ width: '6%' }} align="center">
                  <Switch
                    checked={row.forSale}
                    onChange={(event) => handleSaleStatusChange(row.itemId, event)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListSupplier2;
