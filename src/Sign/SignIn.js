import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logo from '../Img/logo.png';

function SignIn({ setIsAuthenticated, setRedirectPath }) {
    const [username, setUsername] = useState('');
    const [pw, setPw] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        const url = '/login';

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, pw }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setLoginError(errorText || "로그인에 실패하였습니다.");
                return;
            }

            const token = response.headers.get('Authorization');

            if (token) {
                const cleanedToken = token.replace('Bearer ', '');
                const decodedToken = jwtDecode(cleanedToken);
                const alias = decodedToken.alias;
                localStorage.setItem("token", cleanedToken);
                localStorage.setItem('alias', alias);

                setIsAuthenticated(true);

                // 로그인 성공 후 원래 페이지로 리디렉션
                navigate(setRedirectPath || '/');
            } else {
                setLoginError("토큰을 서버에서 받지 못했습니다.");
            }
        } catch (error) {
            setLoginError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-full bg-gradient-to-b from-black to-[#1a1b41]">
            <div className="flex flex-col w-1/4 items-center">
                <img src={logo} alt="Logo" className="mb-2 w-20 h-auto" />
                <span className="logo-text mb-10 ml-5">SMARTSHIP</span>
                <form onSubmit={handleSubmit} className="bg-white w-full max-w-sm p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center font-poppins">SIGN IN</h2>
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
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    {loginError && <p className="text-red-500 pb-2">{loginError}</p>}
                    <button
                        type="submit"
                        className="w-full bg-purple-800 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        로그인
                    </button>
                    <p className="mt-4 text-sm text-gray-600 text-center">
                        계정이 없으신가요?
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="text-purple-600 underline ml-2"
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
