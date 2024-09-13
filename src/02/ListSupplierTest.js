import React, { useState, useMemo, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';

const token = localStorage.getItem('token');

// 카테고리 가져오기
const fetchCategories = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

const CategoryDropdown = () => {
  const [categories1, setCategories1] = useState([]);
  const [category2Map, setCategory2Map] = useState(new Map());
  const [category3Map, setCategory3Map] = useState(new Map());
  const [rows, setRows] = useState([]);

  // 독립적인 상태 관리
  const [selectedCategory1, setSelectedCategory1] = useState('');
  const [selectedCategory2, setSelectedCategory2] = useState('');
  const [selectedCategory3, setSelectedCategory3] = useState('');

  const [selectCategory1, setSelectCategory1] = useState('');
  const [selectCategory2, setSelectCategory2] = useState('');
  const [selectCategory3, setSelectCategory3] = useState('');

  // 선택된 카테고리 이름
  const category1Options = [...new Set(rows.map((row) => row.category1Name))];
  const category2Options = useMemo(() => {
    return [...new Set(rows.filter((row) => row.category1Name === selectCategory1).map((row) => row.category2Name))];
  }, [selectCategory1, rows]);
  const category3Options = useMemo(() => {
    return [...new Set(rows.filter((row) => row.category2Name === selectCategory2).map((row) => row.category3Name))];
  }, [selectCategory2, rows]);

  useEffect(() => {
    const loadCategories = async () => {
      const [data1, data2, data3] = await Promise.all([
        fetchCategories('/category1'),
        fetchCategories('/category2'),
        fetchCategories('/category3'),
      ]);
      
      const category2Map = new Map();
      data2.forEach((item) => {
        const { category1, category2Id, category2Name } = item;
        const { category1Id } = category1;
        if (!category2Map.has(category1Id)) {
          category2Map.set(category1Id, []);
        }
        category2Map.get(category1Id).push({ category2Id, category2Name });
      });

      const category3Map = new Map();
      data3.forEach((item) => {
        const { category2, category3Id, category3Name } = item;
        const { category2Id } = category2;
        if (!category3Map.has(category2Id)) {
          category3Map.set(category2Id, []);
        }
        category3Map.get(category2Id).push({ category3Id, category3Name });
      });

      setCategories1(data1);
      setCategory2Map(category2Map);
      setCategory3Map(category3Map);
    };

    loadCategories();
  }, []);

  // 공급업체의 아이템만 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/finditem', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
      
        const processedData = data.map(item => ({
          ...item,
          quantity: 1,
          leadtime: 1
        }));
        setRows(processedData);
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  // 선택 핸들러
  const handleCategory1Change = (event) => {
    setSelectedCategory1(event.target.value);
    setSelectedCategory2(''); // 카테고리 1 변경 시 카테고리 2와 3 초기화
    setSelectedCategory3('');
  };

  const handleCategory2Change = (event) => {
    setSelectedCategory2(event.target.value);
    setSelectedCategory3(''); // 카테고리 2 변경 시 카테고리 3 초기화
  };

  const handleCategory3Change = (event) => {
    setSelectedCategory3(event.target.value);
  };

  return (
    <div className="list-table-root flex flex-col p-6">
      {/* 독립적인 <select> */}
      <div>
        <select onChange={handleCategory1Change} value={selectedCategory1}>
          <option value="">Select Category1</option>
          {categories1.map((cat) => (
            <option key={cat.category1Id} value={cat.category1Id}>
              {cat.category1Name}
            </option>
          ))}
        </select>

        <select onChange={handleCategory2Change} value={selectedCategory2} disabled={!selectedCategory1}>
          <option value="">Select Category2</option>
          {(category2Map.get(parseInt(selectedCategory1)) || []).map((cat) => (
            <option key={cat.category2Id} value={cat.category2Id}>
              {cat.category2Name}
            </option>
          ))}
        </select>

        <select onChange={handleCategory3Change} value={selectedCategory3} disabled={!selectedCategory2}>
          <option value="">Select Category3</option>
          {(category3Map.get(parseInt(selectedCategory2)) || []).map((cat) => (
            <option key={cat.category3Id} value={cat.category3Id}>
              {cat.category3Name}
            </option>
          ))}
        </select>
      </div>

      {/* 독립적인 <Select> */}
      <div>
        <Select
          value={selectCategory1}
          onChange={(e) => setSelectCategory1(e.target.value)}
          displayEmpty
          className="select-custom"
        >
          <MenuItem value=""><div>Categories 1</div></MenuItem>
          {category1Options.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>

        <Select
          value={selectCategory2}
          onChange={(e) => setSelectCategory2(e.target.value)}
          displayEmpty
          className="select-custom"
        >
          <MenuItem value=""><div>Categories 2</div></MenuItem>
          {category2Options.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>

        <Select
          value={selectCategory3}
          onChange={(e) => setSelectCategory3(e.target.value)}
          displayEmpty
          className="select-custom"
        >
          <MenuItem value=""><div>Categories 3</div></MenuItem>
          {category3Options.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default CategoryDropdown;
