import React, { Children } from 'react'

const Modal = ({open, setOpen, title, children, footer}) => {
    console.log("child",children);
    if(!open) return null;
    //모달 닫기 핸들러
    const handleClose = (e) => {
        //모달 영역을 클릭한 경우는 닫지 않음
        if(e.target === e.currentTarget){
            setOpen(false);
        }
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
    onClick={handleClose} //모달 배경을 클릭할 때 모달 닫음
    > 
      <div className='bg-white p-6 rounded-lg w-full max-w-lg relative' onClick={(e)=> e.stopPropagation()} /*모달 영역내 선택시 안닫힘*/ > 
        <button onClick={()=> setOpen(false)} className='bsolute top-3 right-3 text-gray-500 hover:text-gray-800'>&times;</button>
        {/* 모달 내용 영역 */}
        {title && <h2 className='text-xl font-bold mb-4'>{title}</h2>}
        <div className='mt-4'>
            {children}
        </div>
        {footer && <div className='mt-4'>{footer}</div>}
      </div>
    </div>
  )
};

export default Modal;