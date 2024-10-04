import React, { useState, useEffect, useRef } from "react";
import { useLoading } from "../Compo/LoadingContext";
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import Modal from '@mui/material/Modal'
import "../assets/theme/table.scss";

export default function AnnouncementForDash() {
    const [allData, setAllData] = useState([]); //패치된 데이터 저장
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    ////////////////////////////////////////////////////////////
    //               TABLE                                    //
    ////////////////////////////////////////////////////////////

    // DATA PATCH
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                console.error("No token found");
                // showAlert("토큰이 저장되지 않았습니다.", "error");
                return;
            }
            setLoading(true); // 로딩 시작
            try {
                const response = await fetch("/notice", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, //토큰도 함께 가져오기
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                const initialRows = data.map((item, index) => ({
                    boardId: index + 1,
                    noticeId: item.noticeId,
                    title: item.title,
                    author: item.author,
                    createdAt: item.createdAt,
                    status: item.status,
                }));
                const sortdata = initialRows.sort((a, b) => b.boardId - a.boardId)
                setAllData(initialRows); // 전체 데이터 상태로 저장
                setRows(sortdata.slice(0, 3)); // 초기 데이터 테이블에 렌더링
                // console.log(role, "role.....")
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchData();
    }, []);


    return (
        <div className="flex flex-col p-6 h-full dashboard-notice">
            <div className="table-body">
                {rows.map((row) => (
                    <div
                        key={row.noticeId}
                        onClick={() => navigate(`/AnnounceEdit/${row.noticeId}`)}
                        className="flex justify-between items-center py-2 cursor-pointer text-white"
                    >
                        <div className="flex-1 w-1/3 text-base">
                            {row.title}
                        </div>
                        <div className="flex justify-end w-1/3">
                        <div className="flex-1 text-right text-base">
                            {row.author}
                        </div>
                        <div className="flex-1 text-right text-base text-[#939393]">
                            {row.createdAt}
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
