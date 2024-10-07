import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/theme/Navi.scss";
import { Button, Box } from "@mui/material";
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
import Modal2 from "./Modal2";
import { Padding } from "@mui/icons-material";

const Navi = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 사이드바의 확장/축소 상태를 변경하는 함수
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 회원탈퇴 메시지 여부
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  // // 회원탈퇴 모달

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  // 회원탈퇴 후 로그아웃처리, 로그인 페이지로 이동
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("alias");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/signin");
    window.location.reload();
  };

  // 회원탈퇴 처리 함수
  const handleWithdrawal = async () => {
    try {
      // 회원탈퇴 API 호출
      const response = await fetch("/unsub", {
        method: "POST", // DELETE를 POST로 변경
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("회원탈퇴 요청 실패");
      }

      // 회원탈퇴 성공 시 처리
      console.log("회원탈퇴 요청 성공");
      handleLogout();

    } catch (error) {
      console.error("Error during withdrawal:", error.message);
    }
  };

  // 역할에 맞춰서 첫 화면으로 리디렉션하는 함수
const redirectToFirstPage = () => {
  if (role === "ROLE_ADMIN") {
      navigate("/Announcement");
  } else if (role === "ROLE_SUPPLIER") {
      navigate("/Supplierboard");
  } else if (role === "ROLE_MANAGER") {
      navigate("/Board");
  } else {
      navigate("/listTable");
  }
};

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div>
        <div onClick={redirectToFirstPage} className="logo cursor-pointer">
          <img src={logo} alt="Logo" className="logo-image" />
          {!isCollapsed && <span className="logo-text">SMARTSHIP</span>}{" "}
          {/* 축소 시 텍스트 숨기기 */}
        </div>

        <hr className="sidebar-border" />

        {/* menu */}
        <ul className={`menu`}>
          {role === 'ROLE_MANAGER' ? <>
            <li className="menu-item" onClick={() => navigate("/Board")}>
              <Side07 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>대시보드</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
            <li
              className="menu-item"
              onClick={() => navigate("/PurchaseRequest")}
            >
              <Side04 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>발주 요청 내역</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
            <li className="menu-item" onClick={() => navigate("/Schedule")}>
              <Side02 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>일정 관리</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
          </> : null}
          {role === 'ROLE_USER' ? <>
            <li className="menu-item" onClick={() => navigate("/listTable")}>
              <Side05 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>선용품 리스트</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
            <li className="menu-item" onClick={() => navigate("/Cart")}>
              <Side06 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>장바구니</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
            <li className="menu-item" onClick={() => navigate("/MyOrderList")}>
              <Side03 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>주문 내역</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
          </> : null}
          {role === 'ROLE_SUPPLIER' ? <>
            <li className="menu-item" onClick={() => navigate("/Supplierboard")}>
              <Side07 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>대시보드</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
            <li className="menu-item" onClick={() => navigate("/listSupplier")}>
              <Side08 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>판매물품 리스트</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
          </> : null}
          {role === 'ROLE_ADMIN' ? <>
            <li className="menu-item" onClick={() => navigate("/Membership")}>
              <Side09 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>회원관리</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
            <li className="menu-item" onClick={() => navigate("/Announcement")}>
              <Side01 className="icon" />
              <div className="menu-text flex justify-between items-center">
                {!isCollapsed && <span>공지사항</span>}
                {!isCollapsed && <ArrowR width={20} className="right-arrow" />}
              </div>
            </li>
          </> : null}
        </ul>
      </div>
      <div className="withdrawal-button items-center">
        {/* <button
          className="blue-btn items-center"
          variant="contained"
          color="error"
          onClick={handleOpenModal}
          style={{ margin: "10px" }} // 원하는 스타일 추가
        >
          회원 탈퇴
        </button>
        <Modal2
          sx={{ zIndex: 9999, display: 'absolute' }}
          open={isModalOpen}
          setOpen={setIsModalOpen}
          title="정말 탈퇴하시겠습니까?"
          onConfirm={handleWithdrawal}
        /> */}
        {!isCollapsed &&
          <Box sx={{ textAlign: 'center', margin: '20px' }}>
            {isConfirmVisible ? (
              <div>
                <p className="text-white">정말 탈퇴하시겠습니까?</p>
                <button
                  className="blue-btn"
                  style={{
                    margin: '10px'
                  }}
                  onClick={handleWithdrawal}
                >
                  확인
                </button>
                <button
                  className="blue-btn"
                  style={{
                    margin: '10px'
                  }}
                  onClick={() => setIsConfirmVisible(false)} // 취소 클릭 시 버튼으로 돌아감
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                className="blue-btn items-center"
                variant="contained"
                onClick={() => setIsConfirmVisible(true)}
                sx={{
                  margin: "10px",
                  backgroundColor: "#9c87ff",
                  color: "white",
                  '&:hover': {
                    backgroundColor: "#8a76e0",
                  },
                }}
              >
                회원 탈퇴
              </button>
            )}
          </Box>
        }{" "}
      </div>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <span className="arrow">{isCollapsed ? "→" : "←"}</span>
      </div>
    </div>
  );
};

export default Navi;
