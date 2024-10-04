import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useLoading } from "../Compo/LoadingContext";
import { useAlert } from "../Compo/AlertContext";

const MyResponsiveBar = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={['purchaseCount']}
        indexBy="itemName"
        margin={{ top: 30, right: 60, bottom: 40, left: 60 }}
        padding={0.5} 
        colors={({ index }) => `hsl(${270 - index * 7}, 60%, ${40 + index * 6}%)`} 
        enableArcLabels={true}
        label={(d) => (
            <div style={{ color: '#fff' }}>
                {d.value} {/* 구매 수 */}
                <br />
                {/* 주문일: {d.data.orderdate} 주문일 */}
            </div>
        )}
        tooltip={() => null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'bottom',
            legendOffset: 32,
            tickTextColor: '#fff', // x축 글자 색상
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 0,
            tickRotation: 0,
            legend: '판매량',
            legendPosition: 'middle',
            legendOffset: -40,
            tickTextColor: '#fff', // y축 글자 색상
            domain: [0, 'auto'], // 판매량 기준선 0으로 설정
        }}
        //labelTextColor="#fff"
        // legends={[
        //     {
        //         dataFrom: 'keys',
        //         anchor: 'top-right',
        //         direction: 'column',
        //         justify: true,
        //         translateX: 0,
        //         translateY: -75,
        //         itemsSpacing: 10,
        //         itemWidth: 110,
        //         itemHeight: 20,
        //         itemDirection: 'left-to-right',
        //         itemOpacity: 0.85,
        //         symbolSize: 20,
        //         itemTextColor: '#fff', // 범례 글자 색상
        //     },
        // ]}
        theme={{
            axis: {
                ticks: {
                    text: {
                        fill: 'rgb(255, 255, 255)', // 축의 텍스트 색상
                    },
                },
                // legend: {
                //     text: {
                //         fill: 'rgb(255, 255, 255)', // 범례 텍스트 색상
                //     },
                // },
            },
            labels: {
                text: {
                    fill: 'rgb(255, 255, 255)', // 레이블 텍스트 색상
                },
            },
        }}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
    />
);

const ItemTop10 = () => {
    const [chartData, setChartData] = useState([]);
    const { setLoading } = useLoading();
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
    
            const token = localStorage.getItem('token');
    
            try {
                const response = await fetch('/finditem', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                });
    
                if (!response.ok) {
                    throw new Error('네트워크 응답이 실패했습니다.');
                }
    
                const data = await response.json();
    
                // 구매 수량이 가장 큰 5개 아이템을 정렬
                const sortedData = data
                    .sort((a, b) => b.purchaseCount - a.purchaseCount)
                    .slice(0, 10);
    
                // 콘솔에 구매 수량이 가장 많은 5개의 항목과 해당 값을 출력
                console.log("Top 5 Items by Purchase Count:");
                sortedData.forEach(item => {
                    console.log(`Item Name: ${item.itemName}, Purchase Count: ${item.purchaseCount}`);
                });
    
                // 리드타임과 주문일 데이터를 추가로 가져오고 가공
                const processedData = await Promise.all(sortedData.map(async item => {
                    // 각 아이템의 아이디를 사용하여 리드타임 데이터를 가져옴
                    const leadtimeResponse = await fetch(`/pasttime/${item.itemId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                            'Content-Type': 'application/json', // 필요한 경우 추가
                        },
                    });
    
                    // const leadtimeData = await leadtimeResponse.json();
                    // const leadtime = leadtimeData.map(lead => lead.pastleadtime);
                    // const orderdate = leadtimeData.map(lead => lead.orderdate);
    
                    // 리드타임과 주문일을 처리하여 표시할 형식으로 변환
                    return {
                        itemName: item.itemName,
                        purchaseCount: item.purchaseCount,
                        // leadtime: leadtime.join(', '), // 여러 개의 리드타임을 콤마로 구분
                        // orderdate: orderdate.join(', '), // 여러 개의 주문일을 콤마로 구분
                    };
                }));
    
                setChartData(processedData);
                showAlert("데이터 조회에 성공했습니다.", "success");
            } catch (error) {
                console.error('데이터를 가져오는 중 오류가 발생:', error);
                showAlert("데이터 조회에 실패했습니다.", "error");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    

    return (
        <div>
            <div style={{ height: '400px' }}>
                <MyResponsiveBar data={chartData} />
            </div>
        </div>
    );
};

export default ItemTop10;
