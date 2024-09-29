import React from 'react';

const Modal = ({ open, setOpen, title, children, footer }) => {
    if (!open) return null;

    // Modal close handler
    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
            onClick={handleClose} // Close modal when clicking outside
        >
            <div
                className="bg-[#17161D] p-6 rounded-lg w-full max-w-screen-lg relative overflow-y-auto max-h-[80vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                    &times;
                </button>
                {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
                <div className="mt-4">
                    {children}
                </div>
                {footer && <div className="mt-4">{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;
