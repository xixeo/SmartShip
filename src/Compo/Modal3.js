import React from 'react';
import { Box, Button } from '@mui/material';
import PredictionForm from '../02/PredictionForm';

const Modal3 = ({ open, setOpen, title, onConfirm }) => {
    if (!open) return null;

    // 모달 닫기 핸들러
    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
        }
    };

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
                 <PredictionForm />

                {/* 등록 및 취소 버튼 */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        sx={{ color: 'white', backgroundColor: '#7f6dce',
                            '&:hover': {
                                backgroundColor: '#6b5bc1', // hover 색상
                            }, }}
                        onClick={() => {
                            setOpen(false);
                            onConfirm();
                        }}
                    >
                        등록
                    </Button>
                    <Button
                        sx={{ color: 'white',  backgroundColor: '#BFBFBF',
                            '&:hover': {
                                backgroundColor: '#a3a3a3', // hover 색상
                            }, }}
                        onClick={() => setOpen(false)}
                    >
                        취소
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default Modal3;