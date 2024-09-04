import React, { useState } from 'react';
import logo from '../Img/logo.png'; 

function SignUpIn({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true); // 로그인과 회원가입 폼을 스위칭하는 상태
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [loginError, setLoginError] = useState('');   // 로그인 에러 상태
  const [signupError, setSignupError] = useState(''); // 회원가입 에러 상태

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 에러 메시지 초기화
    setLoginError('');
    setSignupError('');

    try {
      const url = isLogin ? '/login' : '/signup';
      const body = isLogin
        ? { username, password }
        : { username, password, alias };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // 상태에 따라 에러 메시지 구분
        if (isLogin) {
          throw new Error('로그인 정보가 올바르지 않습니다.');
        } else {
          throw new Error('회원가입에 실패했습니다.\n다시 시도해주세요.');
        }
      }

      const data = await response.json();

      // 로그인 시 토큰과 alias 저장
      if (isLogin) {
        localStorage.setItem('token', data.token);  // 토큰 저장
        localStorage.setItem('alias', data.alias);  // alias 저장
        setIsAuthenticated(true);  // 로그인 성공 상태
      } else {
        // 회원가입 후 자동으로 로그인 처리
        localStorage.setItem('token', data.token);
        localStorage.setItem('alias', data.alias);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // 에러 발생 시 상황에 맞는 메시지를 설정
      if (isLogin) {
        setLoginError(error.message);
      } else {
        setSignupError(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-b from-black to-[#1a1b41]">
      <div className="flex flex-col w-1/4 items-center">
        <img src={logo} alt="Logo" className="mb-2 w-20 h-auto" />
        <span className="logo-text mb-10 ml-5">SMARTSHIP</span>
        <form onSubmit={handleSubmit} className=" bg-white w-full max-w-sm p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center font-poppins">
            {isLogin ? 'SIGN IN' : 'SIGN UP'}
          </h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">닉네임</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          )}

          {/* 로그인 및 회원가입 각각의 에러 메시지 처리 */}
          {isLogin && loginError && <p className="text-red-500 pb-2">{loginError}</p>}
          {!isLogin && signupError && <p
              className="text-red-500 pb-2"
              style={{ whiteSpace: 'pre-wrap' }} // 줄바꿈 처리
            >{signupError}</p>}

          <button
            type="submit"
            className="w-full bg-purple-800 text-white font-bold py-2 px-4 rounded-lg"
          >
            {isLogin ? '로그인' : '회원가입'}
          </button>

          <p className="mt-4 text-sm text-gray-600 text-center">
            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 underline ml-2"
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpIn;
