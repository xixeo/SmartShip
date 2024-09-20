import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Box from '@mui/material/Box';
import Loading from '../Compo/Loading';
import { useNavigate } from 'react-router-dom';

//////////////////////
//    확장 아이콘    //
//////////////////////
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    transform: (props) => (props.expand ? 'rotate(180deg)' : 'rotate(0deg)'),
}));

export default function PurchaseRequest() {
    const [expanded, setExpanded] = useState({});
    const [loading, setLoading] = useState(true);
    const [listdata, setListdata] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();


    const fetchpurcheslist = async () => {
        setLoading(true)
        try {
            const response = await fetch('schedule',
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            )
            if (!response.ok) {
                throw new Error('purchaserequestlist response was not ok')
            }
            const purreq = await response.json();
            const sortdata = purreq.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
            setListdata(sortdata)

             // 모든 카드 확장 상태를 true로 설정
             const initialExpanded = {};
             sortdata.forEach(order => {
                 initialExpanded[order.orderId] = true; // 모든 카드가 확장된 상태
             });
             setExpanded(initialExpanded);
             
            setLoading(false)
        } catch (e) {
            console.log('Failed to fetch PurchaseRequestlist', e);
        }
    };

    console.log(listdata);

    useEffect(() => {
        fetchpurcheslist()
    }, [])


    //////////////////////
    //  카드 확장 함수   //
    //////////////////////

    const handleExpandClick = (orderId) => () => {
        setExpanded({
            ...expanded,
            [orderId]: !expanded[orderId],
        });
    };

    return (
        <div>
            {loading ? (<Loading /> ): 
            (<div className='bg-[#2F2E38] m-5 p-5 rounded-lg'>
                <h1 className='text-white font-bold text-xl'>구매 요청</h1>
                { listdata.map((order) => 
                <div key={order.orderId} className="text-white rounded-lg m-5 bg-[#24232B]"  onClick={(e) => navigate(`/getOrderDetail/${order.orderId}`)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                        <div className='w-full'>
                        <div className='w-full flex justify-between items-center mb-3'>
                            <div className='flex text-xs'>
                            <h1 className='text-xs mr-2'>희망입고일</h1>
                            <h1 className='text-xs'>{order.releaseDate}</h1>
                            </div>
                            <div className='flex text-xs'>
                            <h1 className='mr-2'>주문일자 : </h1>
                            <h1>{order.requestDate}</h1>
                            </div>
                        </div>
                        <div className='w-full flex justify-between items-center'>
                        <h1 className='text-xl font-bold text-[#A276FF]'>
                        {order.username}
                        </h1>
                        <div className='flex items-end'>
                        <h1 className='mr-3 text-sm'>발주예정일</h1>
                        <h1 className='ml-2 text-xl font-bold text-[#A276FF]'>{order.bestOrderDate}</h1>
                        </div>
                        </div>
                        </div>
                        <IconButton
                           onClick={(e) => {e.stopPropagation(); handleExpandClick(order.orderId)()}}
                           aria-expanded={expanded[order.orderId] || false}
                           aria-label="show more"
                           className={`transition-transform ${expanded[order.orderId] ? 'rotate-180' : ''}`}
                           sx={{ color: 'white', marginLeft: 'auto' }}
                        >
                            <ArrowDropDownIcon fontSize='large' />
                        </IconButton>
                    </Box>
                    <Collapse in={expanded[order.orderId]} timeout="auto" unmountOnExit>
                        <div className='ml-3 mb-3 mr-12'>
                            <h1>비고</h1>
                            <div className='mr-5 p-5 rounded-lg bg-[#24232B] border-[#605F63] border'>
                                {order.memo}
                            </div>
                        </div>
                    </Collapse>
                </div>
                )}
            </div>)}
        </div>
    )
}
