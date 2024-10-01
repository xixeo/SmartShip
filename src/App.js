import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import ListSupplier from "./02/ListSupplier";
import ListSupplier2 from "./02/ListSupplier2";
import Order from "./03/Order";
import OrderTEST from "./03/OrderTEST";
import BasicDatePicker from "./03/BasicDatePicker";
import MyOrderList from "./04/MyOrderList";
import PurchaseRequest from "./DashBoard/PurchaseRequest";
import OrderManage from "./DashBoard/OrderManage";
import AnnounceForEvery from "./Compo/AnnounceForEvery";
import AnnounceWrite from "./Admin/AnnounceWrite";
import AnnounceEdit from "./Admin/AnnounceEdit";
import Announcement from "./Admin/Announcement";
import Membership from "./Admin/Membership";
import SupplierBoard from "./DashBoard/SupplierBoard";
import { createTheme, ThemeProvider } from "@mui/material";
import { AlertProvider } from "./Compo/AlertContext";
import { LoadingProvider } from "./Compo/LoadingContext";

function App() {
    const theme = createTheme({
        typography: {
            fontFamily: "Pretendard",
        },
    });

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [redirectPath, setRedirectPath] = useState("/");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const isAuthenticatedNow = !!token; 
        if (isAuthenticatedNow !== isAuthenticated) {
            setIsAuthenticated(isAuthenticatedNow); 
        }
    }, [isAuthenticated]);
    

    const PrivateRoute = ({ element }) => {
        // setLoading(true)
        return isAuthenticated ? element : <Navigate to="/signin" />;
    };

    console.log('인증확인', isAuthenticated)
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <div className="flex flex-col h-screen w-full">
                    {!isAuthenticated ? (
                        <Routes>
                            <Route
                                path="/signup"
                                element={
                                    <SignUp
                                        setIsAuthenticated={setIsAuthenticated}
                                    />
                                }
                            />
                            <Route
                                path="/signin"
                                element={
                                    <SignIn
                                        setIsAuthenticated={setIsAuthenticated}
                                        setRedirectPath={()=>setRedirectPath("/")}
                                    />
                                }
                            />
                            <Route
                                path="/ListSupplier2"
                                element={
                                    <ListSupplier2
                                        setIsAuthenticated={setIsAuthenticated}
                                        setRedirectPath={()=>setRedirectPath("/")}
                                    />
                                }
                            />
                            <Route path="/" element={<PrivateRoute element={<MainApp />} />} />
                        </Routes>
                    ) : (
                        <div className="flex content-wrap w-full h-screen">
                            <Navi />
                            <div className="flex flex-col main-wrap">
                                {/* <div className="flex flex-col flex-1 bg-gradient-to-b from-black to-[#1a1b41] min-w-[1000px]"> */}
                                <SignState />
                                <main className="p-4 w-full main overflow-x-hidden">
                                    <AlertProvider>
                                        {/* 여기 로딩넣기 */}
                                        <LoadingProvider>
                                            <Routes>
                                                <Route path="/schedule" element={<PrivateRoute element={<Schedule />} />} />
                                                <Route path="/listtabledb" element={<PrivateRoute element={<ListTableDB />} />} />
                                                <Route path="/listsupplier" element={<PrivateRoute element={<ListSupplier />} />} />
                                                <Route path="/listsupplier2" element={<PrivateRoute element={<ListSupplier2 />} />} />
                                                <Route path="/order" element={<PrivateRoute element={<Order />} />} />
                                                <Route path="/ordertest" element={<PrivateRoute element={<OrderTEST />} />} />
                                                <Route path="/ordertest2" element={<PrivateRoute element={<BasicDatePicker />} />} />
                                                <Route path="/signstate" element={<PrivateRoute element={<SignState />} />} />
                                                <Route path="/Board" element={<PrivateRoute element={<Board />} />} />
                                                <Route path="/MyOrderList" element={<PrivateRoute element={<MyOrderList />} />} />
                                                <Route path="/AnnounceForEvery" element={<PrivateRoute element={<AnnounceForEvery />} />} />
                                                <Route path="/AnnounceWrite" element={<PrivateRoute element={<AnnounceWrite />} />} />
                                                <Route path="/AnnounceEdit/:noticeid" element={<PrivateRoute element={<AnnounceEdit />} />} />
                                                <Route path="/Announcement" element={<PrivateRoute element={<Announcement />} />} />
                                                <Route path="/Membership" element={<PrivateRoute element={<Membership />} />} />
                                                <Route path="/SupplierBoard" element={<PrivateRoute element={<SupplierBoard />} />} />
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
            </BrowserRouter>
        </ThemeProvider>
    );
}

function MainApp() {
    const alias = localStorage.getItem("alias"); // alias를 로컬스토리지에서 가져오기

    return (
        <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">
                Welcome, {alias ? alias : "User"} !
            </h1>
        </div>
    );
}

export default App;
