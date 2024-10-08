import React, { useState, useEffect, useRef } from "react";
import { useLoading } from "../Compo/LoadingContext";
import { useNavigate } from "react-router-dom";
import './Board.scss';

export default function CardForDash() {
  const [listdata, setListdata] = useState([]);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const today = new Date();

  useEffect(() => {
    const fetchorders = async () => {
      setLoading(true)
      // const data = [
      //   {
      //     "orderId": 115,
      //     "username": "정해인",
      //     "alias": "정해인",
      //     "requestDate": "2024-09-27",
      //     "releaseDate": "2024-09-27",
      //     "memo": "",
      //     "state": "ready",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 214,
      //         "itemsId": 2,
      //         "itemName": "청바지",
      //         "part1": "진청",
      //         "price": 40100.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "수플린",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 215,
      //         "itemsId": 4,
      //         "itemName": "청바지",
      //         "part1": "중청",
      //         "price": 38800.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "쿠팡",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 216,
      //         "itemsId": 6,
      //         "itemName": "NO.5",
      //         "part1": "50mL",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "첼시마켓",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 217,
      //         "itemsId": 7,
      //         "itemName": "양키캔들",
      //         "part1": "BLACK CHERRY",
      //         "price": 49900.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 218,
      //         "itemsId": 8,
      //         "itemName": "청바지",
      //         "part1": "연청",
      //         "price": 38900.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "쿠팡",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 219,
      //         "itemsId": 9,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 6,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 220,
      //         "itemsId": 33,
      //         "itemName": "청바지22",
      //         "part1": "스키니",
      //         "price": 29900.00,
      //         "unit": "USD",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 221,
      //         "itemsId": 35,
      //         "itemName": "불가리향수",
      //         "part1": "50mL",
      //         "price": 199000.00,
      //         "unit": "USD",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 222,
      //         "itemsId": 36,
      //         "itemName": "아디다스 양말",
      //         "part1": "아디다스",
      //         "price": 299.90,
      //         "unit": "USD",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 223,
      //         "itemsId": 37,
      //         "itemName": "샴푸",
      //         "part1": "엘라스틴",
      //         "price": 25000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 224,
      //         "itemsId": 38,
      //         "itemName": "컨디셔너",
      //         "part1": "엘라스틴",
      //         "price": 23000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 225,
      //         "itemsId": 39,
      //         "itemName": "새치염색약",
      //         "part1": "블랙",
      //         "price": 13000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "수플린",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 226,
      //         "itemsId": 40,
      //         "itemName": "새치염색약",
      //         "part1": "블랙",
      //         "price": 13000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 227,
      //         "itemsId": 41,
      //         "itemName": "여성 셔츠",
      //         "part1": "WHITE",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 228,
      //         "itemsId": 13,
      //         "itemName": "팅글",
      //         "part1": "바디 컨디셔너",
      //         "price": 44000.00,
      //         "unit": "KRW",
      //         "quantity": 5,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 119,
      //     "username": "정해인",
      //     "alias": "정해인",
      //     "requestDate": "2024-09-27",
      //     "releaseDate": "2024-09-27",
      //     "memo": "",
      //     "state": "ready",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 235,
      //         "itemsId": 9,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 236,
      //         "itemsId": 10,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "수플린",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 237,
      //         "itemsId": 41,
      //         "itemName": "여성 셔츠",
      //         "part1": "WHITE",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 238,
      //         "itemsId": 42,
      //         "itemName": "여성 셔츠",
      //         "part1": "WHITE",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "수플린",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 239,
      //         "itemsId": 7,
      //         "itemName": "양키캔들",
      //         "part1": "BLACK CHERRY",
      //         "price": 49900.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 120,
      //     "username": "정해인",
      //     "alias": "정해인",
      //     "requestDate": "2024-09-27",
      //     "releaseDate": "2024-10-15",
      //     "memo": "발주상세 확인용",
      //     "state": "progressing",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 240,
      //         "itemsId": 7,
      //         "itemName": "양키캔들",
      //         "part1": "BLACK CHERRY",
      //         "price": 49900.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 241,
      //         "itemsId": 9,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 242,
      //         "itemsId": 10,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "수플린",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 243,
      //         "itemsId": 41,
      //         "itemName": "여성 셔츠",
      //         "part1": "WHITE",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 244,
      //         "itemsId": 42,
      //         "itemName": "여성 셔츠",
      //         "part1": "WHITE",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "수플린",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 124,
      //     "username": "정해인",
      //     "alias": "정해인",
      //     "requestDate": "2024-09-27",
      //     "releaseDate": "2024-10-31",
      //     "memo": "12345",
      //     "state": "ready",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 263,
      //         "itemsId": 9,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 264,
      //         "itemsId": 10,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "수플린",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 265,
      //         "itemsId": 7,
      //         "itemName": "양키캔들",
      //         "part1": "BLACK CHERRY",
      //         "price": 49900.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 266,
      //         "itemsId": 6,
      //         "itemName": "NO.5",
      //         "part1": "50mL",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "첼시마켓",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 267,
      //         "itemsId": 41,
      //         "itemName": "여성 셔츠",
      //         "part1": "WHITE",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 268,
      //         "itemsId": 42,
      //         "itemName": "여성 셔츠",
      //         "part1": "WHITE",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "수플린",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 130,
      //     "username": "정해인",
      //     "alias": "정해인",
      //     "requestDate": "2024-09-27",
      //     "releaseDate": "2024-10-01",
      //     "memo": "가쟈",
      //     "state": "complete",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 278,
      //         "itemsId": 9,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 13,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 279,
      //         "itemsId": 13,
      //         "itemName": "팅글",
      //         "part1": "바디 컨디셔너",
      //         "price": 44000.00,
      //         "unit": "KRW",
      //         "quantity": 10,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 131,
      //     "username": "정해인",
      //     "alias": "정해인",
      //     "requestDate": "2024-09-27",
      //     "releaseDate": "2024-10-01",
      //     "memo": "가쟈",
      //     "state": "progressing",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 280,
      //         "itemsId": 9,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 5,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 281,
      //         "itemsId": 13,
      //         "itemName": "팅글",
      //         "part1": "바디 컨디셔너",
      //         "price": 44000.00,
      //         "unit": "KRW",
      //         "quantity": 10,
      //         "username": "민주샵1",
      //         "orderDate": "2024-09-27",
      //         "cancel": false
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 132,
      //     "username": "AWS선박",
      //     "alias": "박나래",
      //     "requestDate": "2024-10-01",
      //     "releaseDate": "2024-11-01",
      //     "memo": "",
      //     "state": "ready",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 282,
      //         "itemsId": 8,
      //         "itemName": "청바지",
      //         "part1": "연청",
      //         "price": 38900.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "쿠팡",
      //         "orderDate": "2024-10-01",
      //         "cancel": true
      //       },
      //       {
      //         "orderDetailId": 283,
      //         "itemsId": 7,
      //         "itemName": "양키캔들",
      //         "part1": "BLACK CHERRY",
      //         "price": 49900.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-01",
      //         "cancel": false
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 133,
      //     "username": "선박",
      //     "alias": "선박",
      //     "requestDate": "2024-10-02",
      //     "releaseDate": "2024-10-02",
      //     "memo": "",
      //     "state": "ready",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 284,
      //         "itemsId": 4,
      //         "itemName": "청바지",
      //         "part1": "중청",
      //         "price": 38800.00,
      //         "unit": "KRW",
      //         "quantity": 4,
      //         "username": "쿠팡",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 285,
      //         "itemsId": 6,
      //         "itemName": "NO.5",
      //         "part1": "50mL",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "첼시마켓",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 286,
      //         "itemsId": 7,
      //         "itemName": "양키캔들",
      //         "part1": "BLACK CHERRY",
      //         "price": 49900.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-02",
      //         "cancel": true
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 134,
      //     "username": "선박",
      //     "alias": "선박",
      //     "requestDate": "2024-10-02",
      //     "releaseDate": "2024-11-01",
      //     "memo": "",
      //     "state": "ready",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 287,
      //         "itemsId": 9,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 288,
      //         "itemsId": 36,
      //         "itemName": "아디다스 양말",
      //         "part1": "아디다스",
      //         "price": 299.90,
      //         "unit": "USD",
      //         "quantity": 2,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 289,
      //         "itemsId": 37,
      //         "itemName": "샴푸",
      //         "part1": "엘라스틴",
      //         "price": 25000.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 290,
      //         "itemsId": 38,
      //         "itemName": "컨디셔너",
      //         "part1": "엘라스틴",
      //         "price": 23000.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 291,
      //         "itemsId": 39,
      //         "itemName": "새치염색약",
      //         "part1": "블랙",
      //         "price": 13000.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "수플린",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 292,
      //         "itemsId": 41,
      //         "itemName": "여성 셔츠",
      //         "part1": "WHITE",
      //         "price": 299000.00,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 293,
      //         "itemsId": 84,
      //         "itemName": "캐시미어 베스트",
      //         "part1": "blue",
      //         "price": 45.60,
      //         "unit": "USD",
      //         "quantity": 2,
      //         "username": "수플린",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 294,
      //         "itemsId": 83,
      //         "itemName": "울 가디건",
      //         "part1": "red",
      //         "price": 34.25,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-02",
      //         "cancel": true
      //       },
      //       {
      //         "orderDetailId": 295,
      //         "itemsId": 86,
      //         "itemName": "플라워 원피스",
      //         "part1": "yellow",
      //         "price": 60.30,
      //         "unit": "JPY",
      //         "quantity": 2,
      //         "username": "무지개상회",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 296,
      //         "itemsId": 88,
      //         "itemName": "더블 자켓",
      //         "part1": "white",
      //         "price": 50.45,
      //         "unit": "USD",
      //         "quantity": 2,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 297,
      //         "itemsId": 91,
      //         "itemName": "퍼 자켓",
      //         "part1": "blue",
      //         "price": 45.50,
      //         "unit": "USD",
      //         "quantity": 2,
      //         "username": "무지개상회",
      //         "orderDate": "2024-10-02",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 298,
      //         "itemsId": 92,
      //         "itemName": "울 가디건",
      //         "part1": "green",
      //         "price": 55.30,
      //         "unit": "KRW",
      //         "quantity": 2,
      //         "username": "첼시마켓",
      //         "orderDate": "2024-10-02",
      //         "cancel": true
      //       }
      //     ]
      //   },
      //   {
      //     "orderId": 135,
      //     "username": "선박",
      //     "alias": "선박",
      //     "requestDate": "2024-10-03",
      //     "releaseDate": "2024-11-02",
      //     "memo": "",
      //     "state": "ready",
      //     "orderDetails": [
      //       {
      //         "orderDetailId": 299,
      //         "itemsId": 9,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-03",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 300,
      //         "itemsId": 10,
      //         "itemName": "청바지",
      //         "part1": "스키니",
      //         "price": 68000.00,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "수플린",
      //         "orderDate": "2024-10-03",
      //         "cancel": false
      //       },
      //       {
      //         "orderDetailId": 301,
      //         "itemsId": 83,
      //         "itemName": "울 가디건",
      //         "part1": "red",
      //         "price": 34.25,
      //         "unit": "KRW",
      //         "quantity": 1,
      //         "username": "민주샵1",
      //         "orderDate": "2024-10-03",
      //         "cancel": false
      //       }
      //     ]
      //   }
      // ];
      try {
        const response = await fetch('userOrders',{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        })
        if(!response.ok){
          throw new Error("Order for dash response was not ok");
        }
        const data = await response.json();
        const fildata = data.filter(i => new Date(i.releaseDate) > today)
        const sortdata = fildata.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        console.log('sort', sortdata)
        setListdata(sortdata.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch orders for dash', error)
      } finally {
        setLoading(false)
      }
    }
    fetchorders()
  }, [])

  console.log('자른애들', listdata)

  const setstate = (date) => {
    
  }
  return (
    <div className="text-white">
      {listdata.map( i => (
        <div key={i.orderId} onClick={() => navigate(`/getOrderDetail/${i.orderId}`)} className="status-item">
        <div className={`status-icon ${i.state === 'ready' || i.state === 'progressing' ?'pending':'in-progress'}`}></div>
        <div className="text-white">{`${i.releaseDate} ${new Date(i.releaseDate) > today ? '창고 출고 예정' : '창고 출고 완료'}`}</div>
        <div className="status-details">
          <div>{i.alias}</div>
          <div className="date-text text-sm">{i.requestDate}</div>
        </div>
      </div>
        ))}
    </div>
  )
}
