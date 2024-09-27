import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Button } from 'react-day-picker';

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        item: '',
        supplier: '',
        part_no: '',
        price: '',
        currency: 'USD'
    });

    const [machineryOptions, setMachineryOptions] = useState([]);
    const [assemblyOptions, setAssemblyOptions] = useState([]);

    const [machineryVisible, setMachineryVisible] = useState(false);
    const [assemblyVisible, setAssemblyVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://10.125.121.178:5000/predict_machinery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((result) => {
                setMachineryOptions(result.machinery_top_3);
                setAssemblyOptions(result.assembly_top_3);
                setMachineryVisible(true);
                setAssemblyVisible(true);
            })
            .catch((error) => {
                console.error('Error during prediction:', error);
            });
    };

    return (
        <div className="ui container text-white mt-5">
            <p>다음 정보를 입력하여 Category 2 및 Category 3를 예측하세요.</p>

            <form className="ui form mt-5" onSubmit={handleSubmit}>
                <div className="field flex mb-4 items-center">
                    <label className="text-white mr-3">물품명</label>
                    <TextField
                        name="item"
                        value={formData.item}
                        onChange={handleChange}
                        placeholder="물품명을 입력하세요"
                        required
                        variant="outlined"
                        size='small'
                        className='custom-textfield'
                    />
                </div>

                <div className="field flex mb-4 items-center">
                    <label className="text-white mr-3">공급업체</label>
                    <TextField
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        placeholder="공급업체를 입력하세요"
                        required
                        variant="outlined"
                        size='small'
                        className='custom-textfield'
                    />
                </div>

                <div className="field flex mb-4 items-center">
                    <label className="text-white mr-3">part 1</label>
                    <TextField
                        name="part_no"
                        value={formData.part_no}
                        onChange={handleChange}
                        placeholder="품번을 입력하세요"
                        required
                        variant="outlined"
                        size='small'
                        className='custom-textfield'
                    />
                </div>

                <div className="field flex mb-4 items-center">
                    <label className="text-white mr-3">가격 (Price)</label>
                    <TextField
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="가격을 입력하세요"
                        required
                        variant="outlined"
                        size='small'
                        className='custom-textfield'
                    />
                </div>

                <div className="field mb-4">
                    <label className="text-white mr-3">통화 (Currency)</label>
                    <Select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        required
                        sx={{
                            // backgroundColor: '#374151', // 배경색
                            color: 'white',
                            '.MuiSelect-icon': { color: 'white' }, // 드롭다운 화살표 색상
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white', // 기본 테두리 색상
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#7f6dce', // 포커스 시 테두리 색상
                                },
                            },
                        }}
                    >
                        <MenuItem value="USD">USD (미국 달러)</MenuItem>
                        <MenuItem value="KRW">KRW (한국 원)</MenuItem>
                        <MenuItem value="EUR">EUR (유로)</MenuItem>
                        <MenuItem value="JPY">JPY (일본 엔)</MenuItem>
                    </Select>
                </div>

                <button className="blue-btn">검색</button>
            </form>

            {machineryVisible && (
                <div className="ui segment bg-gray-500 p-4 rounded mt-4">
                    <h3 className="ui header text-white">추천 Category 2</h3>
                    <label className="text-white">Category 2 선택:</label>
                    <select className="ui dropdown bg-gray-500 text-white p-2 rounded">
                        {machineryOptions.map((machinery, index) => (
                            <option key={index} value={machinery}>
                                {machinery}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {assemblyVisible && (
                <div className="ui segment bg-gray-800 p-4 rounded mt-4">
                    <h3 className="ui header text-white">추천 Category 3</h3>
                    <label className="text-white">Category 3 선택:</label>
                    <select className="ui dropdown bg-gray-700 text-white p-2 rounded">
                        {assemblyOptions.map((assembly, index) => (
                            <option key={index} value={assembly}>
                                {assembly}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default PredictionForm;
