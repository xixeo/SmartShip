import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { useLoading } from '../Compo/LoadingContext';
import { Select, MenuItem } from '@mui/material'

export default function ChartTest() {
    const [chartdata, setChartdata] = useState([]);
    const [listdata, setListdata] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const { setLoading } = useLoading();
    const token = localStorage.getItem('token');

    const fetchpurcheslist = async () => {
        setLoading(true);
        try {
            const response = await fetch("schedule", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error("purchaserequestlist response was not ok");
            }
            const purreq = await response.json();
            const sortdata = purreq.sort((a, b) => b.orderId - a.orderId);
            setListdata(sortdata.slice(0, 5));
        } catch (e) {
            console.log("Failed to fetch PurchaseRequestlist", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchpurcheslist();
    }, []);

    const handleChange = (event) => {
        setSelectedOrderId(event.target.value);
    };

    useEffect(() => {
        // listdata가 변경될 때 첫 번째 값을 자동으로 선택
        if (listdata.length > 0) {
            setSelectedOrderId(listdata[0].orderId);
        }
    }, [listdata]); // listdata가 변경될 때만 실행

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/getOrderDetail/${selectedOrderId}`, {
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
                    item: `${detail.itemName} (${detail.itemsId})`
                }))
            );
            setChartdata(formattedData);
        } catch (e) {
            console.error('Error fetching order details:', e);
        }
    };

    useEffect(() => {
        if (selectedOrderId) {
            fetchOrderDetails();
        }
    }, [selectedOrderId]);

    useEffect(() => {
        if (chartdata.length > 0) {
            initchart();
        }
    }, [chartdata]);

    const processData = (chartdata, items) => {
        const result = {};
        const currentDate = new Date();

        chartdata.forEach((entry) => {
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

    const barData = processData(chartdata, chartdata.map((i) => i.item));

    const getUniqueRandomColors = (count) => {
        const colors = [];
        while (colors.length < count) {
            const color = `hsl(${Math.random() * 40 + 240}, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 40}%)`;
            colors.push(color);
        }
        return colors;
    };

    const initchart = () => {
        const chartDom = document.getElementById("main-chart");
        if (chartDom) {
            const myChart = echarts.init(chartDom);
            // items 배열을 itemName만 포함하도록 처리
            const items = chartdata.map((i) => i.item.split(" (")[0]); // itemId를 제거하고 itemName만 남김
            const itemColors = getUniqueRandomColors(items.length);

            const sortedDates = Object.keys(barData).sort((a, b) => new Date(a) - new Date(b));
            const newOption = {
                baseOption: {
                    timeline: {
                        axisType: "category",
                        autoPlay: true,
                        playInterval: 1000,
                        data: sortedDates,
                    },
                    title: {
                        text: `발주 요청 품목 리드타임`,
                        left: "center",
                        textStyle: { color: "#FFFFFF" }, 
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: (params) => `${params.name}: ${params.value}`,
                    },
                    legend: {
                        left: "right",
                        data: items,
                    },
                    xAxis: [{
                        type: "category",
                        data: items,
                        splitLine: { show: false },
                    }],
                    yAxis: [{
                        type: "value",
                        name: "Lead Time (days)",
                    }],
                    series: [{ type: "bar", barWidth: 30, data: [] }],
                },
                options: sortedDates.map((date) => {
                    const dataForDate = barData[date].map((value, index) => ({
                        value,
                        itemStyle: { color: itemColors[index] },
                    }));
                    return {
                        series: [{ data: dataForDate }],
                    };
                }),
            };

            myChart.setOption(newOption);
            window.addEventListener("resize", () => myChart.resize());

            return () => {
                myChart.dispose();
                window.removeEventListener("resize", () => myChart.resize());
            };
        }
    };

    return (
        <div className="list-table-root" style={{ position: 'relative', width: '100%', height: '400px' }}>
        {/* 차트 */}
        <div id="main-chart" style={{ width: '100%', height: '100%' }}></div>
    
        {/* 셀렉트박스 */}
        <Select
            className="select-custom"
            value={selectedOrderId}
            onChange={handleChange}
            style={{
                position: 'absolute',
                top: '10px',
                right: '160px',
                bottom: '10px',
                zIndex: 1,
                minWidth: '200px'
            }}
        >
            {listdata.map((i, index) => (
                <MenuItem key={index} value={i.orderId}>
                    {i.username} {i.requestDate}
                </MenuItem>
            ))}
        </Select>
    </div>
    
    );
}
