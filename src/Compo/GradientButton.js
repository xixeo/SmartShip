import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(to bottom, #43C5FE, #8A8FFB)',
  color: 'Black',
  fontWeight: 'bold'
}));

export default GradientButton;
