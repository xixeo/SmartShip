import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navi from './Compo/Navi';
import Footer from './Compo/Footer';
import Schedule from './01/Schedule';
import ListTable from './02/ListTable';
import Order from './03/Order';
import SignUpIn from './Compo/SignUpIn';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 로컬스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        {/* {!isAuthenticated ? (
          <SignUpIn setIsAuthenticated={setIsAuthenticated} />  // 로그인 전
        ) : ( */}
          <div className="flex flex-1">
            <Navi />
            <div className="flex flex-col flex-1">
              <main className="flex-1 p-4 bg-gradient-to-b from-black to-[#1a1b41]">
                <Routes>
                  <Route path="/" element={<MainApp />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/listtable" element={<ListTable />} />
                  <Route path="/order" element={<Order />} />
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
        Welcome, {alias ? alias : 'User'} !
      </h1>
    </div>
  );
}

export default App;
