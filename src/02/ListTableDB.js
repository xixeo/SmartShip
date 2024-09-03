// restAPI 추가

import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Paper, TextField, InputAdornment, Select, MenuItem, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import RegisterModal from "./RegisterModal";
import LeadTimeModal from './LeadTimeModal';
import GradientButton from '../Compo/GradientButton'
import { useNavigate } from 'react-router-dom';

// 데이터 요청 함수
const fetchItems = async (category_name, category2_name) => {
  try {
    const response = await fetch(`/finditem?category_name=${encodeURIComponent(category_name)}&category2_name=${encodeURIComponent(category2_name)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

// 초기 데이터 상태
const initialRows = [];

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

function ListTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(initialRows); // 서버에서 가져온 데이터
  const [selected, setSelected] = useState(new Set()); 
  const [page, setPage] = useState(1); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [category_name, setCategory_name] = useState(''); 
  const [category2_name, setCategory2_name] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [leadTimeModalOpen, setLeadTimeModalOpen] = useState(false); 
  const [selectedLeadTimeData, setSelectedLeadTimeData] = useState([]); 

  const category1Options = useMemo(() => {
    return [...new Set(rows.map((row) => row.category_name))];
  }, [rows]);

  const category2Options = useMemo(() => {
    return [...new Set(rows.filter((row) => row.category_name === category_name).map((row) => row.category2_name))];
  }, [category_name, rows]);

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchItems(category_name, category2_name);
      setRows(data);
    };

    loadItems();
  }, [category_name, category2_name]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
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
  }, [searchQuery, category_name, category2_name, rows]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category_name, category2_name, rowsPerPage]);

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

  const handleClick = (event, item_name) => {
    const newSelected = new Set(selected);
    if (newSelected.has(item_name)) {
      newSelected.delete(item_name);
    } else {
      newSelected.add(item_name);
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
    setCategory_name(event.target.value);
    setCategory2_name('');
  };

  const handleCategory2Change = (event) => {
    setCategory2_name(event.target.value);
  };

  const isSelected = (item_name) => selected.has(item_name);

  const emptyRows = useMemo(
    () => (page > 1 ? Math.max(0, (page - 1) * rowsPerPage + rowsPerPage - filteredRows.length) : 0),
    [page, rowsPerPage, filteredRows.length]
  );

  const totalPages = useMemo(() => Math.ceil(filteredRows.length / rowsPerPage), [filteredRows.length, rowsPerPage]);

  const allRowsSelected = useMemo(() => {
    return filteredRows.length > 0 && filteredRows.every(row => selected.has(row.item_name));
  }, [filteredRows, selected]);

  return (
    <>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        <Select
          value={category_name}
          onChange={handleCategory1Change}
          displayEmpty
          sx={{ minWidth: 150, mr: 2 }}
        >
          <MenuItem value="" disabled>
            Category 1
          </MenuItem>
          {category1Options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={category2_name}
          onChange={handleCategory2Change}
          displayEmpty
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="" disabled>
            Category 2
          </MenuItem>
          {category2Options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <EnhancedTableHead
            numSelected={selected.size}
            onSelectAllClick={handleSelectAllClick}
            rowCount={filteredRows.length}
            allRowsSelected={allRowsSelected}
          />
          <TableBody>
            {filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => {
              const isItemSelected = isSelected(row.item_name);
              return (
                <TableRow
                  key={row.item_name}
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                  onClick={(event) => handleClick(event, row.item_name)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="default"
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': row.item_name }}
                    />
                  </TableCell>
                  <TableCell align="center">{row.category_name}</TableCell>
                  <TableCell align="center">{row.category2_name}</TableCell>
                  <TableCell align="center">{row.item_name}</TableCell>
                  <TableCell align="center">{row.part1}</TableCell>
                  <TableCell align="center">{row.part2}</TableCell>
                  <TableCell align="center">{formatCellValue(row.price, row.price_unit)}</TableCell>
                  <TableCell align="center">{row.supplier_name}</TableCell>
                  <TableCell align="center">{row.leadtime}</TableCell>
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
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChangePage}
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />
    </>
  );
}

export default ListTable;