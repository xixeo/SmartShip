import React, { createContext, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

const AlertContext = createContext();
export function AlertProvider({ children }) {
    const [alert, setAlert] = useState({});
    const showAlert = (message, severity = 'info') => { // severity가 전달되지 않으면 기본값 'info'가 사용됨
        setAlert({
            message,
            severity,
            open: true,
        });
        setTimeout(() => setAlert((prev) => ({ ...prev, open: false })), 3000); // 자동으로 5초 후에 닫기
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Box sx={{ width: "100%" }}>
                <Collapse in={alert.open}>
                    <Alert
                        variant="filled"
                        severity={alert.severity}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setAlert({ ...alert, open: false })}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ position: 'fixed', bottom: 45, left: 'calc(50% + 120px)', transform:'translateX(-50%)', zIndex: 1300, width: '80%' }}
                    >
                        {alert.message}
                    </Alert>
                </Collapse>
            </Box>
        </AlertContext.Provider>
    );
}

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
