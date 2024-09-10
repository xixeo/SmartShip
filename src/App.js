import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import Navi from './Compo/Navi';
import Footer from './Compo/Footer';
import Schedule from './01/Schedule';
import ListTable from './02/ListTable';
import Order from './03/Order';
import OrderTEST from './03/OrderTEST'; 
import BasicDatePicker from './03/BasicDatePicker'; 
import SignUp from './Sign/SignUp';
import SignIn from './Sign/SignIn';
import ListTableTest from './02/ListTableTEST';
import SignState from './Sign/SignState';
import Board from './DashBoard/Board';

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // setIsAuthenticated(true);
    }
  }, []);

  // const PrivateRoute = ({ element }) => {
  //   return isAuthenticated ? element : <Navigate to="/signin" />;
  // };

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        {/* {!isAuthenticated ? (
          <Routes>
            <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} setRedirectPath={setRedirectPath} />} />
            <Route path="*" element={<Navigate to="/signin" />} />
          </Routes>
        ) : ( */}
          <div className="flex flex-1">
            <Navi />
            <SignState/>
            <div className="flex flex-col flex-1">
              <main className="flex-1 p-4 pt-10 bg-gradient-to-b from-black to-[#1a1b41]">
                <Routes>
                  <Route path="/" element={<MainApp />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/listtable" element={<ListTable />} />
                  <Route path="/order" element={<Order />}  />
                  <Route path="/ordertest" element={<OrderTEST />} />
                  <Route path="/ordertest2" element={<BasicDatePicker />} />
                  <Route path="*" element={<Navigate to="/" />} />
                  <Route path="/ListTableTest" element={<ListTableTest />} />  
                  <Route path="/signstate" element={<SignState />} />  
                  <Route path="/Board" element={<Board />} />  
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        {/* )} */}
      </div>
    </BrowserRouter>
  );
}

function MainApp() {
  const alias = localStorage.getItem('alias'); // alias를 로컬스토리지에서 가져오기

  return (
    <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-3xl font-bold text-white">
        {/* Welcome, {alias ? alias : 'User'} ! */}
      </h1>
    </div>
  );
}

export default App;