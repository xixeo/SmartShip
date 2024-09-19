import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import Box from '@mui/material/Box';

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

export default function MyOrderList() {
    const [expanded, setExpanded] = useState({});
    const [listdata, setListdata] = useState([]);
    const orderdate = '2024-09-16';
    const token = localStorage.getItem('token');

    useEffect(()=>{
        const fetchMyorderdata = async() => {
            const myorderlist = [
                {

                },
            ];
            try{
                const response = await fetch(``,
                   {
                    headers: {
                        'Authorization' : `Bearer ${token}`
                    }
                   }
                );
                if (!response.ok) {
                    throw new Error('myorderlist response was not ok');
                  };
                const myorderlist = await response.json();
                setListdata(myorderlist);
                fetchMyorderdata();
            }catch(e){
                console.log('Failed to fetch getMyOrderList',e)
            }
        }        
    })


   //////////////////////
  //  카드 확장 함수   //
 //////////////////////

  const handleExpandClick = (orderdate) => () => {
    setExpanded({
      ...expanded,
      [orderdate]: !expanded[orderdate],
    });
  };

  return (
    <div className="flex-col text-white MyOrderList">
        <h4 className='m-2'>구매 요청 내역</h4>
      {/* {Object.keys(groupedData).map((username) => ( */}
        <div key={orderdate} className={` 'text-white rounded-xl m-5 border border-[#69686F]' card`}>
            {orderdate}
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
            <IconButton
              onClick={handleExpandClick(orderdate)}
              aria-expanded={expanded[orderdate] || false}
              aria-label="show more"
              className={`transition-transform ${expanded[orderdate] ? 'rotate-180' : ''}`}
              sx={{ color: 'white', marginLeft: 'auto' }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          <Collapse in={expanded[orderdate]} timeout="auto" unmountOnExit>
            <div className="w-full p-4">
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      'th, td': {
                        bgcolor: '#47454F',
                        color: 'white',
                        fontWeight: 'bold',
                        border: 'none',
                      },
                    }}
                  >
                    <TableCell align="center">Item Name</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Supplier</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {groupedData[username].map((detail) => { */}
                    {/* return ( */}
                      <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>품목명</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>수량</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>가격</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>판매자</TableCell>
                        {/* <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.itemName}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.quantity}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>
                          {formatPrice(detail.price, detail.quantity, detail.unit)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.SuplierName}</TableCell> */}
                      </TableRow>
                    {/* ); */}
                  {/* })} */}
                </TableBody>
              </Table>
            </div>
            {/* <div className='flex justify-between p-2'>
              <h2>
               총 주문 금액 : {getFormattedCardTotal(orderdate)}
              </h2>
              <h2 className='text-[#FFCC6F] font-semibold'>
                예상 리드타임 : {getLongestCheckedLeadTime(orderdate)}
              </h2>
            </div> */}
          </Collapse>
        </div>
      {/* ))} */}
    </div>
  )
}
