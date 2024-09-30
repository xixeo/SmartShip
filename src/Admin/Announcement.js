import React, { useState, useEffect, useRef } from "react";
import { useAlert } from "../Compo/AlertContext";
import { useLoading } from "../Compo/LoadingContext";
import { jwtDecode } from "jwt-decode";
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Checkbox,
    Pagination,
    Switch,
    Select,
    MenuItem,
    Modal,
    Box,
} from "@mui/material";
// import Modal from '@mui/material/Modal'
import "../assets/theme/table.scss";

export default function Announcement() {
    const [allData, setAllData] = useState([]); //패치된 데이터 저장
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [page, setPage] = useState(1); // 현재 페이지
    const [currentPage, setCurrentPage] = useState(1);
    const { showAlert } = useAlert(); // useAlert 훅 사용
    const { setLoading } = useLoading();

    // useEffect를 사용하여 컴포넌트가 마운트될 때 초기 데이터를 설정
    // 조회버튼을 누르지 않아도 초기에 전체 데이터 한번 렌더링 시키기
    const token = localStorage.getItem("token");
    const cleanedToken = token.replace("Bearer ", "");
    const decodedToken = jwtDecode(cleanedToken);

    // 삭제 btn -> modal 오픈
    const [preleadopen, setPreleadOpen] = useState(false);

    // 필요한 토큰 정보를 로컬 스토리지에 저장
    const role = decodedToken.role;
    localStorage.setItem("token", cleanedToken);
    localStorage.setItem("role", role);

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
                    views: item.views,
                    status: item.status,
                }));

                setAllData(initialRows); // 전체 데이터 상태로 저장
                setRows(initialRows); // 초기 데이터 테이블에 렌더링
                showAlert("조회에 성공했습니다.", "success");
                // console.log(role, "role.....")
            } catch (error) {
                console.error("Fetch error:", error);
                showAlert("데이터를 가져오는 데 실패했습니다.", "error");
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchData();
    }, []);

    //status 저장
    const handleStatusChange = async (noticeId, event) => {
        const newStatus = event.target.checked;

        // rows 상태 업데이트
        setRows(
            rows.map((row) =>
                row.noticeId === noticeId ? { ...row, status: newStatus } : row
            )
        );

        // FormData 객체 생성
        const formData = new FormData();
        formData.append("status", newStatus);

        try {
            // noticeId를 URL에 포함하여 요청
            const response = await fetch(`/noticeStatus/${noticeId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, // 토큰 인증 헤더 추가
                },
                body: formData, // FormData로 상태 전송
            });

            if (response.ok) {
                showAlert("공지사항 상태를 변경 했습니다.", "success");
            } else {
                console.error("status 변경 실패:", response.statusText);
                showAlert("공지사항 상태를 변경하지 못했습니다.", "error");
            }
        } catch (error) {
            console.error("status 변경 중 오류 발생:", error);
            showAlert("공지사항 상태를 변경하지 못했습니다.", "error");
        }
    };

    //PAGINATION
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setCurrentPage(1); // 페이지 수가 변경되면 첫 페이지로 이동
    };
    // 현재 페이지에 맞는 데이터를 필터링
    const paginatedRows = rows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    ////////////////////////////////////////////////////////////
    //               조회조건 - BTN EVENT                      //
    ////////////////////////////////////////////////////////////
    // 삭제 핸들러
    const handleDeleteRows = async () => {
        if (selectedRows.size === 0) {
            alert("삭제할 항목을 선택하세요.");
            return;
        }
        // 선택된 행들의 noticeId 리스트 생성
        const selectedNoticeIds = Array.from(selectedRows)
            .map((boardId) => {
                const selectedRow = rows.find((row) => row.boardId === boardId);
                if (selectedRow) {
                    console.log("삭제할 noticeId:", selectedRow.noticeId); // noticeId 콘솔 출력
                    return selectedRow.noticeId;
                }
                return null;
            })
            .filter((id) => id !== null); // null 값 필터링

        try {
            // DELETE 요청 보내기 (상대 경로로 수정)
            const response = await fetch("/noticeDelete", {
                // 'proxy'에 설정된 서버로 요청이 전송됨
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // 토큰 필요 시 추가
                },
                body: JSON.stringify(selectedNoticeIds), // 배열을 그대로 보냄
            });

            if (response.ok) {
                showAlert("공지사항이 삭제되었습니다.", "success");
                setPreleadOpen(false);
                // 삭제 후 테이블에서 행 제거
                setRows(rows.filter((row) => !selectedRows.has(row.boardId)));
                setSelectedRows(new Set()); // 선택된 행 초기화
            } else {
                console.error("삭제 실패:", response.statusText);
                setPreleadOpen(false);
                showAlert("삭제 중 오류가 발생하였습니다.", "error");
            }
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
            setPreleadOpen(false);
            showAlert("삭제 중 오류가 발생하였습니다.", "error");
        }
    };

    ////////////////////////////////////////////////////////////
    //               CHECK BOX                                //
    ////////////////////////////////////////////////////////////

    // 전체 선택 체크박스 핸들러
    const handleSelectAllRows = (event) => {
        if (event.target.checked) {
            // 전체 선택: 모든 행의 boardId를 선택
            const allRowIds = rows.map((row) => row.boardId);
            setSelectedRows(new Set(allRowIds));
        } else {
            // 전체 해제: 선택된 행을 모두 비움
            setSelectedRows(new Set());
        }
    };

    // 체크박스 핸들러
    const handleSelectRow = (row) => {
        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(row.boardId)) {
                newSelectedRows.delete(row.boardId); // 이미 선택된 행은 선택 해제
            } else {
                newSelectedRows.add(row.boardId); // 선택되지 않은 행은 선택
            }

            // noticeId를 콘솔에 출력
            console.log("Selected noticeId:", row.noticeId);

            return newSelectedRows;
        });
    };

    return (
        <div className="flex flex-col p-6 h-full list-table-root">
            // 모달 컴포넌트 부분 수정
            <div className="flex justify-between m-2 p-2">
                <Modal open={preleadopen} onClose={() => setPreleadOpen(false)}>
                    <Box
                        className="modalContent"
                        sx={{
                            color: "black",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "400px",
                            height: "200px",
                            bgcolor: "#17161D",
                            p: 1,
                            borderRadius: 2,
                            boxShadow: 24,
                        }}
                    >
                        <div className="flex flex-col items-center">
                            <div className="text-2xl text-white mt-6 mb-2">
                                정말 삭제하시겠습니까?
                            </div>
                            <div className="text-sm text-[#a1a1a1] mb-8">
                                첨부 파일 내용도 함께 삭제됩니다.
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setPreleadOpen(false)}
                                    className="blue-btn ml-2"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleDeleteRows}
                                    className="blue-btn2 ml-2"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </Box>
                </Modal>
            </div>
            <div className="text-xl font-semibold text-white mb-4">
                공지사항
            </div>
            <div className="flex justify-end">
                <input className="textfield" placeholder="검색" />
                <button className="blue-btn ml-2">검색</button>
                {role === "ROLE_ADMIN" ? (
                    <button
                        onClick={() => setPreleadOpen(true)}
                        className="blue-btn ml-2"
                    >
                        선택 삭제
                    </button>
                ) : (
                    ""
                )}
            </div>
            <TableContainer
                style={{
                    marginTop: "10px",
                    borderRadius: "0.375rem",
                }}
            >
                <Table aria-label="table">
                    <TableHead>
                        <TableRow>
                            {role === "ROLE_ADMIN" ? (
                                <TableCell>
                                    <Checkbox
                                        checked={
                                            selectedRows.size === rows.length &&
                                            rows.length > 0
                                        }
                                        indeterminate={
                                            selectedRows.size > 0 &&
                                            selectedRows.size < rows.length
                                        }
                                        onChange={handleSelectAllRows}
                                    />
                                </TableCell>
                            ) : (
                                ""
                            )}
                            <TableCell align="center">No.</TableCell>
                            <TableCell align="center">제목</TableCell>
                            <TableCell align="center">작성자</TableCell>
                            <TableCell align="center">작성일자</TableCell>
                            <TableCell align="center">조회수</TableCell>
                            {/* ROLE_ADMIN 아닐 시 컬럼 숨김 */}
                            {role === "ROLE_ADMIN" ? (
                                <TableCell align="center">노출여부</TableCell>
                            ) : (
                                ""
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row) => (
                            <React.Fragment key={row.noticeId}>
                                <TableRow>
                                    {role === "ROLE_ADMIN" ? (
                                        <TableCell style={{ width: "50px" }}>
                                            <Checkbox
                                                checked={selectedRows.has(
                                                    row.boardId
                                                )} // Set 객체에서 선택된 행의 boardId가 있는지 확인
                                                onChange={() =>
                                                    handleSelectRow(row)
                                                } // 체크박스 선택 핸들러에 row 객체 전달
                                            />
                                        </TableCell>
                                    ) : (
                                        ""
                                    )}
                                    <TableCell align="center">
                                        {row.boardId}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.title}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.author}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.createdAt}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.views}
                                    </TableCell>
                                    {/* ROLE_ADMIN 아닐 시 컬럼 숨김 */}
                                    {role === "ROLE_ADMIN" ? (
                                        <TableCell align="center">
                                            <Switch
                                                checked={row.status ?? true}
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        row.noticeId,
                                                        event
                                                    )
                                                }
                                                color="secondary"
                                            />
                                        </TableCell>
                                    ) : (
                                        ""
                                    )}
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="mt-6 flex justify-between items-center bottomWrap">
                <div className="flex items-center">
                    <div className="flex gap-4">
                        <Select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="select-custom"
                        >
                            {[5, 10, 15].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="pagination-container">
                    <Pagination
                        count={Math.ceil(rows.length / rowsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                    />
                </div>
                <button className="blue-btn2">글쓰기</button>
            </div>
        </div>
    );
}
