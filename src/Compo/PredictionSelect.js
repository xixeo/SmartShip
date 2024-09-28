import React from 'react';
import { Select, MenuItem } from '@mui/material';

const PredictionSelect = ({ options, value, onChange, label }) => {
    return (
        <div className="ui flex items-center p-4 rounded mt-4" style={{ backgroundColor: '#302955' }}>
            <h3 className="ui header w-1/4 text-white">{label}</h3>
            <Select
                value={value}
                onChange={onChange}
                required
                sx={{
                    height: '36px',
                    width: '75%', 
                    minWidth: '150px',
                    color: 'white',
                    backgroundColor: 'transparent',
                    '.MuiSelect-icon': { color: 'white' },
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff50 !important',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff50 !important',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9c87ff !important',
                    },
                }}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default PredictionSelect;
