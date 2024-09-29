import React, { useState }  from 'react';
import { Box, Button } from '@mui/material';
import PredictionForm from '../02/PredictionForm';

const Modal3 = ({ open, setOpen, title, onConfirm }) => {
    const [assemblyVisible, setAssemblyVisible] = useState(true); // 검색결과 나올때 등록, 취소 버튼이 나타나도록

    
    if (!open) return null;

    // 모달 닫기 핸들러
    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
        }
    };

        // // 상품 등록 핸들러
        // const handleRegistration = async (formData, selectedMajor, selectedMachinery, selectedAssembly) => {
        //     const payload = {
        //         category1Name: selectedMajor,
        //         category2Name: selectedMachinery,
        //         category3Name: selectedAssembly,
        //         itemName: formData.item,
        //         part1: formData.part_no,
        //         part2: null,
        //         price: formData.price,
        //         unit: formData.currency,
        //     };
    
        //     try {
        //         const response = await fetch('/supplier/items/add', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(payload),
        //         });
        //         const result = await response.json();
        //         console.log(result.message);
        //     } catch (error) {
        //         console.log(result.message);
        //     }
        // };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
            onClick={handleClose} // 바깥 클릭 시 모달 닫기
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
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-3 right-3 text-white hover:text-gray-500"
                >
                    &times;
                </button>

                {/* 타이틀 */}
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
                    <hr style={{ width: '100%', borderColor: 'white', marginTop: '15px' }} /> {/* 흰색 가로선 */}
                </Box>

                 {/* PredictionForm 삽입 */}
                 <PredictionForm setAssemblyVisible={setAssemblyVisible} />

                {/* 등록 및 취소 버튼 */}
                {assemblyVisible && (
                <Box sx={{ display: 'flex', gap: 2, marginTop:3 }}>
                    <Button
                        sx={{ color: 'white', backgroundColor: '#7f6dce',
                            '&:hover': {
                                backgroundColor: '#6b5bc1', // hover 색상
                            }, }}
                        onClick={() => {
                            setOpen(false);
                            onConfirm();
                            // handleRegistration(formData, selectedMajor, selectedMachinery, selectedAssembly) // 데이터 전달
                            // 다시 랜더링 되도록해야
                        }}

                        
                    >
                        등록
                    </Button>
                    <Button
                        sx={{ color: 'white',  backgroundColor: '#a3a3a3',
                            '&:hover': {
                                backgroundColor: '#7a7a7a', // hover 색상
                            }, }}
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

export default Modal3;