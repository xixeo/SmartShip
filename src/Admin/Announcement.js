import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { useAlert } from "../Compo/AlertContext";
import "../assets/theme/table.scss";

export default function Announcement() {
  const [allData, setAllData] = useState([]); //패치된 데이터 저장
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [page, setPage] = useState(1); // 현재 페이지
  const [currentPage, setCurrentPage] = useState(1);
  const { showAlert } = useAlert(); // useAlert 훅 사용
  // useEffect를 사용하여 컴포넌트가 마운트될 때 초기 데이터를 설정
  // 조회버튼을 누르지 않아도 초기에 전체 데이터 한번 렌더링 시키기
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("No token found");
        // showAlert("토큰이 저장되지 않았습니다.", "error");
        return;
      }
      // setLoading(true); // 로딩 시작
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
      } catch (error) {
        console.error("Fetch error:", error);
        showAlert("데이터를 가져오는 데 실패했습니다.", "error");
      }
      //  finally {
      //     setLoading(false); // 로딩 종료
      // }
    };

    fetchData();
  }, []);

  // const handleStatusChange = (noticeId, event) => {
  //     const newStatus = event.target.checked;
  //     setRows(
  //         rows.map((row) =>
  //             row.noticeId === noticeId ? { ...row, status: newStatus } : row
  //         )
  //     );
  //     //console.log(newStatus, 'statuuuuuuuuuuuu')

  // };

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
        console.log("status 변경 성공");
      } else {
        console.error("status 변경 실패:", response.statusText);
      }
    } catch (error) {
      console.error("status 변경 중 오류 발생:", error);
    }
  };

  // pagination
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

  // 체크박스 핸들러
  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(id)) {
        newSelectedRows.delete(id); // 이미 선택된 행은 선택 해제
      } else {
        newSelectedRows.add(id); // 선택되지 않은 행은 선택
      }
      console.log("newSelectedRows", Array.from(newSelectedRows));
      return newSelectedRows;
    });
  };
  return (
    <div className="flex flex-col p-6 h-full list-table-root">
      <div className="text-xl font-semibold text-white mb-4">공지사항</div>
      <div className="flex justify-end">
        <input className="textfield" placeholder="검색" />
        <button className="blue-btn ml-2">검색</button>
        <button className="blue-btn ml-2">선택 삭제</button>
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
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">제목</TableCell>
              <TableCell align="center">작성자</TableCell>
              <TableCell align="center">작성일자</TableCell>
              <TableCell align="center">조회수</TableCell>
              <TableCell align="center">노출여부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <React.Fragment key={row.noticeId}>
                <TableRow>
                  <TableCell style={{ width: "50px" }}>
                    <Checkbox
                      checked={selectedRows.has(row.noticeId)}
                      onChange={() => handleSelectRow(row.noticeId)}
                    />
                  </TableCell>

                  <TableCell align="center">{row.boardId}</TableCell>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.author}</TableCell>
                  <TableCell align="center">{row.createdAt}</TableCell>
                  <TableCell align="center">{row.views}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={row.status ?? true}
                      onChange={(event) =>
                        handleStatusChange(row.noticeId, event)
                      }
                      color="secondary"
                    />
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
            count={Math.ceil(rows.length / rowsPerPage)}
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
