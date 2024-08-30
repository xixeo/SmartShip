import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navi from './Compo/Navi';
import Footer from './Compo/Footer';
import Schedule from './01/Schedule';
import ListTable from './02/ListTable';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <div className="flex flex-1">
          <Navi />
          <div className="flex flex-col flex-1">
            <main className="flex-1 p-4">
              <Routes>
                <Route path="/" element={<MainApp />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/listtable" element={<ListTable />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

function MainApp() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to the Main App</h1>
    </div>
  );
}

export default App;
