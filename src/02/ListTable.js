// TODO : 열위치, 페이징, 체크박스, 버튼, InputProps(?) 줄그어진거

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Checkbox,Button,Paper,TextField,InputAdornment,TablePagination,Select,MenuItem} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// 데이터 생성 함수
function createData(category1, category2, itemName, partNo1, partNo2, price, supplier, leadTime) {
  return { category1, category2, itemName, partNo1, partNo2, price, supplier, leadTime };
}

// 초기 데이터
const initialRows = [
  createData('식품', '과일', '수박', '012526', '213123', '$180', '쿠팡', '1일'),
  createData('음료', '탄산음료', '콜라', '015789', '321456', '$120', '이마트', '2일'),
  createData('음료', '탄산음료', '사이다', '015782', '321457', '$120', '이마트', '2일'),
  createData('음료', '커피', '아메리카노', '015783', '321458', '$120', '이마트', '3일'),
  createData('간식', '과자', '포테이토칩', '019876', '654321', '$150', '롯데마트', '4일'),
  createData('유제품', '우유', '서울우유', '021345', '987654', '$200', '홈플러스', '5일'),
  createData('건강식품', '비타민', '비타민C', '023456', '789012', '$250', '네이버쇼핑', '6일'),
  createData('과일', '사과', '후지사과', '025678', '345678', '$220', '마켓컬리', '7일'),
];

// 테이블 헤더 정의
const headCells = [
  { id: 'category1', numeric: false, disablePadding: true, label: 'Category 1' },
  { id: 'category2', numeric: false, disablePadding: false, label: 'Category 2' },
  { id: 'itemName', numeric: false, disablePadding: false, label: '물품명' },
  { id: 'partNo1', numeric: true, disablePadding: false, label: 'Part No. 1' },
  { id: 'partNo2', numeric: true, disablePadding: false, label: 'Part No. 2' },
  { id: 'price', numeric: true, disablePadding: false, label: '가격' },
  { id: 'supplier', numeric: false, disablePadding: false, label: '발주처' },
  { id: 'leadTime', numeric: false, disablePadding: false, label: '리드타임' },
];

// 테이블 헤더 컴포넌트
function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
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
};

// 메인 테이블 컴포넌트
function ListTable() {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('');

  // Category 1 옵션 생성
  const category1Options = [...new Set(initialRows.map((row) => row.category1))];

  // Category 2 옵션 생성 (선택된 Category 1에 따라 필터링)
  const category2Options = useMemo(() => {
    return [...new Set(initialRows.filter((row) => row.category1 === category1).map((row) => row.category2))];
  }, [category1]);

  // 필터링된 데이터 계산
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

  // 전체 선택 핸들러
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n) => n.itemName);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // 개별 항목 선택 핸들러
  const handleClick = (event, itemName) => {
    const selectedIndex = selected.indexOf(itemName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, itemName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 페이지당 행 수 변경 핸들러
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Category 1 변경 핸들러
  const handleCategory1Change = (event) => {
    setCategory1(event.target.value);
    setCategory2(''); // Category 1이 변경되면 Category 2를 리셋
  };

  // Category 2 변경 핸들러
  const handleCategory2Change = (event) => {
    setCategory2(event.target.value);
  };

  // 선택 상태 확인
  const isSelected = (itemName) => selected.indexOf(itemName) !== -1;

  // 빈 행 계산
  const emptyRows = useMemo(
    () => (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0),
    [page, rowsPerPage, filteredRows.length]
  );

  return (
    <div className="w-full p-4">
      <div className="text-lg font-semibold text-white mb-4">
        선용품 리스트
      </div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Category 1 선택 */}
          <Select
            value={category1}
            onChange={handleCategory1Change}
            displayEmpty
            className="bg-white rounded-md"
            sx={{ minWidth: 120 }}
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

          {/* Category 2 선택 */}
          <Select
            value={category2}
            onChange={handleCategory2Change}
            displayEmpty
            className="bg-white rounded-md"
            disabled={!category1} // Category 1이 선택되지 않으면 비활성화
            sx={{ minWidth: 120 }}
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

          {/* 검색 바 */}
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색"
            InputProps={{
              'startAdornment': (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            className="bg-white rounded-md"
            sx={{ flexGrow: 1, maxWidth: 300 }} // 검색 바의 최대 너비 설정
          />
        </div>

        {/* 새상품 등록 버튼 */}
        <Button variant="contained" color="primary" className="text-white bg-indigo-400">
          새상품 등록
        </Button>
      </div>

      {/* 테이블 */}
      <Paper>
        <TableContainer>
          <Table aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.category1}
                    </TableCell>
                    <TableCell>{row.category2}</TableCell>
                    <TableCell>{row.itemName}</TableCell>
                    <TableCell align="right">{row.partNo1}</TableCell>
                    <TableCell align="right">{row.partNo2}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell>{row.supplier}</TableCell>
                    <TableCell>
                      {/* {row.leadTime} --> 이건 버튼눌렀을 때 그래프로 보여지도록 */}
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
        {/* 페이지 네이션 */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* 버튼들 */}
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="contained" color="primary" className="text-white bg-indigo-400">
          발주하기
        </Button>
      </div>
    </div>
  );
}

export default ListTable;
