import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function Ordertest2() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className='w-10/12 orderTest2'>
      <div className='bg-slate-700 text-white rounded-xl '>
        <CardHeader
          action={
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title="2024-08-29 AWS 발주"
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div className='text-white'>
            <Table sx={{ margin: 4, minWidth: 650, maxWidth: 900, border: 'white'}} aria-label="simple table">
              <TableHead> 
                <TableRow >
                  <TableCell align="right" sx={{color: 'white'}}>test</TableCell>
                  <TableCell align="right"sx={{color: 'white'}}>test1</TableCell>
                  <TableCell align="right"sx={{color: 'white'}}>test2</TableCell>
                  <TableCell align="right"sx={{color: 'white'}}>test3</TableCell>
                  <TableCell align="right"sx={{color: 'white'}}>test4</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={'test'}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="right" sx={{color: 'white'}}>test</TableCell>
                  <TableCell align="right" sx={{color: 'white'}}>test</TableCell>
                  <TableCell align="right" sx={{color: 'white'}}>test</TableCell>
                  <TableCell align="right" sx={{color: 'white'}}>89746231</TableCell>
                  <TableCell align="right" sx={{color: 'white'}}>89746231</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Collapse>
      </div>
    </div>
  );
}
