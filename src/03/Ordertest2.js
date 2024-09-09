import * as React from 'react';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Dayjs 어댑터
import dayjs from 'dayjs'; // dayjs 가져오기
import 'dayjs/locale/ko'; // dayjs 한국어 로케일 가져오기
import { TextField, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // 달력 아이콘
import './style.css';

export default function BasicDatePicker() {
  const [value, setValue] = React.useState(dayjs()); // 초기값을 dayjs로 설정

  const handleChange = (newValue) => {
    setValue(newValue); // 날짜 변경 시 값 업데이트
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko"> {/* 한국어 로케일 설정 */}
      <MobileDatePicker
        label="날짜 선택"
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  <IconButton
                    sx={{ color: 'white' }}
                    onClick={() => params.inputProps.onClick()} // 아이콘 클릭 시 날짜 피커 열기
                  >
                    <CalendarTodayIcon />
                  </IconButton>
                </>
              ),
            }}
            sx={{
              input: { color: 'white' }, // 텍스트 색상을 하얀색으로 변경
              label: { color: 'white' }, // 라벨 색상을 하얀색으로 변경
              '.MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' }, // 테두리 색상 하얀색
                '&:hover fieldset': { borderColor: 'white' }, // 호버 시 테두리 색상
                '&.Mui-focused fieldset': { borderColor: 'white' }, // 포커스 시 테두리 색상
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}





// import * as React from 'react';
// import { DesktopDatePicker } from '@mui/x-date-pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Dayjs 어댑터
// import dayjs from 'dayjs'; // dayjs 가져오기
// import 'dayjs/locale/ko'; // dayjs 한국어 로케일 가져오기
// import { TextField } from '@mui/material';
// import './style.css';

// export default function BasicDatePicker() {
//   const [value, setValue] = React.useState(dayjs()); // 초기값을 dayjs로 설정
//   const [tempValue, setTempValue] = React.useState(dayjs()); // 임시값 저장

//   const handleChange = (newValue) => {
//     setTempValue(newValue); // 날짜가 변경될 때 임시로 저장
//   };

//   const handleAccept = (newValue) => {
//     setValue(newValue); // accept 버튼을 눌렀을 때 실제로 날짜를 저장
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko"> {/* 한국어 로케일 설정 */}
//       <DesktopDatePicker
//         label="날짜 선택"
//         value={tempValue} // 임시값을 표시
//         onChange={handleChange} // 날짜 변경 시 임시값 업데이트
//         onAccept={handleAccept} // accept 버튼을 누를 때만 최종 값 업데이트
//         slots={{
//           textField: (params) => (
//             <TextField
//               {...params}
//               sx={{
//                 input: { color: 'white' }, // 텍스트 색상을 하얀색으로 변경
//                 label: { color: 'white' }, // 라벨 색상을 하얀색으로 변경
//                 '.MuiOutlinedInput-root': {
//                   '& fieldset': { borderColor: 'white' }, // 테두리 색상 하얀색
//                   '&:hover fieldset': { borderColor: 'white' }, // 호버 시 테두리 색상
//                   '&.Mui-focused fieldset': { borderColor: 'white' }, // 포커스 시 테두리 색상
//                 },
//                 '.css-1a7z5rc-MuiButtonBase-root-MuiIconButton-root': { color: 'white' },
//               }}
//             />
//           ),
//         }}
//         slotProps={{
//           actionBar: {
//             actions: ['clear', 'accept'], // clear와 accept 버튼만 표시
//           },
//         }}
//       />
//     </LocalizationProvider>
//   );
// }
