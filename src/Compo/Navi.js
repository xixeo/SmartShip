import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/theme/Navi.scss";
import logo from "../assets/img/logo.png";
import { ReactComponent as Side01 } from "../assets/icons/svg/side01.svg";
import { ReactComponent as Side02 } from "../assets/icons/svg/side02.svg";
import { ReactComponent as Side03 } from "../assets/icons/svg/side03.svg";
import { ReactComponent as Side04 } from "../assets/icons/svg/side04.svg";
import { ReactComponent as Side05 } from "../assets/icons/svg/side05.svg";
import { ReactComponent as Side06 } from "../assets/icons/svg/side06.svg";
import { ReactComponent as Side07 } from "../assets/icons/svg/side07.svg";
import { ReactComponent as Side08 } from "../assets/icons/svg/side08.svg";
import { ReactComponent as Side09 } from "../assets/icons/svg/side09.svg";
import { ReactComponent as ArrowR } from "../assets/icons/svg/arrowR.svg";
// import {
//   FaBox,
//   FaShoppingCart,
//   FaCalendarAlt,
//   FaChevronRight,
// } from "react-icons/fa";

const Navi = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // 사이드바의 확장/축소 상태를 변경하는 함수
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div>
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
          {!isCollapsed && <span className="logo-text">SMARTSHIP</span>}{" "}
          {/* 축소 시 텍스트 숨기기 */}
        </div>

        <hr className="sidebar-border" />

        {/* menu */}
        <ul className={`menu`}>
          <li className="menu-item" onClick={() => navigate("/schedule")}>
            <Side01 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>일정 관리</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/listtabledb")}>
            <Side02 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>선용품 리스트</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/listsupplier2")}>
            <Side03 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>판매물품 리스트</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/ordertest")}>
            <Side04 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>발주 스케줄링</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/MyOrderList")}>
            <Side05 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>구매요청 내역</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/PurchaseRequest")}>
            <Side06 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>구매요청</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/Board")}>
            <Side07 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>해운선사 대시보드</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/SupplierBoard")}>
            <Side07 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>판매자 대시보드</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/Membership")}>
            <Side08 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>회원관리</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/Announcement")}>
            <Side09 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>공지사항(관리자)</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/AnnounceWrite")}>
            <Side09 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>공지사항 글쓰기</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
          <li className="menu-item" onClick={() => navigate("/AnnounceForEvery")}>
            <Side09 className="icon" />
            <div className="menu-text flex justify-between items-center">
              {!isCollapsed && <span>공지사항</span>}
              {!isCollapsed && <ArrowR className="right-arrow" />}
            </div>
          </li>
        </ul>
      </div>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <span className="arrow">{isCollapsed ? "→" : "←"}</span>
      </div>
    </div>
  );
};

export default Navi;
