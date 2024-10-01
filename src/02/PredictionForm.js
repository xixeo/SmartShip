import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Button } from 'react-day-picker';
import PredictionSelect from '../Compo/PredictionSelect';

// const PredictionForm = ({ setAssemblyVisible, onSubmit }) => {
const PredictionForm = ({ setAssemblyVisible: propSetAssemblyVisible, onSubmit }) => {
    const [formData, setFormData] = useState({
        item: '',
        supplier: localStorage.getItem('username') || '', // 로컬스토리지의 username = 공급업체
        part_no: '',
        price: '',
        currency: 'USD'
    });

    const [majorOptions, setMajorOptions] = useState([]);
    const [machineryOptions, setMachineryOptions] = useState([]);
    const [assemblyOptions, setAssemblyOptions] = useState([]);

    const [machineryVisible, setMachineryVisible] = useState(false);    
    const [assemblyVisible, setAssemblyVisible] = useState(false);

    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedMachinery, setSelectedMachinery] = useState('');
    const [selectedAssembly, setSelectedAssembly] = useState('');

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));

    if (name === 'major') setSelectedMajor(value);
    if (name === 'machinery') setSelectedMachinery(value);
    if (name === 'assembly') setSelectedAssembly(value);
};

    ////////////////////////////////////////////////////////
    // flask 연결 (Machinery=카테고리2, Assembly=카테고리3) //
    ////////////////////////////////////////////////////////

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData); // 요청 데이터 확인
        fetch('http://10.125.121.178:5000/predict_machinery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("Result:", result); // 결과 확인
                setMachineryOptions(result.machinery_top_3);
                setAssemblyOptions(result.assembly_top_3);
                setMachineryVisible(true);
                setAssemblyVisible(true);
                propSetAssemblyVisible(true); // props로 전달된 함수 사용

                 // Modal에 전달할 데이터
                 if (onSubmit) {
                    onSubmit(formData, selectedMajor, selectedMachinery, selectedAssembly);
                }
            })
            .catch((error) => {
                console.error('Error during prediction:', error);
            });
    };

    ///////////////////////////
    // Major=카테고리1 띄우기 //
    ///////////////////////////

    useEffect(() => {
        fetch('/category1')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched category1 data:', data);
                setMajorOptions(data); // majorOptions에 데이터 저장
            })
            .catch(error => {
                console.error('Error fetching major options:', error);
            });
    }, []);

    return (
        <div className="ui container text-white">
            <form className="ui form mt-6" onSubmit={handleSubmit}>
                <div className='flex items-center mb-5'>
                    <p>다음 정보를 입력하여 Category 2 및 Category 3를 예측하세요.</p>
                    <button className="blue-btn  ml-auto" type="submit">검색</button>
                </div>
                {/* </form><form className="ui form mt-6" onSubmit={handleSubmit}> */}
                <div className="field flex mb-4 items-center px-4">
                    <label className="text-white w-1/4">물품명</label>
                    <div className='w-3/4 ml-auto flex'>
                        <TextField
                            name="item"
                            value={formData.item}
                            onChange={handleChange}
                            placeholder="물품명을 입력하세요"
                            required
                            variant="outlined"
                            size='small'
                            className='custom-textfield'
                            sx={{
                                flex: 1,
                                maxWidth: '500px !important',
                            }}
                        />
                    </div>
                </div>

                {/* 화면에는 공급업체 안띄움 */}
                <div className="field flex mb-4 items-center px-4" style={{ display: 'none' }}>
                    <label className="text-white w-1/4">공급업체</label>
                    <div className='w-3/4 ml-auto flex'>
                        <TextField
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            placeholder="공급업체를 입력하세요"
                            required
                            variant="outlined"
                            size='small'
                            className='custom-textfield'
                            sx={{
                                flex: 1,
                                maxWidth: '500px !important',
                            }}
                            inputProps={{ style: { display: 'none' } }}
                        />
                    </div>
                </div>

                <div className="field flex mb-4 items-center px-4">
                    <label className="text-white w-1/4">part 1</label>
                    <div className='w-3/4 ml-auto flex'>
                        <TextField
                            name="part_no"
                            value={formData.part_no}
                            onChange={handleChange}
                            placeholder="품번을 입력하세요"
                            required
                            variant="outlined"
                            size='small'
                            className='custom-textfield'
                            sx={{
                                flex: 1,
                                maxWidth: '500px !important',
                            }}
                        />
                    </div>
                </div>

                <div className="field flex mb-4 items-center  px-4">
                    <label className="text-white w-1/4">가격 (Price)</label>
                    <div className='w-3/4 ml-auto flex'>
                        <TextField
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="가격을 입력하세요"
                            required
                            variant="outlined"
                            size='small'
                            className='custom-textfield'
                            sx={{
                                marginRight: '10px'
                            }}
                        />
                        <Select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            required
                            sx={{
                                height: '36px',
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
                            <MenuItem value="USD">USD (달러)</MenuItem>
                            <MenuItem value="KRW">KRW (원화)</MenuItem>
                            <MenuItem value="EUR">EUR (유로)</MenuItem>
                            <MenuItem value="JPY">JPY (엔화)</MenuItem>
                        </Select>
                    </div>
                </div>

            {machineryVisible && (
                <PredictionSelect
                    options={majorOptions.map(option => option.category1Name)} // 옵션에 표시할 이름만 전달
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)} // 상태 업데이트
                    label="Category 1"
                    placeholder="해당하는 카테고리1을 선택하세요"
                />
            )}

            {machineryVisible && (
                <PredictionSelect
                    options={machineryOptions}
                    value={selectedMachinery || (machineryOptions.length > 0 ? machineryOptions[0] : '')} // 첫 번째 옵션을 기본값으로 설정
                    onChange={(e) => setSelectedMachinery(e.target.value)} // 상태 업데이트
                    label="Category 2"
                />
            )}

            {assemblyVisible && (
                <PredictionSelect
                    options={assemblyOptions}
                    value={selectedAssembly || (assemblyOptions.length > 0 ? assemblyOptions[0] : '')} // 첫 번째 옵션을 기본값으로 설정
                    onChange={(e) => setSelectedAssembly(e.target.value)} // 상태 업데이트
                    label="Category 3"
                />
            )}
            </form>

        </div>
    );
};

export default PredictionForm;
