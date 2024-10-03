import React, { useState } from "react";
import { ReactComponent as UserIcon } from "./User.svg";
import { useNavigate } from "react-router-dom";
import SvgIcon from "./SvgIcon";
import "../assets/theme/SignState.scss";
import { ReactComponent as ArrowDown } from "../assets/icons/svg/arrowDown.svg";
import { ReactComponent as Person } from "../assets/icons/svg/person.svg";

const SignState = () => {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  window.addEventListener('load', () => {
    const token = localStorage.getItem('token');

    // sessionStorage에 토큰이 없다면 로그아웃 처리
    if (token && !sessionStorage.getItem('token')) {
    //  handleLogout()
    }
  });

  const handleToggle = () => {
    setIsLogoutVisible((prevState) => !prevState);
  };

  const username = localStorage.getItem("username");
  const alias = localStorage.getItem("alias");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("alias");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    sessionStorage.removeItem('token');
    navigate("/signin");
    window.location.reload();
  };

  return (
    <div className="sign-state-container">
      <div className="user-info">
        <div className="flex items-center space-x-2 pt-4 text-white">
          <Person width="20" height="20" />
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold text-white">
              {username || "username"}
            </h1>
            <h1 className="text-white">{alias || "alias"} </h1>
            <h1>님</h1>
          </div>
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-6 h-6"
          >
            <ArrowDown />
          </button>
        </div>
        <div
          className={`logout-button-container ${isLogoutVisible ? "show" : "hide"
            }`}
        >
          <button onClick={handleLogout} className="logout-button mr-2">
            <SvgIcon className="text-white mr-2" width="17" height="17" />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignState;
