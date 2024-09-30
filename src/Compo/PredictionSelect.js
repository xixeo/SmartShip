import React from 'react';
import { Select, MenuItem } from '@mui/material';

const PredictionSelect = ({ options, value, onChange, label, placeholder, name }) => {
    
    return (
        <div className="ui flex items-center p-4 rounded mt-4" style={{ backgroundColor: '#302955' }}>
            <h3 className="ui header w-1/4 text-white">{label}</h3>
            <Select
                value={value}
                onChange={onChange}
                name={name}
                required
                sx={{
                    height: '36px',
                    width: '75%', 
                    minWidth: '200px', 
                    color: 'white',
                    backgroundColor: 'transparent',
                    padding: 0, // 내부 패딩 제거
                    '.MuiSelect-icon': { color: 'white' },
                    '.MuiOutlinedInput-notchedOutline': {
                        width: '100 %',
                        borderColor: '#ffffff50 !important',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff50 !important',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9c87ff !important',
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            backgroundColor: '#302955', // 드롭다운 배경색 설정
                            color: 'white', // 드롭다운 글자색 설정
                        },
                    },
                }}
                displayEmpty // 빈값도 표시
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return <span style={{ color: '#ffffff50' }}>{placeholder}</span>; // placeholder 표시
                    }
                    return selected;
                }}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} value={option}  sx={{ whiteSpace: 'nowrap', width: 'auto' }}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default PredictionSelect;
