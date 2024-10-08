import * as React from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // dayjs 한국어 로케일 가져오기
import { TextField } from "@mui/material";
import "./BasicDatePicker.scss";

const weekdaysKor = ["일", "월", "화", "수", "목", "금", "토"];

export default function BasicDatePicker({ onDateAccept, onDayChange }) {
  const [value, setValue] = React.useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? dayjs(savedDate) : dayjs();
  });

  const [savedDay, setSavedDay] = React.useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    const savedDayIndex = savedDate ? dayjs(savedDate).day() : dayjs().day();
    return weekdaysKor[savedDayIndex];
  });

  const handleAccept = (newValue) => {
    if (newValue && newValue.isValid()) {
      if (onDateAccept) {
        onDateAccept(newValue); // 상위 컴포넌트에 선택된 날짜를 전달
      }
      setValue(newValue); // accept 버튼을 눌렀을 때 실제로 날짜를 저장
      const newSavedDay = weekdaysKor[newValue.day()]; // 새로운 요일 계산
      setSavedDay(newSavedDay); // 요일 저장
      localStorage.setItem("selectedDate", newValue.format("YYYY-MM-DD"));
      if (onDayChange) {
        onDayChange(newSavedDay); // 상위 컴포넌트에 요일 전달
      }
    } else {
      // newValue가 null이거나 유효하지 않을 때의 처리
      setValue(dayjs()); // 기본값으로 오늘 날짜로 설정
      setSavedDay(weekdaysKor[dayjs().day()]); // 오늘 날짜의 요일로 설정
      localStorage.removeItem("selectedDate"); // 로컬 스토리지에서 날짜 제거
      if (onDayChange) {
        onDayChange(weekdaysKor[dayjs().day()]); // 오늘 요일 전달
      }
    }
  };

  return (
    <div className="BasicDatePicker">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DesktopDatePicker
          inputFormat="YYYY-MM-DD"
          value={value}
          onChange={(newValue) => {
            if (newValue && newValue.isValid()) {
              setValue(newValue); // dayjs 객체 상태로 설정
            }
          }}
          onAccept={handleAccept} // accept 버튼을 눌렀을 때만 최종 값 업데이트
          closeOnSelect={false} // 날짜 선택 후 달력이 닫히지 않도록 설정
          renderInput={(params) => (
            <TextField
              {...params}
              value={value.format("YYYY-MM-DD")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ffffff50 !important", // 기본 border color
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent", // hover 시 border color
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#43c5fe !important", // focused 시 border color
                  },
                },
              }}
            />
          )}
          slotProps={{
            actionBar: {
              actions: ["clear", "accept"], // clear와 accept 버튼만 표시
              sx: {
                "& .MuiButton-root": {
                  color: "#000", // clear와 accept 버튼 색상
                  "&:hover": {
                    backgroundColor: "#F0F4FB",
                  },
                },
              },
            },
            day: {
              sx: {
                "&.Mui-selected": {
                  backgroundColor: "#43c5fe !important",
                  color: "#fff",
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
