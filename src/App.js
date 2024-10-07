import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.scss";
import "../src/assets/theme/input.scss";
import "../src/assets/theme/table.scss";
import SignUp from "./Sign/SignUp";
import SignIn from "./Sign/SignIn";
import SignState from "./Sign/SignState";
import Navi from "./Compo/Navi";
import Footer from "./Compo/Footer";
import Board from "./DashBoard/Board";
import Schedule from "./01/Schedule";
import ListTableDB from "./02/ListTableDB";
import ListSupplier2 from "./02/ListSupplier2";
import OrderTEST from "./03/OrderTEST";
import Charttest from "./DashBoard/charttest";
import MyOrderList from "./04/MyOrderList";
import AnnounceForEvery from "./Compo/AnnounceForEvery";
import AnnounceWrite from "./Admin/AnnounceWrite";
import AnnounceEdit from "./Admin/AnnounceEdit";
import Announcement from "./Admin/Announcement";
import Membership from "./Admin/Membership";
import PurchaseRequest from "./DashBoard/PurchaseRequestForDash";
import OrderManage from "./DashBoard/OrderManage"
import { createTheme, ThemeProvider } from "@mui/material";
import { AlertProvider } from "./Compo/AlertContext";
import { LoadingProvider } from "./Compo/LoadingContext";
import Supplierboard2 from "./DashBoard/Supplierboard2";

function App() {
    const theme = createTheme({
        typography: {
            fontFamily: "Pretendard",
        },
        
    });
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const role = localStorage.getItem('role');
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        const isAuthenticatedNow = !!token; 
        if (isAuthenticatedNow !== isAuthenticated) {
            setIsAuthenticated(isAuthenticatedNow); 
        }
    }, [isAuthenticated]);
    
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <AuthenticatedRoutes
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                    role={role}
                    />
            </BrowserRouter>
        </ThemeProvider>
    );
}

function AuthenticatedRoutes({ isAuthenticated, setIsAuthenticated, role }) {
    const [hasRedirected, setHasRedirected] = useState(false); // 리디렉션이 한 번 발생했는지 추적
    const navigate = useNavigate();

     // 역할에 따른 첫 화면 리디렉션 처리
     useEffect(() => {
        if (isAuthenticated && role && !hasRedirected) {
            if (role === "ROLE_ADMIN") {
                navigate("/Announcement");
            } else if (role === "ROLE_SUPPLIER") {
                navigate("/Supplierboard");
            } else if (role === "ROLE_MANAGER") {
                navigate("/Board");
            } else {
                navigate("/listTable");
            }
            setHasRedirected(true); // 리디렉션 후 상태 변경
        }
    }, [isAuthenticated, role, hasRedirected, navigate]);

    const PrivateRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/signin" />;
    };

    return (
        <div className="flex flex-col h-screen w-full">
            {!isAuthenticated ? (
                <Routes>
                    <Route
                        path="/signup"
                        element={<SignUp setIsAuthenticated={setIsAuthenticated} />}
                    />
                    <Route
                        path="/signin"
                        element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
                    />
                    {/* <Route path="/" element={<PrivateRoute element={<MainApp />} />} /> */}
                </Routes>
            ) : (
                <div className="flex content-wrap w-full h-screen">
                    <Navi />
                    <div className="flex flex-col main-wrap">
                        <SignState />
                        <main className="p-4 w-full main overflow-x-hidden">
                            <AlertProvider>
                                <LoadingProvider>
                                    <Routes>
                                        <Route path="/Schedule" element={<PrivateRoute element={<Schedule />} />} />
                                        <Route path="/listTable" element={<PrivateRoute element={<ListTableDB />} />} />
                                        <Route path="/listSupplier" element={<PrivateRoute element={<ListSupplier2 />} />} />
                                        <Route path="/order" element={<PrivateRoute element={<Charttest />} />} />
                                        <Route path="/Cart" element={<PrivateRoute element={<OrderTEST />} />} />
                                        <Route path="/Board" element={<PrivateRoute element={<Board />} />} />
                                        <Route path="/MyOrderList" element={<PrivateRoute element={<MyOrderList />} />} />
                                        <Route path="/AnnounceForEvery" element={<PrivateRoute element={<AnnounceForEvery />} />} />
                                        <Route path="/AnnounceWrite" element={<PrivateRoute element={<AnnounceWrite />} />} />
                                        <Route path="/AnnounceEdit/:noticeid" element={<PrivateRoute element={<AnnounceEdit />} />} />
                                        <Route path="/Announcement" element={<PrivateRoute element={<Announcement />} />} />
                                        <Route path="/Membership" element={<PrivateRoute element={<Membership />} />} />
                                        <Route path="/Supplierboard" element={<PrivateRoute element={<Supplierboard2 />} />} />
                                        <Route path="/PurchaseRequest" element={<PrivateRoute element={<PurchaseRequest />} />} />
                                        <Route path="/getOrderDetail/:orderId" element={<PrivateRoute element={<OrderManage />} />} />
                                    </Routes>
                                </LoadingProvider>
                            </AlertProvider>
                        </main>
                        <Footer />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
