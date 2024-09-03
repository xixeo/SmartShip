import React from 'react';
import Modal from '../Compo/Modal';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';

// 필요한 스케일 및 요소 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LeadTimeModal = ({ open, setOpen, leadTimeData }) => {
    if (!open) return null;

    // 예시 데이터: supplier_name과 그에 대응하는 리드타임
    const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];
    const predictedLeadTimes = [10, 15, 7, 12]; // 각 공급자별 리드타임 데이터

    // 그래프 데이터 구성
    const data = {
        labels: suppliers, // x축에 표시될 공급자 이름
        datasets: [
            {
                label: 'Predicted Lead Time (days)',
                data: predictedLeadTimes,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)', // 라인 아래 영역 채우기
                fill: true,
            },
        ],
    };

    return (
        <Modal open={open} setOpen={setOpen} title="업체별 예상 리드타임">
            <Line data={data} />
        </Modal>
    );
};

export default LeadTimeModal;
