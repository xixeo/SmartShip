import React from 'react';
import './Board.scss';
import PurchaseRequest from './PurchaseRequestForDash';
import Announce from './AnnouncementForDash';
import Leadtimechart from './charttest';
import CardForDash from './CardForDash';
import { useNavigate } from "react-router-dom";

function Board() {
  const navigate = useNavigate();

  return (
    <div className="board">
      <div className="top-section">
        <div className="left-side">
          {/* 공지사항 */}
          <div className="announcement text-lg font-bold">
            <h1 onClick={() => navigate(`Announcement`)}>공지사항</h1>
            <Announce />
          </div>
          <div className="schedule">
            {/* 일정 */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold">출고 일정</div>
              <div className="border border-gray-400 rounded-full px-5 py-1">
                <div className="status-icon pending  mr-2" /> 발주중
                <div className="status-icon in-progress  mr-2 ml-4" /> 발주완료
              </div>
            </div>
            <CardForDash />
          </div>
        </div>
        {/* 구매 요청 */}
        <div className="right-side text-lg font-bold">
          <h1 onClick={() => navigate(`PurchaseRequest`)}>구매 요청</h1>
          <PurchaseRequest />
        </div>
      </div>
      {/* 물품 구매 추이 */}
      <div className="bottom-section text-lg font-bold">
        <Leadtimechart />
      </div>
    </div>
  );
}

export default Board;
