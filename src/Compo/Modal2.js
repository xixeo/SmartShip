import React from 'react';
import { Box, Button } from '@mui/material';

const Modal2 = ({ open, setOpen, title, onConfirm, orderDate }) => {
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
                    width: '400px',
                    height: '200px',
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
                    className="text-3xl absolute top-1 right-3 text-white hover:text-gray-500"
                >
                    &times;
                </button>

                {/* 타이틀 */}
                <Box sx={{ marginBottom: 2, fontSize: 'large', fontWeight: 'bold' }}>
                    {title}
                    {orderDate && <h4 className='text-sm'>창고 출고 예정일 : {orderDate}</h4>}
                </Box>

                {/* 확인 및 취소 버튼 */}
                <Box  className="mt-3" sx={{ display: 'flex', gap: 2 }}>
                    <button
                       className='blue-btn2'
                        onClick={() => {
                            setOpen(false);
                            onConfirm();
                        }}
                    >
                        확인
                    </button>
                    <button
                        className='blue-btn'
                        onClick={() => setOpen(false)}
                    >
                        취소
                    </button>
                </Box>
            </Box>
        </div>
    );
};

export default Modal2;
