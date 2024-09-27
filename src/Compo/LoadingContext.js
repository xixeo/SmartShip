import React, { createContext, useState, useContext } from "react";
import { ClimbingBoxLoader } from "react-spinners";

// 로딩 컨텍스트 생성
const LoadingContext = createContext();

// 로딩 컨텍스트 프로바이더 생성
export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,

                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 9999,
                        width: "100vw",
                        height: "100vh"
                    }}
                >
                    <ClimbingBoxLoader
                        color="#9DEDFF"
                        loading
                        size={20}
                        speedMultiplier={1}
                        style={{
                            top: "50%",
                            left: "calc(50% + 100px)",
                            position:"absolute",
                        }}
                    />
                </div>
            )}
        </LoadingContext.Provider>
    );
};

// 로딩 컨텍스트를 사용하는 커스텀 훅
export const useLoading = () => useContext(LoadingContext);
