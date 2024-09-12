import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navi.css'; 
import logo from '../Img/logo.png'; 
import { FaBox, FaShoppingCart, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';


const Navi = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // 사이드바의 확장/축소 상태를 변경하는 함수
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-image" />
        {!isCollapsed && <span className="logo-text">SMARTSHIP</span>} {/* 축소 시 텍스트 숨기기 */}
      </div>
      <ul className={`menu`}>
        <li className="menu-item" onClick={() => navigate('/schedule')}>
          <FaCalendarAlt className="icon" />
          {!isCollapsed && <span>일정 관리</span>}
          {!isCollapsed && <FaChevronRight className="right-arrow" />} 
        </li>
        <li className="menu-item" onClick={() => navigate('/listtabledb')}>
          <FaBox className="icon" />
          {!isCollapsed && <span>선용품 리스트</span>}
          {!isCollapsed && <FaChevronRight className="right-arrow" />}
        </li>
        <li className="menu-item" onClick={() => navigate('/listtablesupplier')}>
          <FaBox className="icon" />
          {!isCollapsed && <span>판매물품 리스트</span>}
          {!isCollapsed && <FaChevronRight className="right-arrow" />}
        </li>
        <li className="menu-item" onClick={() => navigate('/ordertest')}> 
          <FaShoppingCart className="icon" />
          {!isCollapsed && <span>발주 스케줄링</span>}
          {!isCollapsed && <FaChevronRight className="right-arrow" />}
        </li>
      </ul>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <span className="arrow">{isCollapsed ? '→' : '←'}</span>
      </div>
    </div>
  );
};

export default Navi;
