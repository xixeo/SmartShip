import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Box, Button, TextField, InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '../Compo/Modal';

// 모달 창 내의 검색 필드 컴포넌트
function RegisterModal({ open, setOpen }) {
  const [itemNameSearch, setItemNameSearch] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    // 검색 기능 추가
    console.log('물품명 검색:', itemNameSearch);
    console.log('발주처 검색:', supplierSearch);
    setOpen(false); // 모달 창 닫기
  };

  return (
    <Modal open={open} setOpen={setOpen} title="검색">
      <Box p={3}>
        <Box mb={2} display="flex" gap={2} alignItems="center">
          {/* 물품명 검색 필드 */}
          <TextField
            value={itemNameSearch}
            onChange={(e) => setItemNameSearch(e.target.value)}
            placeholder="물품명 검색"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className="bg-white rounded-md"
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
          {/* 발주처 검색 필드 */}
          <TextField
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
            placeholder="발주처 검색"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className="bg-white rounded-md"
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ backgroundColor: '#007bff', color: '#fff' }}
            onClick={handleSearchClick}
          >
            검색
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

RegisterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default RegisterModal;
