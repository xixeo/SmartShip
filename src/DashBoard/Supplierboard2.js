import React, { useState } from 'react';
import './Board.css';
import Announce from './AnnouncementForDash';
import ItemSupplier from './itemSupplier';
import MyResponsiveBar from './itemTop10';
import ItemOrderList from './itemOrderList';

function Supplierboard2() {
    const [selectedCategory, setSelectedCategory] = useState('category2Name'); // 기본값으로 category2 선택

    // 카테고리 변경 핸들러
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="board">
            <div className="top-section">
                <div className="left-side">
                    {/* 공지사항 */}
                    <div className="announcement text-lg font-bold">
                        <h1>공지사항</h1>
                        <Announce />
                    </div>

                        {/* 일정 */}
                        <div className="schedule text-lg font-bold">
                            <h1>주문 요청 내역</h1>
                            <ItemOrderList />
                            {/* <div className="border border-gray-400 rounded-full px-5 py-1">
                                <div className="status-icon pending  mr-2" /> 작업전
                                <div className="status-icon in-progress  mr-2 ml-4" /> 작업중
                                <div className="status-icon compleㅇted  mr-2 ml-4" /> 작업완료
                            </div> */}
             
                        {/* <div className="status-item mt-7">
                            <div className="status-icon pending"></div>
                            <div>2024-09-30 발주예정</div>
                            <div className="status-details">
                                <div>AWS 선박1</div>
                                <div className="date-text text-sm">2023.06.22</div>
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon in-progress"></div>
                            <div>2024-10-05 발주예정</div>
                            <div className="status-details">
                                <div>AWS 선박2</div>
                                <div className="date-text text-sm">2023.06.22</div>
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon completed"></div>
                            <div>2024-10-10 발주예정</div>
                            <div className="status-details">
                                <div>AWS 선박3</div>
                                <div className="date-text text-sm">2023.06.22</div>
                            </div>
                        </div> */}
                    </div>
                </div>
                {/* 판매물품 카테고리 내역 */}
                <div className="right-side text-lg font-bold">
                    <h1>판매물품</h1>
                    {/* ItemSupplier에서 선택된 카테고리 전달 */}
                    <ItemSupplier selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                </div>
            </div>
            {/* 물품 구매 추이 */}
            <div className="bottom-section text-lg font-bold">
                <h1>판매량 Top10</h1>
                <MyResponsiveBar />
            </div>
        </div>
    );
}

export default Supplierboard2;
