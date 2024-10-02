import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { useLoading } from '../Compo/LoadingContext';

export default function ChartTest() {
    const [chartdata, setChartdata] = useState([]);
    const { setLoading } = useLoading;
    const orderId = 134;
    const token = localStorage.getItem('token');

    const fetchOrderDetails = async () => {
        // setLoading(true);
        try {
            const response = await fetch(`/getOrderDetail/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch order details");
            }
            const details = await response.json();
            const formattedData = (Array.isArray(details) ? details : [details]).flatMap((order) =>
                order.orderDetails.map((detail) => ({
                    date: detail.recommendedOrderDate,
                    leadtime: detail.leadtime,
                    item: detail.itemName,
                }))
            );
            setChartdata(formattedData);
        } catch (e) {
            console.error('Error fetching order details:', e);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // 날짜별로 데이터를 처리하는 함수
    const processData = (chartdata, items) => {
        const result = {};
        chartdata.forEach(entry => {
            const { date, leadtime, item } = entry;
            if (!result[date]) {
                result[date] = Array(items.length).fill(0);
            }
            const itemIndex = items.indexOf(item);
            if (itemIndex !== -1) {
                result[date][itemIndex] = leadtime;
            }
        });

        const sortedDates = Object.keys(result).sort((a, b) => new Date(b) - new Date(a));

        for (let i = 1; i < sortedDates.length; i++) {
            const currentDate = sortedDates[i];
            const previousDate = sortedDates[i - 1];
            result[currentDate] = result[currentDate].map((value, index) =>
                value === 0 && result[previousDate][index] !== 0
                    ? result[previousDate][index]
                    : value
            );
        }

        return result;
    };

    const items = chartdata.map(i => i.item);
    const barData = processData(chartdata, items);
    console.log('데이터',barData)
    console.log('타임라인',Object.keys(barData).sort((a, b) => new Date(a) - new Date(b)))
    
    useEffect(() => {
        if (chartdata.length > 0 && items.length > 0) {
            const sortedDates = Object.keys(barData).sort((a, b) => new Date(a) - new Date(b));
            const newOption = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        autoPlay: true,
                        playInterval: 1000,
                        data: sortedDates,
                    },
                    title: { subtext: '' },
                    tooltip: { trigger: 'item' },
                    legend: { left: 'right', data: ['Lead Time'] },
                    xAxis: [{ type: 'category', data: items, splitLine: { show: false } }],
                    yAxis: [{ type: 'value', name: 'Lead Time (days)' }],
                    series: [{ name: 'Lead Time', type: 'bar' }]
                },
                options: sortedDates.map(date => ({
                    title: { text: `Lead time for items that can be ordered on ${date}` },
                    series: [{ data: barData[date] }]
                }))
            };

            const chartDom = document.getElementById('main-chart');
            if (chartDom) {
                const myChart = echarts.init(chartDom);
                myChart.setOption(newOption);

                const resizeHandler = () => myChart.resize();
                window.addEventListener('resize', resizeHandler);

                return () => {
                    myChart.dispose();
                    window.removeEventListener('resize', resizeHandler);
                };
            }
        }
    }, [barData, items]);

    // 데이터 로딩 중일 때 표시
    if (chartdata.length === 0 || items.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div id="main-chart" style={{ width: '100%', height: '400px' }}></div>
        </div>
    );
}
