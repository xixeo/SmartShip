//style.css 막아둬야 SignState.css 우선적용됨

import React, { useState } from 'react';
import { ReactComponent as UserIcon } from './User.svg';
import { useNavigate } from 'react-router-dom';
import SvgIcon from './SvgIcon';
import './SignState.css';

const SignState = () => {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const handleToggle = () => {
    setIsLogoutVisible(prevState => !prevState);
  };

  const username = localStorage.getItem('username');
  const alias = localStorage.getItem('alias');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('alias');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="sign-state-container">
      <div className="user-info">
        <div className='flex items-center space-x-2 pt-4 text-white'>
          <UserIcon width="32" height="32" />
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold text-white">
              {username || 'username'}
            </h1>
            <h1 className="text-white">
              ({alias || 'alias'})
            </h1>
            <h1>님</h1>
          </div>
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-6 h-6"
          >
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-0.000326157 -4.07973e-07L9.33301 0L4.66634 5.33333L-0.000326157 -4.07973e-07Z" fill="white"/>
            </svg>
          </button>
        </div>
        <div className={`logout-button-container ${isLogoutVisible ? 'show' : 'hide'}`}>
          <button
            onClick={handleLogout}
            className="logout-button mr-2"
          >
            <SvgIcon className="text-white mr-2" width="17" height="17" />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignState;
