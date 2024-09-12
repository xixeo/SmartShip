import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Img/logo.png';

function SignUp({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState('ROLE_USER'); // 기본 역할을 'user'로 설정
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');

    try {
      const url = '/signup';
      const body = { username, pw, alias, role };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get('Content-Type');
      let text = await response.text();
      console.log('Response Text:', text); // 응답 내용 로그

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다.\n다시 시도해주세요.');
      }

      // 응답이 JSON일 경우에만 파싱
      if (contentType && contentType.includes('application/json')) {
        const data = JSON.parse(text);
        localStorage.setItem('token', data.token);
        localStorage.setItem('alias', data.alias);
        setIsAuthenticated(true);
      } else {
        // JSON이 아닌 경우에 메시지 표시
        setSignupError(text);
        return;
      }

      // 성공 시 로그인 페이지로 이동
      navigate('/signin');
    } catch (error) {
      setSignupError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-b from-black to-[#1a1b41]">
      <div className="flex flex-col w-1/4 items-center">
        <img src={logo} alt="Logo" className="mb-2 w-20 h-auto" />
        <span className="logo-text mb-10 ml-5">SMARTSHIP</span>
        <form onSubmit={handleSubmit} className="bg-white w-full max-w-sm p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center font-poppins">SIGN UP</h2>
          
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-bold mb-2">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-bold mb-2">닉네임</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-5">
            <span className="block text-gray-700 text-sm font-bold mb-2">회원 권한 선택</span>
            <div className="flex justify-center items-center">
              <input
                type="radio"
                id="roleUser"
                name="role"
                value="ROLE_USER"
                checked={role === 'ROLE_USER'}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="roleUser" className="mr-4">선박</label>

              <input
                type="radio"
                id="roleManager"
                name="role"
                value="ROLE_MANAGER"
                checked={role === 'ROLE_MANAGER'}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="roleManager" className="mr-4">해운선사</label>

              <input
                type="radio"
                id="roleSupplier"
                name="role"
                value="ROLE_SUPPLIER"
                checked={role === 'ROLE_SUPPLIER'}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="roleSupplier">판매자</label>
            </div>
          </div>

          {signupError && <p className="text-red-500 pb-2" style={{ whiteSpace: 'pre-wrap' }}>{signupError}</p>}

          <button
            type="submit"
            className="w-full bg-purple-800 text-white font-bold py-2 px-4 rounded-lg"
          >
            회원가입
          </button>

          <p className="mt-4 text-sm text-gray-600 text-center">
            이미 계정이 있으신가요?
            <button
              type="button"
              onClick={() => navigate('/signin')} // 로그인 페이지로 이동
              className="text-purple-600 underline ml-2"
            >
              로그인
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
