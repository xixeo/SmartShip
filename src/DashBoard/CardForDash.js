import React, { useState, useEffect, useRef } from "react";
import { useLoading } from "../Compo/LoadingContext";
import { useNavigate } from "react-router-dom";
import './Board.css';

export default function CardForDash() {
  // const { setLoading } = useLoading();
  const navigate = useNavigate();
  // const token = localStorage.getItem('token');
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjgyNTMyNzEsImlkIjoi7KCV7ZW07J24IiwidXNlcm5hbWUiOiJL7ZW07Jq07ISg7IKsIiwiYWxpYXMiOiLsoJXtlbTsnbgiLCJyb2xlIjoiUk9MRV9NQU5BR0VSIn0.Ly0xbi6L85QbXvcLumLR317rfnuCnxTYwZQCeH6C0ME'

  useEffect(()=>{
    const fetchorders = async () => {
      // setLoading(true)
      try{
        const response = await fetch('userOrders',{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        })
        if(!response.ok){
          throw new Error("Order for dash response was not ok");
        }
        const data = await response.json();
        const fildata = data.filter(i => i.state === 'ready' || i.state === 'processing')
        console.log('받아온애들',fildata)
        const dday = fildata.flatMap(i => i.orderDetails).filter(s => s.releaseDate > new Date())
        console.log('데이터 확인', dday)

      }catch(error){
        console.error('Failed to fetch orders for dash', error)
      } finally {
        // setLoading(false)
      }
    }
  },[])


  return (
    <div>
      
    </div>
  )
}
