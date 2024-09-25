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
import "../assets/theme/table.scss";

export default function Announcement() {
    return (
        <div className="flex flex-col p-6">
            <div className="text-xl font-semibold text-white mb-4">
                공지사항
            </div>
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
                    {/* <TableHead
                        style={{ background: "rgba(255, 255, 255, 0.15)" }}
                    > */}
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
                        <React.Fragment>
                            {/* <TableRow
                                style={{
                                    background: "rgba(255, 255, 255, 0.3)",
                                    color: "#fff",
                                }}
                            > */}
                            <TableRow>
                                <TableCell style={{ width: "50px" }}>
                                    <Checkbox />
                                </TableCell>

                                <TableCell align="center">1</TableCell>
                                <TableCell align="center">
                                    10월 1일에 우린 진짜 안쉬나?
                                </TableCell>
                                <TableCell align="center">유승호</TableCell>
                                <TableCell align="center">2024-09-23</TableCell>
                                <TableCell align="center">0</TableCell>
                                <TableCell align="center">
                                    <Switch color="secondary"/>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="pagination-container">
                <Pagination shape="rounded" />
            </div>
            <div className="flex justify-between items-center mt-6">
                <div className="flex gap-4">
                <Select
                     
                    >
                        {[5, 10, 15].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
}
