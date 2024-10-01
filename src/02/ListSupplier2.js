import React, { useState, useMemo, useEffect } from "react";
import {
    Checkbox,
    Select,
    Switch,
    MenuItem,
    Button,
    IconButton,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Pagination from "@mui/material/Pagination";
import PredictionModal from "./PredictionModal";
import Loading from "../Compo/Loading";

const ListSupplier2 = () => {
    const [token, setToken] = useState(null); // 초기 토큰 상태
    const [alias, setAlias] = useState(localStorage.getItem("alias") || "Guest");
    // 각 행의 카테고리 선택
    const [category1Map, setCategory1Map] = useState([]);
    const [category2Map, setCategory2Map] = useState(new Map());
    const [category3Map, setCategory3Map] = useState(new Map());
    const [loading, setLoading] = useState(true);

    ////////////////////////////////
    // 공급업체의 아이템만 가져오기 //
    ////////////////////////////////

    // const fetchLeadTime = async (itemId) => {
    //    setLoading(true);
    //     try {
    //         const response = await fetch(`/finditem/${itemId}`);
    //         if (!response.ok) {
    //             throw new Error("Network response was not ok");
    //         }
    //         const data = await response.json();
    //         return data.leadtime || null;
    //     } catch (error) {

    //         console.error("Failed to fetch lead time:", error);
    //         return null; // 오류 발생 시 null 반환

    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // 토큰을 로컬 스토리지에서 가져오는 useEffect
    useEffect(() => {
        const storedToken = localStorage.getItem("token"); // 예시: 로컬 스토리지에서 토큰 가져오기
        setLoading(false); // 초기 로딩 상태 설정
        if (storedToken) {
            setToken(storedToken);
        } else {
            setLoading(false); // 토큰이 없을 경우 로딩 상태 해제
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // token이 없으면 fetch하지 않음
            if (!token) {
                setLoading(true); // token이 없을 경우 로딩 해제
                return; // token이 없으면 함수를 종료
            }
            try {
                const response = await fetch("/finditem", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok)
                    throw new Error("Network response was not ok");
                const data = await response.json();

                const processedData = data.map((item) => ({
                    ...item,
                    forSale: item.forSale ?? false,
                }));
                setRows(processedData);

                // 각 행의 카테고리 값을 초기화
                const initialSelectedCategories = processedData.reduce(
                    (acc, item) => {
                        const category1Name =
                            category1Map.find(
                                (cat) =>
                                    cat.category1Name === item.category1Name
                            )?.category1Name || "";

                        const category2Name =
                            category2Map
                                .get(category1Name)
                                ?.find(
                                    (cat) =>
                                        cat.category2Name === item.category2Name
                                )?.category2Name || "";

                        const category3Name =
                            category3Map
                                .get(category2Name)
                                ?.find(
                                    (cat) =>
                                        cat.category3Name === item.category3Name
                                )?.category3Name || "";

                        acc[item.itemId] = {
                            category1: category1Name,
                            category2: category2Name,
                            category3: category3Name,
                        };

                        return acc;
                    },
                );

                setSelectedCategories(initialSelectedCategories);
            } catch (error) {
                console.error("데이터 로딩 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, category1Map, category2Map, category3Map]);

    ////////////////////////////
    // 카테고리선택, 물품명검색 //
    ////////////////////////////

    const [rows, setRows] = useState([]); // 이미 받아온 데이터가 들어가는 상태
    const [filteredRows, setFilteredRows] = useState([]); // 필터링된 데이터를 담는 상태
    const [selectCategory1, setSelectCategory1] = useState("");
    const [selectCategory2, setSelectCategory2] = useState("");
    const [selectCategory3, setSelectCategory3] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearchQuery, setAppliedSearchQuery] = useState("");

    // 선택된 카테고리 이름
    const category1Options = [...new Set(rows.map((row) => row.category1Name))];
    const category2Options = useMemo(() => {
        return [
            ...new Set(
                rows
                    .filter((row) => row.category1Name === selectCategory1)
                    .map((row) => row.category2Name)
            ),
        ];
    }, [selectCategory1, rows]);
    const category3Options = useMemo(() => {
        return [
            ...new Set(
                rows
                    .filter((row) => row.category2Name === selectCategory2)
                    .map((row) => row.category3Name)
            ),
        ];
    }, [selectCategory2, rows]);

    // 카테고리 선택 변경 시 필터링 함수
    const applyCategoryFilter = () => {
        console.log("All Rows:", rows);
        console.log("Selected Categories:", {
            selectCategory1,
            selectCategory2,
            selectCategory3,
        });

        // 카테고리 선택 해제 로직 추가
        if (!selectCategory1) {
            setSelectCategory2(""); // 카테고리1이 선택되지 않으면 카테고리2 해제
            setSelectCategory3(""); // 카테고리1이 선택되지 않으면 카테고리3 해제
        } else if (!selectCategory2) {
            setSelectCategory3(""); // 카테고리2가 선택되지 않으면 카테고리3 해제
        }

        const updatedRows = rows.filter((row) => {
            const category1 = row.category1Name.trim();
            const category2 = row.category2Name.trim();
            const category3 = row.category3Name.trim();

            const matchesCategory1 = selectCategory1
                ? category1 === selectCategory1
                : true;
            const matchesCategory2 = selectCategory2
                ? category2 === selectCategory2
                : true;
            const matchesCategory3 = selectCategory3
                ? category3 === selectCategory3
                : true;

            return matchesCategory1 && matchesCategory2 && matchesCategory3;
        });

        console.log("Filtered Rows (before search):", updatedRows);
        setFilteredRows(updatedRows);
    };

    // 검색어가 적용된 경우 필터링
    useEffect(() => {
        // 카테고리 필터 적용
        applyCategoryFilter();

        // 검색어 필터링 적용
        if (appliedSearchQuery) {
            const finalFilteredRows = filteredRows.filter((row) =>
                row.itemName
                    .toLowerCase()
                    .includes(appliedSearchQuery.toLowerCase())
            );
            setFilteredRows(finalFilteredRows);
        }
    }, [
        rows,
        selectCategory1,
        selectCategory2,
        selectCategory3,
        appliedSearchQuery,
    ]);

    ///////////////////////////////////////////////
    // 전체 카테고리 목록 가져오기 (각 행에서 변경) //
    ///////////////////////////////////////////////

    const fetchCategories = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            return [];
        }
    };

    // 드롭다운에서 각 카테고리 선택
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            const [data1, data2, data3] = await Promise.all([
                fetchCategories("/category1"),
                fetchCategories("/category2"),
                fetchCategories("/category3"),
            ]);

            console.log("Category 1 Data:", data1);
            console.log("Category 2 Data:", data2);
            console.log("Category 3 Data:", data3);

            const category2Map = new Map();
            data2.forEach((item) => {
                const { category1, category2Name } = item;
                const { category1Name } = category1; // category1Id는 유지
                // category2Map에 category2Name 추가
                if (!category2Map.has(category1Name)) {
                    category2Map.set(category1Name, []);
                }
                category2Map.get(category1Name).push({ category2Name });
            });

            const category3Map = new Map();
            data3.forEach((item) => {
                const { category2, category3Name } = item;
                const { category2Name } = category2;
                if (!category3Map.has(category2Name)) {
                    category3Map.set(category2Name, []);
                }
                category3Map.get(category2Name).push({ category3Name });
            });

            setCategory1Map(data1);
            setCategory2Map(category2Map);
            setCategory3Map(category3Map);
        };

        loadCategories();
    }, []);

    // 각 테이블 행에서 카테고리 변경 시 (리셋)
    const handleCategoryChange = (itemId, categoryLevel, value) => {
        const newSelectedCategories = { ...selectedCategories };

        if (!newSelectedCategories[itemId]) {
            newSelectedCategories[itemId] = {
                category1: "",
                category2: "",
                category3: "",
            };
        }

        if (categoryLevel === 1) {
            newSelectedCategories[itemId].category1 = value;
            newSelectedCategories[itemId].category2 = "";
            newSelectedCategories[itemId].category3 = "";
        } else if (categoryLevel === 2) {
            newSelectedCategories[itemId].category2 = value;
            newSelectedCategories[itemId].category3 = ""; // Reset category 3
        } else {
            newSelectedCategories[itemId].category3 = value;
        }

        setSelectedCategories(newSelectedCategories);
    };

    ///////////////////////
    // 물품명, part1 변경 //
    ///////////////////////

    const handleItemNameChange = (itemId, event) => {
        const newItemName = event.target.value;
        setRows(
            rows.map((row) =>
                row.itemId === itemId ? { ...row, itemName: newItemName } : row
            )
        );
    };

    const handlePart1Change = (itemId, event) => {
        const newPart1 = event.target.value;
        setRows(
            rows.map((row) =>
                row.itemId === itemId ? { ...row, part1: newPart1 } : row
            )
        );
    };

    //////////////////
    // 판매상태 제어 //
    //////////////////

    const currencyDisplayNames = {
        USD: "달러",
        EUR: "유로",
        JPY: "엔화",
        KRW: "원화",
    };

    const handlePriceChange = (itemId, event) => {
        const newPrice = parseFloat(event.target.value) || 0;
        setRows(
            rows.map((row) =>
                row.itemId === itemId ? { ...row, price: newPrice } : row
            )
        );
    };

    const handleCurrencyChange = (itemId, event) => {
        const newCurrency = event.target.value;
        setRows(
            rows.map((row) =>
                row.itemId === itemId ? { ...row, unit: newCurrency } : row
            )
        );
    };

    const handleforSaleChange = (itemId, event) => {
        const newforSale = event.target.checked;
        setRows(
            rows.map((row) =>
                row.itemId === itemId ? { ...row, forSale: newforSale } : row
            )
        );
    };

    //////////////////
    // 체크박스 관리 //
    //////////////////

    // 체크박스 상태 관리
    const [selectedItems, setSelectedItems] = useState(new Set());

    // 전체 선택 체크박스 상태 관리
    const isAllSelected =
        filteredRows.length > 0 &&
        filteredRows.every((row) => selectedItems.has(row.itemId));

    // 전체 선택 핸들러
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allSelected = new Set(filteredRows.map((row) => row.itemId)); // 필터링된 목록에서 전체 선택
            setSelectedItems(
                (prevSelected) => new Set([...prevSelected, ...allSelected])
            );
        } else {
            setSelectedItems(new Set()); // 전체 선택 해제 ??
        }
    };

    // 각 행의 체크박스 핸들러
    const handleRowSelect = (itemId) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(itemId)) {
            newSelectedItems.delete(itemId);
        } else {
            newSelectedItems.add(itemId);
        }
        setSelectedItems(newSelectedItems);
    };

    ////////////////
    // 물품명 검색 //
    ////////////////

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchReset = () => {
        setSearchQuery("");
        setAppliedSearchQuery("");
        // setRows(initialRows);
    };

    const handleSearchButtonClick = () => {
        setAppliedSearchQuery(searchQuery);
        // setPage(1);
    };

    ////////////////////
    // 삭제버튼 핸들러 //
    ////////////////////

    const handleDelete = async () => {
        try {
            // 선택된 itemId 모음
            const itemIdsToDelete = Array.from(selectedItems);

            if (itemIdsToDelete.length === 0) {
                alert("삭제할 항목을 선택하세요.");
                return;
            }

            const username = localStorage.getItem("username") || "Guest"; // localStorage에서 가져온 username 사용

            const response = await fetch("/supplier/delete", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                // JSON 형식을 itemIds 배열만 포함하도록 수정
                body: JSON.stringify(itemIdsToDelete), // itemIds 배열만 전달
            });

            if (response.ok) {
                // 응답이 200번대인지 확인
                alert("Deleted successfully!");
                // 삭제 후 테이블 갱신
                setRows(rows.filter((row) => !selectedItems.has(row.itemId)));
                setSelectedItems(new Set()); // 선택 초기화
            } else {
                const errorMessage = await response.text();
                alert(`삭제 실패: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error deleting items:", error);
            alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    ////////////////////
    // 저장버튼 핸들러 //
    ////////////////////

    const handleSave = async () => {
        try {
            const itemsToSave = Array.from(selectedItems).map((itemId) => {
                const row = rows.find((row) => row.itemId === itemId);
                const selectedCategory = selectedCategories[itemId] || {};
                return {
                    itemId: row.itemId,
                    category1Name: selectedCategory.category1 || null,
                    category2Name: selectedCategory.category2 || null,
                    category3Name: selectedCategory.category3 || null,
                    itemName: row.itemName || null,
                    part1: row.part1 || null,
                    part2: row.part2 || null,
                    price: row.price || null,
                    unit: row.unit || null,
                    forSale: row.forSale || null,
                };
            });

            if (itemsToSave.length === 0) {
                alert("저장할 항목을 선택하세요.");
                return;
            }

            const response = await fetch("/supplier/items", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemsToSave),
            });

            if (response.ok) {
                alert("Items saved successfully!");

                // 성공적으로 저장된 후 로컬 상태에서 rows 업데이트
                const updatedRows = rows.map((row) => {
                    const savedItem = itemsToSave.find(
                        (item) => item.itemId === row.itemId
                    );
                    return savedItem ? { ...row, ...savedItem } : row;
                });

                setRows(updatedRows); // 상태 업데이트 후 화면 재랜더링
            } else {
                const errorMessage = await response.text();
                alert(`Failed to save items: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error saving items:", error);
            alert(`Error while saving: ${error.message}`);
        }
    };

    /////////////////////////////
    // 새 상품 등록 및 모달 관리 //
    /////////////////////////////

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRegisterButtonClick = () => {
        setIsModalOpen(true); // 버튼 클릭 시 모달 열기
    };

    // // 데이터를 다시 가져오는 함수
    // const fetchUpdatedData = async () => {
    //   try {
    //     const response = await fetch('/supplier/items', {
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //       },
    //     });

    //     if (response.ok) {
    //       const updatedRows = await response.json();
    //       setRows(updatedRows); // 새로운 데이터를 상태에 저장하여 화면 재랜더링
    //     } else {
    //       alert('Failed to fetch updated data');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching updated data:', error);
    //   }
    // };

    /////////////////////////////
    //  페이지네이션 관련 함수   //
    /////////////////////////////

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // 현재 페이지에 따라 표시할 데이터의 인덱스를 계산하는 함수
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지네이션 버튼함수
    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div>
            {/* Loading이 true면 컴포넌트를 띄우고, false면 null(빈 값)처리 하여 컴포넌트 숨김 */}
            {loading ? (
                <Loading />
            ) : (
                <div className="list-table-root flex flex-col p-6">
                    {/* 공급업체의 아이템 중 <Select> */}
                    <div className="text-xl font-semibold text-white mb-4">{`[ ${alias} ] 물품 관리`}</div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <Select
                                value={selectCategory1}
                                onChange={(e) => setSelectCategory1(e.target.value)}
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
                                value={selectCategory2}
                                onChange={(e) => setSelectCategory2(e.target.value)}
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
                                value={selectCategory3}
                                onChange={(e) => setSelectCategory3(e.target.value)}
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
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleSearchButtonClick}
                                variant="contained"
                                className="blue-btn"
                            >
                                검색
                            </button>
                            <button
                                onClick={handleRegisterButtonClick}
                                variant="contained"
                                className="blue-btn"
                            >
                                등록
                            </button>
                            <PredictionModal
                                open={isModalOpen}
                                setOpen={setIsModalOpen}
                                title="신규 상품 등록"
                            />
                            <button
                                onClick={handleDelete}
                                variant="contained"
                                className="blue-btn"
                            >
                                삭제
                            </button>
                            <button
                                onClick={handleSave}
                                variant="contained"
                                className="blue-btn"
                            >
                                저장
                            </button>
                        </div>
                    </div>

                    <TableContainer>
                        <Table>
                            <TableHead isAllSelected={isAllSelected}>
                                <TableRow>
                                    <TableCell
                                        padding="checkbox"
                                        style={{ width: "5%" }}
                                    >
                                        <Checkbox
                                            color="default"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "2%", textAlign: "center" }}
                                    >
                                        No.
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "13%", textAlign: "center" }}
                                    >
                                        Category 1
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "13%", textAlign: "center" }}
                                    >
                                        Category 2
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "13%", textAlign: "center" }}
                                    >
                                        Category 3
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "13%", textAlign: "center" }}
                                    >
                                        물품명
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "13%", textAlign: "center" }}
                                    >
                                        part 1
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "12%", textAlign: "center" }}
                                    >
                                        가격
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "6%", textAlign: "center" }}
                                    >
                                        화폐단위
                                    </TableCell>
                                    <TableCell
                                        sx={{ width: "10%", textAlign: "center" }}
                                    >
                                        판매여부
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="items-center">
                                {currentItems.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell
                                            padding="checkbox"
                                            style={{ width: "5%" }}
                                        >
                                            <Checkbox
                                                color="default"
                                                checked={selectedItems.has(row.itemId)}
                                                onChange={() =>
                                                    handleRowSelect(row.itemId)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell
                                            className="item-cell"
                                            sx={{ width: "2%" }}
                                        >
                                            {index + 1}
                                        </TableCell>
                                        {/* 전체 카테고리 목록 중 <Select> */}
                                        <TableCell sx={{ width: "13%" }}>
                                            <Select
                                                className="select-supplier items-center"
                                                value={
                                                    selectedCategories[row.itemId]
                                                        ?.category1 || ""
                                                }
                                                onChange={(e) =>
                                                    handleCategoryChange(
                                                        row.itemId,
                                                        1,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <MenuItem value="">
                                                    <em>Select Category1</em>
                                                </MenuItem>
                                                {category1Map.map((cat) => (
                                                    <MenuItem
                                                        key={cat.category1Name}
                                                        value={cat.category1Name}
                                                    >
                                                        {cat.category1Name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell sx={{ width: "13%" }}>
                                            <Select
                                                className="select-supplier items-center"
                                                value={
                                                    selectedCategories[row.itemId]
                                                        ?.category2 || ""
                                                }
                                                onChange={(e) =>
                                                    handleCategoryChange(
                                                        row.itemId,
                                                        2,
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    !selectedCategories[row.itemId]
                                                        ?.category1
                                                }
                                            >
                                                <MenuItem value="">
                                                    <em>Select Category2</em>
                                                </MenuItem>
                                                {(
                                                    category2Map.get(
                                                        selectedCategories[row.itemId]
                                                            ?.category1
                                                    ) || []
                                                ).map((cat) => (
                                                    <MenuItem
                                                        key={cat.category2Name}
                                                        value={cat.category2Name}
                                                    >
                                                        {cat.category2Name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell sx={{ width: "13%" }}>
                                            <Select
                                                className="select-supplier items-center"
                                                value={
                                                    selectedCategories[row.itemId]
                                                        ?.category3 || ""
                                                }
                                                onChange={(e) =>
                                                    handleCategoryChange(
                                                        row.itemId,
                                                        3,
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    !selectedCategories[row.itemId]
                                                        ?.category2
                                                }
                                            >
                                                <MenuItem value="">
                                                    <em>Select Category3</em>
                                                </MenuItem>
                                                {(
                                                    category3Map.get(
                                                        selectedCategories[row.itemId]
                                                            ?.category2
                                                    ) || []
                                                ).map((cat) => (
                                                    <MenuItem
                                                        key={cat.category3Name}
                                                        value={cat.category3Name}
                                                    >
                                                        {cat.category3Name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: "16%" }}
                                            align="center"
                                        >
                                            <TextField
                                                className="custom-quantity"
                                                value={row.itemName || ""}
                                                onChange={(event) =>
                                                    handleItemNameChange(
                                                        row.itemId,
                                                        event
                                                    )
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: "13%" }}
                                            align="center"
                                        >
                                            <TextField
                                                className="custom-quantity"
                                                value={row.part1 || ""}
                                                onChange={(event) =>
                                                    handlePart1Change(row.itemId, event)
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                sx={{ width: "16%" }}
                                                className="custom-quantity"
                                                type="number"
                                                value={row.price}
                                                onChange={(event) =>
                                                    handlePriceChange(row.itemId, event)
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Select
                                                sx={{ width: "6%" }}
                                                className="select-supplier"
                                                value={row.unit || ""} // unit이 빈 문자열일 경우를 대비
                                                onChange={(event) =>
                                                    handleCurrencyChange(
                                                        row.itemId,
                                                        event
                                                    )
                                                }
                                                fullWidth
                                            >
                                                {Object.entries(
                                                    currencyDisplayNames
                                                ).map(([code, displayName]) => (
                                                    <MenuItem key={code} value={code}>
                                                        {displayName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell sx={{ width: "6%" }} align="center">
                                            <Switch
                                                checked={row.forSale ?? false}
                                                onChange={(event) =>
                                                    handleforSaleChange(
                                                        row.itemId,
                                                        event
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="flex items-center mt-6">
                        <div>
                            <Select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(e.target.value);
                                    setCurrentPage(1);
                                }}
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
                                page={currentPage}
                                onChange={handlePageChange}
                                shape="rounded"
                            />
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
}
export default ListSupplier2;
