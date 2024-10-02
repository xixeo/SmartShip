import React, { useState, useEffect } from 'react';
import { Box, TextField, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material';
import PredictionSelect from '../Compo/PredictionSelect';
import { useAlert } from "../Compo/AlertContext";
import { useLoading } from "../Compo/LoadingContext";;

const PredictionModal = ({ open, setOpen, title }) => {
    const [formData, setFormData] = useState({
        item: '',
        supplier: localStorage.getItem('username') || '', // 로컬스토리지의 username = 공급업체
        part_no: '',
        price: '',
        currency: 'USD',
        leadtime: '',
    });

    const [majorOptions, setMajorOptions] = useState([]);
    const [machineryOptions, setMachineryOptions] = useState([]);
    const [assemblyOptions, setAssemblyOptions] = useState([]);

    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedMachinery, setSelectedMachinery] = useState('');
    const [selectedAssembly, setSelectedAssembly] = useState('');

    const [machineryVisible, setMachineryVisible] = useState(false);
    const [assemblyVisible, setAssemblyVisible] = useState(false);
    const token = localStorage.getItem('token');

    const { setLoading } = useLoading();
    const { showAlert } = useAlert();

    useEffect(() => {
        if (open) {
            setFormData({
                item: '',
                supplier: localStorage.getItem('username') || '',
                part_no: '',
                price: '',
                currency: 'USD',
                leadtime: '',
            });
            setSelectedMajor(false);
            setSelectedMachinery(false);
            setSelectedAssembly(false);
            setMachineryVisible(false);
            setAssemblyVisible(false);
        }
    }, [open]);

    ///////////////////////////
    // Major=카테고리1 띄우기 //
    ///////////////////////////

    useEffect(() => {
        setLoading(true);
        fetch('/category1')
            .then((response) => response.json())
            .then((data) => {
                setMajorOptions(data);
            })
            .catch((error) => {
                console.error('Error fetching major options:', error);
                showAlert('카테고리1 데이터를 불러오는데 실패했습니다.', 'error');
            })
            .finally(() => setLoading(false));
    }, []);

    if (!open) return null;

    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            // 상태 초기화
            setFormData({
                item: '',
                supplier: localStorage.getItem('username') || '',
                part_no: '',
                price: '',
                currency: 'USD',
                leadtime: '',
            });
            setSelectedMajor('');
            setSelectedMachinery('');
            setSelectedAssembly('');
            setMachineryVisible(false);
            setAssemblyVisible(false);
            setOpen(false);
        }
    };

    ////////////////////////////////////////////////////////
    // flask 연결 (Machinery=카테고리2, Assembly=카테고리3) //
    ////////////////////////////////////////////////////////

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch('http://10.125.121.178:5000/predict_machinery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Prediction result:', result);
                setMachineryOptions(result.machinery_top_3);
                setAssemblyOptions(result.assembly_top_3);
                setMachineryVisible(true);
                setAssemblyVisible(true);

                // 선택된 카테고리 상태를 업데이트
                if (result.machinery_top_3.length > 0) {
                    setSelectedMachinery(result.machinery_top_3[0]); // 첫 번째 값을 선택
                }
                if (result.assembly_top_3.length > 0) {
                    setSelectedAssembly(result.assembly_top_3[0]); // 첫 번째 값을 선택
                }
                showAlert('카테고리가 성공적으로 검색되었습니다', 'success');
            })
            .catch((error) => {
                console.error('Error during prediction:', error);
                showAlert('카테고리 예측에 실패했습니다.', 'error');
            })
            .finally(() => setLoading(false));
    };

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

    ///////////////////////////////
    // 새 상품 등록하기 버튼누르면 //
    ///////////////////////////////

    const handleRegistration = async () => {
        console.log('formData:', formData);
        console.log('selectedMajor:', selectedMajor);
        console.log('selectedMachinery:', selectedMachinery);
        console.log('selectedAssembly:', selectedAssembly);
        if (!formData.item || !selectedMajor || !selectedMachinery || !selectedAssembly) {
            showAlert('모든 필드를 입력해 주세요.', 'warning');
            return; 
        }

        const payload = {
            category1Name: selectedMajor,
            category2Name: selectedMachinery,
            category3Name: selectedAssembly,
            itemName: formData.item,
            part1: formData.part_no,
            part2: "part2",
            price: formData.price, // parseFloat(formData.price), // 문자가 아니라 실수처리
            unit: formData.currency,
            leadtime: formData.leadtime,
        };
        console.log('payload:', payload);
        
        try {
            setLoading(true);
            const response = await fetch('/supplier/items/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.text();
            console.log(result.message); // 응답 메시지 확인
            showAlert('상품이 성공적으로 등록되었습니다.', 'success');
            setOpen(false);
        } catch (error) {
            console.error('등록 중 오류 발생:', error);
            showAlert('상품 등록에 실패했습니다.', 'error')
            
            // 상태 초기화 (모달을 닫을 때와 동일하게)
            // setFormData({
            //     item: '',
            //     supplier: localStorage.getItem('username') || '',
            //     part_no: '',
            //     price: '',
            //     currency: 'USD',
            //     leadtime: '',
            // });
            // setSelectedMajor('');
            // setSelectedMachinery('');
            // setSelectedAssembly('');
            // setMachineryVisible(false);
            // setAssemblyVisible(false);

        }
        finally {
            setLoading(false);
        }
    };
    
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
            onClick={handleClose}
        >
            <Box
                sx={{
                    backgroundColor: '#17161D',
                    padding: '24px',
                    borderRadius: '8px',
                    width: '600px',
                    color: 'white',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-3 right-3 text-white hover:text-gray-500"
                >
                    &times;
                </button>

                <Box sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            textAlign: 'left',
                            fontSize: 'large',
                            fontWeight: 'bold',
                        }}
                    >
                        {title}
                    </Box>
                    <hr style={{ width: '100%', borderColor: 'white', marginTop: '15px' }} />
                </Box>

                <form className="ui form mt-6" onSubmit={handleSubmit}>
                    <div className='flex items-center mb-5'>
                        <p className="mr-10">다음 정보를 입력하여 Category 2 및 Category 3를 선택하세요.</p>
                        <button className="blue-btn ml-auto" type="submit">검색</button>
                    </div>

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
                                sx={{ flex: 1, maxWidth: '500px !important' }}
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
                                sx={{ flex: 1, maxWidth: '500px !important' }}
                            />
                        </div>
                    </div>

                    <div className="field flex mb-4 items-center px-4">
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
                                sx={{ marginRight: '10px' }}
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
                            options={majorOptions.map((option) => option.category1Name)}
                            value={selectedMajor}
                            onChange={(e) => setSelectedMajor(e.target.value)}
                            label="Category 1"
                            placeholder="해당하는 카테고리1을 선택하세요"
                        />
                    )}

                    {machineryVisible && (
                        <PredictionSelect
                            options={machineryOptions}
                            value={selectedMachinery || (machineryOptions.length > 0 ? machineryOptions[0] : '')}
                            onChange={(e) => setSelectedMachinery(e.target.value)}
                            label="Category 2"
                        />
                    )}

                    {assemblyVisible && (
                        <PredictionSelect
                            options={assemblyOptions}
                            value={selectedAssembly || (assemblyOptions.length > 0 ? assemblyOptions[0] : '')}
                            onChange={(e) => setSelectedAssembly(e.target.value)}
                            label="Category 3"
                        />

                    )}

                    {assemblyVisible && (
                        <div className="field flex mb-4 mt-4 items-center px-4">
                            <label className="text-white w-1/4">Leadtime</label>
                            <div className='w-3/4 ml-auto flex'>
                                <TextField
                                    name="leadtime"
                                    value={formData.leadtime}
                                    onChange={handleChange}
                                    placeholder="리드타임을 입력하세요"
                                    variant="outlined"
                                    size='small'
                                    className='custom-textfield'
                                    sx={{ flex: 1, maxWidth: '500px !important' }}
                                />
                            </div>
                        </div>
                    )}
                </form>

                {assemblyVisible && (
                    <Box sx={{ display: "flex", marginTop: '20px', gap: 2 }}>
                        <Button onClick={() => {
                            handleRegistration(); // 등록 핸들러 호출
                            // setOpen(false); // 모달 닫기
                            // handleRegistration(formData, selectedMajor, selectedMachinery, selectedAssembly) // 데이터 전달
                            // 다시 랜더링 되도록해야
                        }}
                            variant="contained"
                            sx={{
                                color: 'white', backgroundColor: '#7f6dce',
                                '&:hover': {
                                    backgroundColor: '#6b5bc1',
                                },
                            }}>
                            등록
                        </Button>
                        <Button
                            sx={{
                                color: 'white', backgroundColor: '#a3a3a3',
                                '&:hover': {
                                    backgroundColor: '#7a7a7a',
                                },
                            }}
                            onClick={() => setOpen(false)}
                        >
                            취소
                        </Button>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default PredictionModal;
