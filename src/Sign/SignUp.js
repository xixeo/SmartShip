import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/theme/login.scss";
import { Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";

function SignUp({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [alias, setAlias] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("ROLE_USER"); // 기본 역할을 'user'로 설정
  const [signupError, setSignupError] = useState("");
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    try {
      const url = "/signup";
      const body = { id, username, pw, alias, role, phone };

      // 회원가입 데이터 콘솔 출력
      console.log("회원가입 데이터:", body);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = response.headers.get("Content-Type");
      let text = await response.text();
      console.log("Response Text:", text); // 응답 내용 로그

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.\n다시 시도해주세요.");
      }

      // 응답이 JSON일 경우에만 파싱
      if (contentType && contentType.includes("application/json")) {
        const data = JSON.parse(text);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("alias", data.alias);
        localStorage.setItem("role", role);
        localStorage.setItem("phone", phone);
        setIsAuthenticated(true);
      } else {
        // JSON이 아닌 경우에 메시지 표시
        setSignupError(text);
        return;
      }

      // 성공 시 로그인 페이지로 이동
      navigate("/signin");
    } catch (error) {
      setSignupError(error.message);
    }
  };

  // 회사명 또는 선박명 중복 확인 함수
  const checkDuplicate = async (type) => {
  try {
    // 중복 확인할 데이터
    const params = {username};

    console.log("중복 확인 요청 데이터:", params); // 요청 데이터 콘솔 출력

    const response = await fetch(`/idCheck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    
    // 응답 상태 로그
    console.log("응답 상태:", response.status);
    const data = await response.json();
    console.log("전체 회원 데이터:", data); // API로부터 받은 데이터 콘솔 출력
  } 
  catch (error) {
    console.error("오류 발생:", error); // 오류 발생 시 오류 메시지 콘솔 출력
  }
};

    // if (exists) {
    //   if (type === "username") {
    //     setUsernameCheckMessage("이미 존재하는 회사명 또는 선박명입니다.");
    //   } else {
    //     setAliasCheckMessage("이미 존재하는 아이디입니다.");
    //   }
    // } else {
    //   if (type === "username") {
    //     setUsernameCheckMessage("사용 가능한 아이디입니다.");
    //   } else {
    //     setAliasCheckMessage("사용 가능한 아이디입니다.");
    //   }
    // }

//   } catch (error) {
//     console.error("오류 발생:", error); // 오류 발생 시 오류 메시지 콘솔 출력
//     if (type === "username") {
//       setUsernameCheckMessage("회사명 또는 선박명 중복 확인 중 오류가 발생했습니다.");
//     } else {
//       setAliasCheckMessage("아이디 중복 확인 중 오류가 발생했습니다.");
//     }
//   }
// };

  const checkId = () => {
    checkDuplicate("id");
  };
  // const checkAlias = () => {
  //   checkDuplicate("alias");
  // };

  return (
    <div className="flex items-center justify-center h-full login">
      <div className="w-1/4 form-wrap min-w-96 py-6 min-h-96 rounded-lg shadow-lg flex flex-col justify-center items-center">
        <div className="flex items-center logo-wrap">
          <img src={logo} alt="Logo" className="w-12 h-auto" />
          <span className="logoText">SMARTSHIP</span>
        </div>
        <form onSubmit={handleSubmit} className="w-full w-md p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            SIGN UP
          </h2>

          {/* 회사명 또는 선박명 입력란 */}
          <div className="mb-4 ">
            <label className="block text-white text-sm font-bold mb-2 mr-2">
              <span className="text-white">*</span> { role === "ROLE_MANAGER" ? "해운선사명" : role === "ROLE_SUPPLIER" ? "공급업체명" : "선박명" }
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-1 py-2 login-input"
            />
            </div>

          {/* 닉네임 입력란 */}
          <div className="mt-10 mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              <span className="text-white">*</span> 닉네임
            </label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              required
              className="w-full px-1 py-2 login-input"
            />
          </div>

          {/* 아이디 입력란 */}
          <div className="mt-10 mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              <span className="text-white">*</span> 아이디
            </label>
            <div className="flex">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="w-4/5 px-1 py-2 login-input"
            />
          <button
              type="button"
              onClick={checkId}
              className="w-1/5 check-btn ml-2 text-sm"
              >
              중복확인
            </button>
             </div>
            </div>
          {idCheckMessage && (
            <p className="text-sm text-red-500 mb-4">{idCheckMessage}</p>
          )}

          {/* 비밀번호 입력란 */}
          <div className="mt-10 mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              <span className="text-white">*</span> 비밀번호
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              className="w-full px-1 py-2 login-input"
            />
          </div>

          {/* 연락처 입력란 */}
          <div className="mt-10 mb-4">
            <label className="block text-white text-sm font-bold mb-2 mr-2">
              <span className="text-white">*</span> 연락처
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                const cleanedPhone = e.target.value.replace(/-/g, ''); // '-' 제거
                setPhone(cleanedPhone);
              }}
              required
              className="w-full px-1 py-2 login-input"
            />
          </div>

          {/* 회원 유형 */}
          <div className="mt-10 mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              회원 유형
            </label>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <FormControlLabel
                  value="ROLE_MANAGER"
                  control={<Radio sx={{ color: "#ffffff", '&.Mui-checked': { color: "#ffffff" }, transform: "scale(0.8)" }} />}
                  label="해운선사"
                  sx={{ color: "#ffffff", transform: "scale(0.9)" }}
                />
                <FormControlLabel
                  value="ROLE_SUPPLIER"
                  control={<Radio sx={{ color: "#ffffff", '&.Mui-checked': { color: "#ffffff" }, transform: "scale(0.8)" }} />}
                  label="공급업체"
                  sx={{ color: "#ffffff", transform: "scale(0.9)" }}
                />
                <FormControlLabel
                  value="ROLE_USER"
                  control={<Radio sx={{ color: "#ffffff", '&.Mui-checked': { color: "#ffffff" }, transform: "scale(0.8)" }} />}
                  label="선박"
                  sx={{ color: "#ffffff", transform: "scale(0.9)" }}
                />
              </RadioGroup>
            </FormControl>
          </div>

          {signupError && (
            <p className="text-red-500 pb-2" style={{ whiteSpace: "pre-wrap" }}>
              {signupError}
            </p>
          )}

          <button
            type="submit"
            className="w-full login-btn text-white font-bold py-2 px-4 rounded-lg mt-10"
          >
            회원가입
          </button>
          <p className="mt-4 text-sm text-gray-600 text-center">
            이미 계정이 있으신가요?
            <button
              type="button"
              onClick={() => navigate("/signin")} // 로그인 페이지로 이동
              className="text-[#43c5fe] underline ml-2"
            >
              로그인
            </button>
          </p>
        </form>
        <p className="text-sm text-gray-300 text-start w-full w-md px-8 rounded-lg">
          * 는 필수 입력 항목입니다.
        </p>
      </div>
    </div>
  );
}

export default SignUp;