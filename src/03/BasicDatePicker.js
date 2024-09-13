import * as React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // dayjs 한국어 로케일 가져오기
import { Popper, TextField } from '@mui/material';
import './BasicDatePicker.css'

export default function BasicDatePicker({ onDateAccept }) {
  const [value, setValue] = React.useState(() => {
    const savedDate = localStorage.getItem('selectedDate');
    return savedDate ? dayjs(savedDate) : dayjs().add(1, 'month');
  });

  const handleAccept = (newValue) => {
    if (onDateAccept) {
      onDateAccept(newValue); // 상위 컴포넌트에 선택된 날짜를 전달
    }
    setValue(newValue); // accept 버튼을 눌렀을 때 실제로 날짜를 저장
  };

  return (
    <div className='BasicDatePicker'>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko"> {/* 한국어 로케일 설정 */}
      <DesktopDatePicker
        label="날짜 선택"
        inputFormat="MM/DD/YYYY"
        value={value}
        onChange={(newValue) => {
          if (newValue && newValue.isValid()) {
            setValue(newValue); // dayjs 객체 상태로 설정
          }
        }}
        onAccept={handleAccept} // accept 버튼을 눌렀을 때만 최종 값 업데이트
        closeOnSelect={false} // 날짜 선택 후 달력이 닫히지 않도록 설정
        components={{
          // TextField: (props) => <TextField {...props} />,
          TextField: <TextField />,
        }}
        slotProps={{
          actionBar: {
            actions: ['clear', 'accept'], // clear와 accept 버튼만 표시
          },
        }}
      />
    </LocalizationProvider>
    </div>
  );
}