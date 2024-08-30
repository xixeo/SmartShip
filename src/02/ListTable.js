import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

function createData(category1, category2, itemName, partNo1, partNo2, price, supplier) {
  return {
    category1,
    category2,
    itemName,
    partNo1,
    partNo2,
    price,
    supplier,
  };
}

const initialRows = [
  createData('식품', '과일', '수박', '012526', '213123', '$180', '쿠팡'),
  createData('음료', '탄산음료', '콜라', '015789', '321456', '$120', '이마트'),
  createData('간식', '과자', '포테이토칩', '019876', '654321', '$150', '롯데마트'),
  createData('유제품', '우유', '서울우유', '021345', '987654', '$200', '홈플러스'),
  createData('건강식품', '비타민', '비타민C', '023456', '789012', '$250', '네이버쇼핑'),
  createData('과일', '사과', '후지사과', '025678', '345678', '$220', '마켓컬리'),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: 'category1', numeric: false, disablePadding: true, label: 'Category 1' },
  { id: 'category2', numeric: false, disablePadding: false, label: 'Category 2' },
  { id: 'itemName', numeric: false, disablePadding: false, label: '물품명' },
  { id: 'partNo1', numeric: true, disablePadding: false, label: 'Part No. 1' },
  { id: 'partNo2', numeric: true, disablePadding: false, label: 'Part No. 2' },
  { id: 'price', numeric: true, disablePadding: false, label: '가격' },
  { id: 'supplier', numeric: false, disablePadding: false, label: '발주처' },
  { id: 'leadTime', numeric: false, disablePadding: false, label: '리드타임' }, // 리드타임 열 추가
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all items' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, category1Options, category2Options, onCategory1Change, onCategory2Change, onSearchChange, searchValue, onSearchClick, onAddClick } = props;

  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          선용품 리스트
        </Typography>
      )}

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <TextField
          select
          label="Category 1"
          value={category1Options.selected}
          onChange={onCategory1Change}
          sx={{ mr: 2, minWidth: 120 }}
        >
          {category1Options.list.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Category 2"
          value={category2Options.selected}
          onChange={onCategory2Change}
          sx={{ mr: 2, minWidth: 120 }}
        >
          {category2Options.list.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="품목명 검색"
          value={searchValue}
          onChange={onSearchChange}
          sx={{ mr: 2, minWidth: 120 }}
        />
        <Button variant="contained" onClick={onSearchClick} sx={{ mr: 1 }}>
          검색
        </Button>
        <Button variant="outlined" onClick={onAddClick}>
          등록
        </Button>
      </Box>

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  category1Options: PropTypes.shape({
    selected: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  category2Options: PropTypes.shape({
    selected: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  searchValue: PropTypes.string.isRequired,
  onCategory1Change: PropTypes.func.isRequired,
  onCategory2Change: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchClick: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

function ListTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('category1');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [category1Filter, setCategory1Filter] = useState('');
  const [category2Filter, setCategory2Filter] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const category1Options = useMemo(() => ({
    selected: category1Filter,
    list: ['식품', '음료', '간식', '유제품', '건강식품', '과일']
  }), [category1Filter]);

  const category2Options = useMemo(() => ({
    selected: category2Filter,
    list: ['과일', '탄산음료', '과자', '우유', '비타민']
  }), [category2Filter]);

  const filteredRows = useMemo(() => {
    return initialRows.filter(row => 
      (category1Filter === '' || row.category1 === category1Filter) &&
      (category2Filter === '' || row.category2 === category2Filter) &&
      (searchValue === '' || row.itemName.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [category1Filter, category2Filter, searchValue]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n) => n.itemName);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

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
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (itemName) => selected.indexOf(itemName) !== -1;

  const emptyRows = useMemo(
    () => page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0,
    [page, rowsPerPage, filteredRows.length]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          category1Options={category1Options}
          category2Options={category2Options}
          searchValue={searchValue}
          onCategory1Change={(event) => setCategory1Filter(event.target.value)}
          onCategory2Change={(event) => setCategory2Filter(event.target.value)}
          onSearchChange={(event) => setSearchValue(event.target.value)}
          onSearchClick={() => {}}
          onAddClick={() => {}}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {filteredRows
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
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
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
                        '&:hover': {
                          backgroundColor: alpha('#c0c0c0', 0.5),
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.category1}
                      </TableCell>
                      <TableCell align="left">{row.category2}</TableCell>
                      <TableCell align="left">{row.itemName}</TableCell>
                      <TableCell align="right">{row.partNo1}</TableCell>
                      <TableCell align="right">{row.partNo2}</TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                      <TableCell align="left">{row.supplier}</TableCell>
                      <TableCell align="left"> {/* 새로운 열 추가 */}
                        <Button variant="outlined" size="small">
                          리드타임
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (53) * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
    </Box>
  );
}

export default ListTable;
