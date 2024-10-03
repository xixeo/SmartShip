import React, { useState, useEffect } from 'react'; 
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';
import { Button } from "@mui/material";

// MyResponsivePie 컴포넌트
    const MyResponsivePie = ({ data }) => (
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 20, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'blue_purple' }}
            borderColor={{ theme: 'background' }}
            arcLinkLabelsSkipAngle={9}
            arcLinkLabelsTextOffset={9}
            arcLinkLabelsTextColor="#ffffff" // 텍스트 색상을 흰색으로 변경
            arcLinkLabelsOffset={-4}
            arcLinkLabelsDiagonalLength={17}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            enableArcLabels={false}
            tooltip={() => null} 
        />
    );

// ItemSupplier 컴포넌트
function ItemSupplier() {
    const [items, setItems] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [category, setCategory] = useState('category3Name'); // 기본값으로 category1 선택

    // API 데이터 패치
    useEffect(() => {
        axios.get('/finditem') // 실제 API URL로 대체 필요
            .then((response) => {
                setItems(response.data);
                handleCategoryChange('category3Name'); // 기본 카테고리로 category1 설정
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // 카테고리 필터링 핸들러
    const handleCategoryChange = (categoryName) => {
        setCategory(categoryName);
        const categoryData = {};
        items.forEach(item => {
            const categoryValue = item[categoryName];
            if (categoryData[categoryValue]) {
                categoryData[categoryValue] += 1; // 해당 카테고리의 항목 수 증가
            } else {
                categoryData[categoryValue] = 1; // 새로운 카테고리 값 추가
            }
        });

        const pieData = Object.keys(categoryData).map(key => ({
            id: key,
            label: key,
            value: categoryData[key],
        }));

        setFilteredData(pieData);
    };

    return (
        <div>
            <div className='mt-5 my-3 flex flex-col items-center text-center'>
                <div className='flex gap-3'>
                <button
                className='blue-btn text-sm '
                    onClick={() => handleCategoryChange('category1Name')}
                >
                    Category 1
                </button>
                <button
                className='blue-btn text-sm'
                    onClick={() => handleCategoryChange('category2Name')}
                >
                    Category 2
                </button>
                <button
                className='blue-btn text-sm'
                    onClick={() => handleCategoryChange('category3Name')}
                >
                    Category 3
                </button>
                </div>
            </div>
            <div style={{ height: '500px' }}>
                <MyResponsivePie data={filteredData} />
            </div>
        </div>
    );
}

export default ItemSupplier;