import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useLoading } from "../Compo/LoadingContext";
import { useAlert } from "../Compo/AlertContext";

const MyResponsiveBar = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={['purchaseCount', 'leadtime']}
        indexBy="itemName"
        margin={{ top: 80, right: 60, bottom: 40, left: 60 }}
        padding={0.3}
        colors={['#90d5e6', '#0094d8']}
        enableArcLabels={true}
        label={(d) => (
            <div style={{ color: '#fff' }}>
                {d.value} {/* 구매 수 */}
                <br />
                리드타임: {d.data.leadtime} {/* 리드타임 */}
                <br />
                주문일: {d.data.orderdate} {/* 주문일 */}
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
            tickPadding: 5,
            tickRotation: 0,
            legend: '판매량',
            legendPosition: 'middle',
            legendOffset: -40,
            tickTextColor: '#fff', // y축 글자 색상
            domain: [0, 'auto'], // 판매량 기준선 0으로 설정
        }}
        axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '리드타임',
            legendPosition: 'middle',
            legendOffset: 40,
            tickTextColor: '#fff', // y2축 글자 색상
            domain: [0, 'auto'], // 리드타임 기준선 0으로 설정
        }}
        labelTextColor="#fff"
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'top-right',
                direction: 'column',
                justify: true,
                translateX: 0,
                translateY: -75,
                itemsSpacing: 10,
                itemWidth: 110,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                itemTextColor: '#fff', // 범례 글자 색상
            },
        ]}
        theme={{
            axis: {
                ticks: {
                    text: {
                        fill: 'rgb(255, 255, 255)', // 축의 텍스트 색상
                    },
                },
                legend: {
                    text: {
                        fill: 'rgb(255, 255, 255)', // 범례 텍스트 색상
                    },
                },
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

            try {
                const response = await fetch('/finditem');
                const data = await response.json();

                const itemData = await Promise.all(data.map(async item => {
                    // 각 아이템의 itemsId를 사용하여 리드 타임 데이터를 가져옴
                    //const leadtimeResponse = await fetch(`/pasttime/${item.itemId}`);
                    //const leadtimeData = await leadtimeResponse.json();

                    //console.log(`Item ID: ${item.itemId}, Leadtime Data:`, leadtimeData);

                    // 리드 타임이 여러 개일 수 있으므로 필요한 경우 처리
                    //const leadtime = leadtimeData.length > 0 ? leadtimeData[0].pastleadtime : null;
                    //const orderdate = leadtimeData.length > 0 ? leadtimeData[0].orderdate : null;

                    //console.log(`Item Name: ${item.itemName}, Lead Time: ${leadtime}, Order Date: ${orderdate}`);

                    return {
                        itemName: item.itemName,
                        purchaseCount: item.purchaseCount,
                        // leadtime: leadtime,
                        // oderdate: orderdate,
                    };
                }));

                // 구매 수량이 가장 큰 10개 아이템을 정렬
                const sortedData = itemData
                    .sort((a, b) => b.purchaseCount - a.purchaseCount)
                    .slice(0, 10);

                setChartData(sortedData);
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
