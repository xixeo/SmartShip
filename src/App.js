import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import './App.css';
import Navi from './Compo/Navi';
import Footer from './Compo/Footer.js';
import Schedule from './01/Schedule.js';
import ListTable from './02/ListTable.js';

function App() {
  return (
    <BrowserRouter>
      <div className='flex'>
        <Navi />
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/listtable" element={<ListTable />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function MainApp() {
  return (
    <div className='flex flex-col w-full h-screen'>
      <main>
        {/* MainApp content here */}
      </main>
    </div>
  );
}

export default App;
