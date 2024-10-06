import React, { useEffect, useState } from "react";
import { useLoading } from "../Compo/LoadingContext";
import { useAlert } from "../Compo/AlertContext";

const ItemOrderList = () => {
    const [orderData, setOrderData] = useState([]);
    const token = localStorage.getItem('token'); 
    const { setLoading } = useLoading();
    const { showAlert } = useAlert();

    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjgyNTMyNzEsImlkIjoi7KCV7ZW07J24IiwidXNlcm5hbWUiOiJL7ZW07Jq07ISg7IKsIiwiYWxpYXMiOiLsoJXtlbTsnbgiLCJyb2xlIjoiUk9MRV9NQU5BR0VSIn0.Ly0xbi6L85QbXvcLumLR317rfnuCnxTYwZQCeH6C0ME'

    useEffect(() => {
        // API 요청
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/supplierOrder', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                console.log(data); 

                // 가장 최근 3개의 날짜 추출 및 데이터 세팅
                const groupedDetails = data.groupedOrderDetails;
                const latestOrders = Object.keys(groupedDetails)
                    .sort((a, b) => new Date(b) - new Date(a)) // 날짜 순 정렬 (최근 날짜부터)
                    .slice(0, 3); // 최근 3개의 날짜만 추출

                const ordersToDisplay = latestOrders.map((date) => {
                    const orderItems = groupedDetails[date];
                    const itemCount = orderItems.length;

                    if (itemCount === 1) {
                        // 항목이 1개인 경우
                        return { date, displayText: `${orderItems[0].itemName}`, orderDate: `${date}`};
                    } else {
                        // 항목이 여러 개인 경우
                        return { date, displayText: `${orderItems[0].itemName} 외 ${itemCount - 1}개`, orderDate: `${date}` };
                    }
                });

                setOrderData(ordersToDisplay);
                showAlert("데이터 조회에 성공했습니다.", "success");
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
                showAlert("데이터 조회에 실패했습니다.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    return (
        <div className=" text-white">
            {orderData.length > 0 ? (
                orderData.map((order, index) => (
                    <div key={index} className="flex justify-between items-center m-2 mt-5 px-6 py-4 card-bg rounded-lg">
                        <h3 className="text-lg font-bold">{order.displayText}</h3>
                        <div className="flex items-center">
                        <h1 className="text-sm">주문일자 : </h1>
                        <h3 className="ml-4 text-xl font-bold text-[#A276FF]">{order.orderDate}</h3>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center">
                <p>주문 요청 데이터가 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default ItemOrderList;
