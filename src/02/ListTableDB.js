import React, { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    Paper,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    IconButton,
    Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import Modal2 from "../Compo/Modal2";
import "./ListTable.scss";

// 테이블 헤더 정의
const headCells = [
    { id: "no", label: "No.", width: "2%" },
    { id: "category1Name", label: "Category 1", width: "16%" },
    { id: "category2Name", label: "Category 2", width: "16%" },
    { id: "category3Name", label: "Category 3", width: "16%" },
    { id: "itemName", label: "물품명", width: "17%" },
    { id: "part1", label: "part 1", width: "16%" },
    { id: "quantity", label: "수량", width: "12%" },
];

// null값 처리 & 가격 단위 구분 함수
const formatCellValue = (value, unit) => {
    if (value == null || value === "") {
        return "-";
    }
    return value;
};

// 테이블 헤더 컴포넌트
function EnhancedTableHead({
    onSelectAllClick,
    numSelected,
    rowCount,
    allRowsSelected,
}) {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" style={{ width: "5%" }}>
                    <Checkbox
                        color="default"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={allRowsSelected}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="center"
                        padding="normal"
                        style={{ width: headCell.width }}
                        className="cursor-pointer"
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// 메인 테이블 컴포넌트
function ListTableDB() {
    const navigate = useNavigate();
    const [initialRows, setInitialRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [page, setPage] = useState(1); // 현재 페이지
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
    const [category1Name, setCategoryName] = useState("");
    const [category2Name, setCategory2Name] = useState("");
    const [category3Name, setCategory3Name] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // 장바구니로 이동 물어보기 모달상태

    // 사용자 이름을 로컬 스토리지에서 가져옴
    const username = localStorage.getItem("username") || "Guest";
    const token = localStorage.getItem("token");

    const generateKey = (row) => {
        return `${row.category1Name}-${row.category2Name}-${row.category3Name}-${row.part1}-${row.itemName}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/finditem", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();

                const processedData = data.map((item) => ({
                    ...item,
                    quantity: 1,
                    leadtime: 1,
                }));
                setInitialRows(processedData);
                setRows(processedData);
            } catch (error) {
                console.error("데이터 로딩 중 오류 발생:", error);
            }
        };

        fetchData();
    }, []);

    // category1 필터링 (고정된 카테고리 옵션)
    const category1Options = useMemo(() => {
        return [...new Set(rows.map((row) => row.category1Name))];
    }, [rows]);

    // category2 필터링 (category1 선택에 따른 변경)
    const category2Options = useMemo(() => {
        if (!category1Name) return [];
        return [
            ...new Set(
                rows
                    .filter((row) => row.category1Name === category1Name)
                    .map((row) => row.category2Name)
            ),
        ];
    }, [category1Name, rows]);

    // category3 필터링 (category2 선택에 따른 변경)
    const category3Options = useMemo(() => {
        if (!category2Name) return [];
        return [
            ...new Set(
                rows
                    .filter((row) => row.category2Name === category2Name)
                    .map((row) => row.category3Name)
            ),
        ];
    }, [category2Name, rows]);

    const uniqueRows = useMemo(() => {
        const groupedItems = {};

        rows.forEach((row) => {
            // 고유한 키로 중복 제거 (category1Name, category2Name, category3Name, part1, itemName)
            const key = `${row.category1Name}-${row.category2Name}-${row.category3Name}-${row.part1}-${row.itemName}`;

            // 이미 해당 key가 있는지 확인
            if (!groupedItems[key]) {
                groupedItems[key] = {
                    ...row, // row의 나머지 정보를 복사
                    itemIds: [row.itemId], // itemId를 배열로 설정
                    quantity: row.quantity, // quantity 값을 설정
                };
            } else {
                // 이미 존재하는 key라면 itemId만 배열에 추가 (중복된 itemIds 추가)
                groupedItems[key].itemIds.push(row.itemId);
            }
        });

        // 중복 제거된 행들을 반환
        return Object.values(groupedItems);
    }, [rows]);

    // 카테고리 필터링 적용
    const filteredUniqueRows = useMemo(() => {
        return uniqueRows.filter((row) => {
            const matchesCategory1 = category1Name
                ? row.category1Name === category1Name
                : true;
            const matchesCategory2 = category2Name
                ? row.category2Name === category2Name
                : true;
            const matchesCategory3 = category3Name
                ? row.category3Name === category3Name
                : true;
            const matchesSearchQuery = appliedSearchQuery
                ? row.itemName
                      .toLowerCase()
                      .includes(appliedSearchQuery.toLowerCase())
                : true;
            return (
                matchesCategory1 &&
                matchesCategory2 &&
                matchesCategory3 &&
                matchesSearchQuery
            );
        });
    }, [
        uniqueRows,
        category1Name,
        category2Name,
        category3Name,
        appliedSearchQuery,
    ]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, category1Name, category2Name, category3Name, rowsPerPage]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = new Set(
                filteredUniqueRows.map((row) => row.itemId)
            );
            setSelected(
                (prevSelected) => new Set([...prevSelected, ...newSelected])
            );
        } else {
            setSelected((prevSelected) => {
                const newSelected = new Set(
                    [...prevSelected].filter(
                        (item) =>
                            !filteredUniqueRows.some(
                                (row) => row.itemId === item
                            )
                    )
                );
                return newSelected;
            });
        }
    };

    // 체크박스 클릭 시 선택된 행 관리
    const handleClick = (event, uniqueRow) => {
        const newSelected = new Set(selected); // Set을 복사하여 새로운 상태 준비

        // uniqueRow에 관련된 모든 원본 데이터의 itemId들 추출
        const relatedItems = rows.filter(
            (row) =>
                row.category1Name === uniqueRow.category1Name &&
                row.category2Name === uniqueRow.category2Name &&
                row.category3Name === uniqueRow.category3Name &&
                row.part1 === uniqueRow.part1 &&
                row.itemName === uniqueRow.itemName
        );

        // 해당 행에 속한 모든 itemId를 선택하거나 선택 해제
        relatedItems.forEach((item) => {
            if (newSelected.has(item.itemId)) {
                newSelected.delete(item.itemId); // 이미 선택된 itemId는 제거
            } else {
                newSelected.add(item.itemId); // 선택되지 않은 itemId는 추가
            }
        });

        setSelected(newSelected); // 선택 상태 업데이트
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleCategory1Change = (event) => {
        setCategoryName(event.target.value);
        setCategory2Name("");
        setCategory3Name("");
    };

    const handleCategory2Change = (event) => {
        setCategory2Name(event.target.value);
        setCategory3Name("");
    };

    const handleCategory3Change = (event) => {
        setCategory3Name(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleQuantityChange = (itemId, event) => {
        const newQuantity = Math.max(1, parseInt(event.target.value, 10));
        setRows(
            rows.map((row) =>
                row.itemId === itemId ? { ...row, quantity: newQuantity } : row
            )
        );
    };

    // 빈 행 계산
    const emptyRows = useMemo(() => {
        const rowsCount = uniqueRows.length;
        return page > 1
            ? Math.max(0, (page - 1) * rowsPerPage + rowsPerPage - rowsCount)
            : 0;
    }, [page, rowsPerPage, filteredUniqueRows.length]);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredUniqueRows.length / rowsPerPage);

    const allRowsSelected = useMemo(() => {
        return (
            uniqueRows.length > 0 &&
            uniqueRows.every((row) => selected.has(row.itemId))
        );
    }, [uniqueRows, selected]);

    const openModal = () => setModalOpen(true);

    const handleSearchReset = () => {
        setSearchQuery("");
        setAppliedSearchQuery("");
        setRows(initialRows);
        setPage(1);
    };

    const handleSearchButtonClick = () => {
        setAppliedSearchQuery(searchQuery);
        setPage(1);
    };

    // 공통 데이터 조회 함수
    const getRowData = (row) => {
        return (
            rows.find(
                (r) =>
                    r.category1Name === row.category1Name &&
                    r.category2Name === row.category2Name &&
                    r.category3Name === row.category3Name &&
                    r.part1 === row.part1 &&
                    r.itemName === row.itemName
            ) || {}
        );
    };

    // 로그인한 사용자별 장바구니 추가 함수
    // const handleAddToCart = async () => {
    //   console.log('장바구니 담기 버튼 클릭됨');
    //   const cartItems = uniqueRows
    //     .filter(row => selected.has(row.itemId))
    //     .map(row => ({
    //       itemsId: row.itemId,
    //       quantity: row.quantity
    //     }));

    //   console.log('전송할 장바구니 아이템:', cartItems);

    //   try {
    //     const response = await fetch('/goCart', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //       },
    //       body: JSON.stringify(cartItems),
    //     });

    //     if (response.ok) {
    //       console.log('장바구니 추가 성공');
    //       setIsModalOpen(true);
    //     } else {
    //       console.error('장바구니 추가 실패:', response.statusText);
    //     }
    //   } catch (error) {
    //     console.error('장바구니 추가 중 오류 발생:', error);
    //   }
    // };

    // 장바구니에 항목 추가할 때, 중복된 항목들도 모두 itemId를 전송
    const handleAddToCart = async () => {
        console.log("장바구니 담기 버튼 클릭됨");

        // 선택된 itemId들을 배열로 구성
        const cartItems = Array.from(selected).map((itemId) => {
            const itemRow = rows.find((row) => row.itemId === itemId);
            return {
                itemsId: itemId, // 선택된 itemId
                quantity: itemRow.quantity, // 해당 itemId의 수량
            };
        });

        console.log("전송할 장바구니 아이템:", cartItems);

        try {
            const response = await fetch("/goCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(cartItems), // 선택된 itemId들 전송
            });

            if (response.ok) {
                console.log("장바구니 추가 성공");
                setIsModalOpen(true);
            } else {
                console.error("장바구니 추가 실패:", response.statusText);
            }
        } catch (error) {
            console.error("장바구니 추가 중 오류 발생:", error);
        }
    };

    // 모달의 '장바구니로 이동' 버튼 클릭 시 동작
    const handleNavigateToCart = () => {
        setIsModalOpen(false);
        navigate("/ordertest");
    };

    return (
        <div className="list-table-root flex flex-col p-6">
            <div className="text-xl font-semibold text-white mb-4">
                물품 리스트
            </div>
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <Select
                        value={category1Name}
                        onChange={handleCategory1Change}
                        displayEmpty
                        className="select-custom"
                    >
                        <MenuItem value="">
                            <div>Categories 1</div>
                        </MenuItem>
                        {category1Options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        value={category2Name}
                        onChange={handleCategory2Change}
                        displayEmpty
                        className="select-custom"
                    >
                        <MenuItem value="">
                            <div>Categories 2</div>
                        </MenuItem>
                        {category2Options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        value={category3Name}
                        onChange={handleCategory3Change}
                        displayEmpty
                        className="select-custom"
                    >
                        <MenuItem value="">
                            <div>Categories 3</div>
                        </MenuItem>
                        {category3Options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="물품명 검색"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{ color: "white", fontSize: 20 }}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchQuery && (
                                        <IconButton
                                            onClick={handleSearchReset}
                                            edge="end"
                                            sx={{ color: "white" }}
                                        >
                                            <CloseIcon
                                                sx={{
                                                    color: "white",
                                                    fontSize: 20,
                                                }}
                                            />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        className="custom-textfield"
                    />
                    <button
                        onClick={handleSearchButtonClick}
                        variant="contained"
                        className="blue-btn"
                    >
                        검색
                    </button>
                </div>
            </div>

            <TableContainer>
                <Table stickyHeader>
                    <EnhancedTableHead
                        onSelectAllClick={handleSelectAllClick}
                        numSelected={selected.size}
                        rowCount={uniqueRows.length}
                        allRowsSelected={allRowsSelected}
                    />
                    <TableBody>
                        {filteredUniqueRows
                            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                            .map((row, index) => (
                                <TableRow
                                    key={generateKey(row)}
                                    hover
                                    tabIndex={-1}
                                    // 해당 uniqueRow에 속한 itemId들이 선택되었는지 확인
                                    selected={rows.some(
                                        (originalRow) =>
                                            selected.has(originalRow.itemId) &&
                                            originalRow.category1Name ===
                                                row.category1Name &&
                                            originalRow.category2Name ===
                                                row.category2Name &&
                                            originalRow.category3Name ===
                                                row.category3Name &&
                                            originalRow.part1 === row.part1 &&
                                            originalRow.itemName ===
                                                row.itemName
                                    )}
                                >
                                    <TableCell
                                        padding="checkbox"
                                        style={{ width: "5%" }}
                                    >
                                        <Checkbox
                                            checked={rows.some(
                                                (originalRow) =>
                                                    selected.has(
                                                        originalRow.itemId
                                                    ) &&
                                                    originalRow.category1Name ===
                                                        row.category1Name &&
                                                    originalRow.category2Name ===
                                                        row.category2Name &&
                                                    originalRow.category3Name ===
                                                        row.category3Name &&
                                                    originalRow.part1 ===
                                                        row.part1 &&
                                                    originalRow.itemName ===
                                                        row.itemName
                                            )}
                                            inputProps={{
                                                "aria-labelledby": row.itemId,
                                            }}
                                            onChange={(event) =>
                                                handleClick(event, row)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="item-cell"
                                    >
                                        {(page - 1) * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="item-cell"
                                    >
                                        {formatCellValue(row.category1Name)}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="item-cell"
                                    >
                                        {formatCellValue(row.category2Name)}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="item-cell"
                                    >
                                        {formatCellValue(row.category3Name)}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="item-cell"
                                    >
                                        {formatCellValue(row.itemName)}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="item-cell"
                                    >
                                        {formatCellValue(row.part1)}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="item-cell"
                                    >
                                        <TextField
                                            className="custom-quantity"
                                            type="number"
                                            value={row.quantity}
                                            onChange={(event) =>
                                                handleQuantityChange(
                                                    row.itemId,
                                                    event
                                                )
                                            }
                                            inputProps={{ min: 1 }}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{ height: 53 * emptyRows }}
                            ></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="flex justify-between items-center mt-6">
                <div className="flex gap-4">
                    {/* 페이지당 항목 수 선택 */}
                    <Select
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        className="select-custom"
                    >
                        {[5, 10, 15].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <div className="pagination-container">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                    />
                </div>
                <div className="flex gap-4">
                    <Button className="bluebutton2" onClick={handleAddToCart}>
                        장바구니 담기
                    </Button>
                    <Modal2
                        open={isModalOpen}
                        setOpen={setIsModalOpen}
                        title="장바구니로 이동하시겠습니까?"
                        onConfirm={handleNavigateToCart}
                    />
                </div>
            </div>
        </div>
    );
}

export default ListTableDB;
