import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/img/logo.png";
import "../assets/theme/login.scss";
import Checkbox from '@mui/material/Checkbox';

function SignIn({ setIsAuthenticated, setRedirectPath }) {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [remember, setRemember] = useState(false); // 아이디 저장할지 체크박스 상태
  const navigate = useNavigate();

  // storage 이벤트 리스너 추가 (다른 탭에서 토큰이 변경되면 호출됨)
  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      const newToken = event.newValue;
      if (newToken) {
        // 새로운 토큰이 있으면, 세션 스토리지에 저장
        sessionStorage.setItem('token', newToken);
      } else {
        // 토큰이 삭제된 경우 (로그아웃 시), 세션 스토리지에서도 삭제
        sessionStorage.removeItem('token');
      }
    }
  });

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 아이디를 가져와서 설정
  React.useEffect(() => {
    const storedId = localStorage.getItem("storedId");
    if (storedId) {
      setId(storedId);
      setRemember(true); // 저장된 아이디가 있을 경우 체크박스 체크
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    const url = "/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, username, pw }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setLoginError(errorText || "로그인에 실패하였습니다.");
        return;
      }

      const token = response.headers.get("Authorization");

      if (token) {
        const cleanedToken = token.replace("Bearer ", "");
        const decodedToken = jwtDecode(cleanedToken);

        // 필요한 정보를 로컬 스토리지에 저장
        const username = decodedToken.username;
        const alias = decodedToken.alias;
        const role = decodedToken.role;

        localStorage.setItem("token", cleanedToken);
        sessionStorage.setItem('token', cleanedToken);
        localStorage.setItem("id", id);
        localStorage.setItem("username", username);
        localStorage.setItem("alias", alias);
        localStorage.setItem("role", role);

        // 체크박스가 체크되어 있으면 아이디를 로컬 스토리지에 저장
        if (remember) {
          localStorage.setItem("storedId", id);
        } else {
          localStorage.removeItem("storedId"); // 체크 해제 시 저장된 아이디 삭제
        }

        setIsAuthenticated(true);

        // 로그인 성공 후 원래 페이지로 리디렉션
        navigate(setRedirectPath || "/");
      } else {
        setLoginError("토큰을 서버에서 받지 못했습니다.");
      }
    } catch (error) {
      setLoginError(error.message);
    }

  };

  return (
    <div className="flex items-center justify-center h-full login">
      {/* <div className="flex items-center justify-center h-full bg-gradient-to-b from-black to-[#1a1b41]"> */}
      <div className="w-1/4 form-wrap min-w-96 py-6 min-h-96 rounded-lg shadow-lg flex flex-col justify-center items-center">
        <div className="flex items-center logo-wrap">
          <img src={logo} alt="Logo" className="w-12 h-auto" />
          <span className="logoText">SMARTSHIP</span>
        </div>
        <form onSubmit={handleSubmit} className=" w-full w-md p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            SIGN IN
          </h2>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              아이디
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="w-full px-1 py-2 login-input"
            />
          </div>
          <div className="mt-10 mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              className="w-full px-1 py-2 login-input"
            />
          </div>
          {loginError && <p className="text-red-500 pb-2">{loginError}</p>}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <Checkbox
                checked={remember}
                onChange={() => setRemember((prev) => !prev)}
                className="w-4 h-4 text-primary"
                sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remember" className="text-white">
                ID 저장
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full blue-btn2 text-white font-bold py-3 px-4 rounded-lg mt-8"
          >
            로그인
          </button>
          <p className="mt-4 text-sm text-gray-600 text-center">
            계정이 없으신가요?
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[#9c87ff] underline ml-2"
            >
              회원가입
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;