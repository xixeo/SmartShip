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
    Pagination,
    Switch,
    Select,
    MenuItem,
    Modal,
    Box,
} from "@mui/material";
import "../assets/theme/table.scss";

export default function Membership() {
    const [allData, setAllData] = useState([]); //패치된 데이터 저장
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [page, setPage] = useState(1); // 현재 페이지
    const [currentPage, setCurrentPage] = useState(1);
    const [showEnabledOnly, setShowEnabledOnly] = useState(false); // 스위치 상태 관리
    const { showAlert } = useAlert(); // useAlert 훅 사용
    const { setLoading } = useLoading();
    const [editingRowId, setEditingRowId] = useState(null); // 수정 중인 행의 ID 저장
    const [editedData, setEditedData] = useState({}); // 수정된 데이터 상태 관리
    const [isEditing, setIsEditing] = useState(null); // 수정 중인 행 ID
    const [editingRow, setEditingRow] = useState({}); // 수정할 데이터
    const [originalRow, setOriginalRow] = useState(null); // 원래 데이터 저장

    const token = localStorage.getItem("token");
    const cleanedToken = token.replace("Bearer ", "");
    const decodedToken = jwtDecode(cleanedToken);

    // 수정 btn -> modal 오픈
    const [preleadopen, setPreleadOpen] = useState(false);

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
                return;
            }
            setLoading(true); // 로딩 시작
            try {
                const response = await fetch("/member", {
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
                    id: item.id,
                    username: item.username,
                    alias: item.alias,
                    role: item.role,
                    phone: item.phone,
                    etc: item.etc,
                    regdate: item.regdate,
                    enabled: item.enabled,
                }));

                setAllData(initialRows); // 전체 데이터 상태로 저장
                setRows(initialRows); // 초기 데이터 테이블에 렌더링
                showAlert("조회에 성공했습니다.", "success");
            } catch (error) {
                console.error("Fetch error:", error);
                showAlert("데이터를 가져오는 데 실패했습니다.", "error");
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchData();
    }, []);

    //PAGINATION
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setCurrentPage(1); // 페이지 수가 변경되면 첫 페이지로 이동
    };

    //  수정 btn
    const startEditing = (row) => {
        setEditingRowId(row.id);
        setEditedData(row); // 선택한 row 데이터를 복사해서 편집 상태로 설정
    };

    // input 필드 변경 시 데이터 업데이트
    const handleInputChange = (field, value) => {
        setEditedData({
            ...editedData,
            [field]: value,
        });
    };

    // 수정 저장
    const handleSaveClick = async () => {
        // 원래 값과 현재 값 비교
        if (JSON.stringify(originalRow) === JSON.stringify(editingRow)) {
            setPreleadOpen(false);
            showAlert("변경된 값이 없습니다.", "warning");

            return;
        }

        try {
            const response = await fetch(`/updateMember/${editingRow.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, // 토큰 인증 헤더 추가
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingRow), // 수정된 데이터 전송
            });

            if (response.ok) {
                setPreleadOpen(false);
                showAlert("회원 정보를 변경했습니다.", "success");
                setIsEditing(null); // 수정 모드 종료
                setRows(
                    rows.map((row) =>
                        row.id === editingRow.id ? { ...editingRow } : row
                    )
                ); // 테이블 업데이트
            } else {
                console.error("회원 정보 변경 실패:", response.statusText);
                setPreleadOpen(false);
                showAlert("회원 정보를 변경하지 못했습니다.", "error");
            }
        } catch (error) {
            console.error("회원 정보 변경 중 오류 발생:", error);
            setPreleadOpen(false);
            showAlert("회원 정보를 변경하지 못했습니다.", "error");
        }
    };

    // 수정 모드로 변경
    const handleEditClick = (row) => {
        setIsEditing(row.id); // 수정할 행 설정
        setEditingRow({ ...row }); // 수정할 데이터 설정
        setOriginalRow({ ...row });
    };

    // 수정 취소
    const handleCancelClick = () => {
        setIsEditing(null); // 수정 모드 종료
        setEditingRow(null); // 수정할 데이터 초기화
    };

    // 수정 모드 취소
    const cancelEditing = () => {
        setEditingRowId(null); // 수정 모드 취소
    };

    ////////////////////////////////////////////////////////////
    //               조회조건                                  //
    ////////////////////////////////////////////////////////////

    // 스위치 변경 핸들러
    const handleSwitchChange = (event) => {
        setShowEnabledOnly(event.target.checked); // 스위치 상태를 변경
    };

    // 스위치 상태에 따라 rows 필터링
    const filteredRows = showEnabledOnly
        ? rows.filter((row) => row.enabled == 1) // enabled가 1인 사용자만 보기
        : rows; // 모든 사용자 보기

    // 현재 페이지에 맞는 데이터를 필터링
    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="flex flex-col p-6 h-full list-table-root">
            {/* 모달 */}
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
                            <div className="text-2xl text-white mt-6 mb-8">
                                정말 수정하시겠습니까?
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setPreleadOpen(false)}
                                    className="blue-btn ml-2"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSaveClick}
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
                회원관리
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="text-[#dadada] pl-2">활동 회원</div>
                    <Switch
                        checked={showEnabledOnly}
                        onChange={handleSwitchChange}
                        color="secondary"
                    />
                </div>
                <div>
                    <input className="textfield" placeholder="검색" />
                    <button className="blue-btn ml-2">검색</button>
                </div>
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
                            <TableCell style={{ width: "50px" }} align="center">
                                No.
                            </TableCell>
                            <TableCell
                                style={{ width: "150px" }}
                                align="center"
                            >
                                ID
                            </TableCell>
                            <TableCell
                                style={{ width: "150px" }}
                                align="center"
                            >
                                업체명
                            </TableCell>
                            <TableCell
                                style={{ width: "150px" }}
                                align="center"
                            >
                                이름
                            </TableCell>
                            <TableCell
                                style={{ width: "150px" }}
                                align="center"
                            >
                                회원유형
                            </TableCell>
                            <TableCell
                                style={{ width: "200px" }}
                                align="center"
                            >
                                연락처
                            </TableCell>
                            <TableCell
                                style={{ width: "300px" }}
                                align="center"
                            >
                                비고
                            </TableCell>
                            <TableCell
                                style={{ width: "150px" }}
                                align="center"
                            >
                                가입일자
                            </TableCell>
                            <TableCell
                                style={{ width: "100px" }}
                                align="center"
                            >
                                탈퇴여부
                            </TableCell>
                            <TableCell
                                style={{ width: "150px" }}
                                align="center"
                            ></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow>
                                    <TableCell align="center">
                                        {row.boardId}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.id}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isEditing === row.id ? (
                                            <input
                                                type="text"
                                                className="textfield"
                                                value={editingRow.username}
                                                onChange={(e) =>
                                                    setEditingRow({
                                                        ...editingRow,
                                                        username:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            row.username
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {isEditing === row.id ? (
                                            <input
                                                type="text"
                                                className="textfield"
                                                value={editingRow.alias}
                                                onChange={(e) =>
                                                    setEditingRow({
                                                        ...editingRow,
                                                        alias: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            row.alias
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {isEditing === row.id ? (
                                            <Select
                                                value={editingRow.role}
                                                onChange={(e) =>
                                                    setEditingRow({
                                                        ...editingRow,
                                                        role: e.target.value, // role 필드를 업데이트
                                                    })
                                                }
                                                displayEmpty
                                                className="select-custom" // 사용자 정의 클래스 적용
                                            >
                                                <MenuItem value="ROLE_USER">
                                                    선박
                                                </MenuItem>
                                                <MenuItem value="ROLE_SUPPLIER">
                                                    공급업체
                                                </MenuItem>
                                                <MenuItem value="ROLE_MANAGER">
                                                    해운선사
                                                </MenuItem>
                                            </Select>
                                        ) : (
                                            {
                                                ROLE_MANAGER: "해운선사",
                                                ROLE_ADMIN: "관리자",
                                                ROLE_USER: "선박",
                                                ROLE_SUPPLIER: "공급업체",
                                            }[row.role] || row.role
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isEditing === row.id ? (
                                            <input
                                                type="text"
                                                className="textfield"
                                                value={editingRow.phone}
                                                onChange={(e) =>
                                                    setEditingRow({
                                                        ...editingRow,
                                                        phone: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            row.phone
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isEditing === row.id ? (
                                            <input
                                                type="text"
                                                className="textfield"
                                                value={editingRow.etc}
                                                onChange={(e) =>
                                                    setEditingRow({
                                                        ...editingRow,
                                                        etc: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            row.etc
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {row.regdate}
                                    </TableCell>

                                    <TableCell align="center">
                                        {row.enabled == 0 ? "Y" : "N"}
                                    </TableCell>

                                    <TableCell align="center">
                                        {isEditing === row.id && (
                                            <button
                                                onClick={handleCancelClick}
                                                className="inner-btn2 mr-2"
                                            >
                                                취소
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                isEditing === row.id
                                                    ? // ? handleSaveClick()
                                                      setPreleadOpen(true)
                                                    : handleEditClick(row)
                                            }
                                            className="inner-btn"
                                        >
                                            {isEditing === row.id
                                                ? "저장"
                                                : "수정"}
                                        </button>
                                    </TableCell>
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
                        count={Math.ceil(filteredRows.length / rowsPerPage)} // 필터링된 데이터에 맞게 페이지 수 조정
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                    />
                </div>
            </div>
        </div>
    );
}
