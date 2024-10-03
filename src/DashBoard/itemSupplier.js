import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';
import { useLoading } from "../Compo/LoadingContext";
import { useAlert } from "../Compo/AlertContext";

// MyResponsivePie 컴포넌트
const MyResponsivePie = ({ data }) => (
    <ResponsivePie
        data={data}
        margin={{ top: 10, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'blue_purple' }}
        borderColor={{ theme: 'background' }}
        arcLinkLabelsSkipAngle={9}
        arcLinkLabelsTextOffset={9}
        arcLinkLabelsTextColor="#ffffff"
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
function ItemSupplier({ selectedCategory, onCategoryChange }) {
    const [items, setItems] = useState([]); // 데이터 리스트
    const [activeCategory, setActiveCategory] = useState('category2Name');
    const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터 상태
    const { setLoading } = useLoading();
    const { showAlert } = useAlert();

    // API 데이터 패치 
    useEffect(() => {
        setLoading(true); 
        axios.get('/finditem')
            .then((response) => {
                setItems(response.data);
                showAlert("조회에 성공했습니다.", "success");
                // handleCategoryChange('category3Name'); // 기본 카테고리로 category3 설정
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                showAlert("데이터 조회에 실패했습니다.", "error"); // 데이터 조회 실패 시 알림
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // items가 로드된 후 기본 차트 표시
    useEffect(() => {
        if (items.length > 0) {
            handleCategoryChange('category2Name'); // 기본 카테고리로 설정
        }
    }, [items]); // items가 업데이트되면 실행

    // 카테고리 필터링 핸들러
    const handleCategoryChange = (categoryName) => {
        setLoading(true);
        setActiveCategory(categoryName);
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

        setFilteredData(pieData); // 필터링된 데이터를 상태에 저장
        setLoading(false);
    };

    return (
        <div>
            <div className='my-3 flex flex-col items-center text-center'>
                <div className='flex gap-3'>
                    <button
                        className={`white-btn text-sm ${activeCategory === 'category1Name' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('category1Name')}
                    >
                        Category 1
                    </button>
                    <button
                        className={`white-btn text-sm ${activeCategory === 'category2Name' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('category2Name')}
                    >
                        Category 2
                    </button>
                    <button
                        className={`white-btn text-sm ${activeCategory === 'category3Name' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('category3Name')}
                    >
                        Category 3
                    </button>
                </div>
            </div>
            <div style={{ height: '400px' }}>
                <MyResponsivePie data={filteredData} /> {/* 필터링된 데이터를 MyResponsivePie에 전달 */}
            </div>
        </div>
    );
}

export default ItemSupplier;