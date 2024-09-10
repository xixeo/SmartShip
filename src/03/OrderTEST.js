import * as React from 'react';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import './style.css';

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

// Helper function: 그룹을 username별로 나누기
const groupByUsername = (orderDetails) => {
  return orderDetails.reduce((groups, detail) => {
    const { username } = detail;
    if (!groups[username]) {
      groups[username] = [];
    }
    groups[username].push(detail);
    return groups;
  }, {});
};

export default function Ordertest2() {
  // 서버로부터 받은 데이터 예시
  const data = [
    {
      orderId: 1,
      username: 'AWS선박',
      alias: '유승호',
      releaseDate: '2024-05-04',
      orderDate: '2024-09-06',
      memo: '테스트',
      orderDetails: [
        {
          orderDetailId: 1,
          category1Name: '옷',
          category2Name: '바지',
          category3Name: '여성바지',
          itemName: '청바지',
          quantity: 10,
          price: 39900.0,
          unit: 'KRW',
          username: '민주샵',
        },
        {
          orderDetailId: 7,
          category1Name: '옷',
          category2Name: '바지',
          category3Name: '남성바지',
          itemName: '청바지',
          quantity: 5,
          price: 39900.0,
          unit: 'KRW',
          username: '민주샵',
        },
        {
          orderDetailId: 8,
          category1Name: '옷',
          category2Name: '바지',
          category3Name: '남성바지',
          itemName: '청바지',
          quantity: 10,
          price: 59900.0,
          unit: 'KRW',
          username: '수플린',
        },
      ],
    },
  ];

  const [expanded, setExpanded] = React.useState({});
  const [checked, setChecked] = React.useState({});
  const [startDate, setStartDate] = React.useState();

  // 전체 체크 상태 결정
  const allChecked = Object.values(checked).every(Boolean);
  const someChecked = Object.values(checked).some(Boolean) && !allChecked;

  // username별로 그룹화된 데이터를 받아옴
  const groupedData = groupByUsername(data[0].orderDetails);


  const handleChangeParent = (event) => {
    const newChecked = {};
    Object.keys(groupedData).forEach((username) => {
      newChecked[username] = event.target.checked;
    });
    setChecked(newChecked);
  };

  const handleChangeChild = (username) => (event) => {
    setChecked({
      ...checked,
      [username]: event.target.checked,
    });
  };

  const handleExpandClick = (username) => () => {
    setExpanded({
      ...expanded,
      [username]: !expanded[username],
    });
  };

  const handleExpandAll = () => {
    const newExpanded = {};
    Object.keys(groupedData).forEach((username) => {
      newExpanded[username] = true;
    });
    setExpanded(newExpanded);
  };

  const handleCollapseAll = () => {
    const newExpanded = {};
    Object.keys(groupedData).forEach((username) => {
      newExpanded[username] = false;
    });
    setExpanded(newExpanded);
  };

  return (
    <div className="flex-col text-white">
      <div className="w-full flex justify-between">
        <h2 className="text-xl font-semibold text-white mb-4">장바구니</h2>
      </div>
      <div className="bg-[#2F2E38] m-5 p-5 rounded-lg">
        {/* 부모 체크박스 ================================================== 처음 로딩때 왜 전체 체크 안되있는데 니 맘대로 색칠해있냐,,?*/}
        <FormControlLabel
          label="전체 선택"
          control={
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked}
              onChange={handleChangeParent}
              sx={{ color: 'white' }}
            />
          }
        />
        <div className='flex justify-end'>
          <Button
            variant="contained"
            onClick={handleExpandAll}
            style={{ marginRight: '10px' }}
            sx={{bgcolor: '#43C5FE'}}
            >
            전체 열기
          </Button>
          <Button variant="contained" onClick={handleCollapseAll} sx={{bgcolor: '#43C5FE'}}>
            전체 닫기
          </Button>
        </div>
        {Object.keys(groupedData).map((username) => (
          <div key={username} className="bg-[#2F2E38] text-white rounded-xl m-5 border ">
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
              {/* 왼쪽에 체크박스 */}
              <FormControlLabel
                label={username}
                control={
                  <Checkbox checked={checked[username] || false} onChange={handleChangeChild(username)} sx={{ color: 'white' }} />
                }
                sx={{ color: 'white' }}
              />
              {/* 오른쪽에 아이콘 */}
              <IconButton
                onClick={handleExpandClick(username)} // 각 카드의 expand 상태 처리
                aria-expanded={expanded[username] || false}
                aria-label="show more"
                className={`transition-transform ${expanded[username] ? 'rotate-180' : ''
                  }`}
                sx={{ color: 'white', marginLeft: 'auto' }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
            <Collapse in={expanded[username]} timeout="auto" unmountOnExit>
              <div className="w-full p-4">
                <Table aria-label="simple table">
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
                      <TableCell align="center">Category1 Name</TableCell>
                      <TableCell align="center">Category2 Name</TableCell>
                      <TableCell align="center">Category3 Name</TableCell>
                      <TableCell align="center">Item Name</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">BestOrderDate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedData[username].map((detail) => (
                      <TableRow
                      key={detail.orderDetailId}
                      sx={{ }}
                      >
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category1Name}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category2Name}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.category3Name}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.itemName}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.quantity}</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}> 
                          {detail.unit === 'KRW' ? `₩ ${detail.price}` :
                          detail.unit === 'USD' ? `$ ${detail.price}` :
                          detail.unit === 'JPY' ? `¥ ${detail.price}` :
                          detail.unit === 'EUR' ? `₤ ${detail.price}` :
                          detail.price}
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#67666E', fontWeight: 'semi-bold', color: 'white', border: 'none' }}>{detail.bestorderday}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    </div>
  );
}
