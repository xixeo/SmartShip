import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Loading from "../Compo/Loading";

export default function PurchaseRequest() {
  const [loading, setLoading] = useState(true);
  const [listdata, setListdata] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchpurcheslist = async () => {
    setLoading(true);
    try {
      const response = await fetch("schedule", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("purchaserequestlist response was not ok");
      }
      const purreq = await response.json();
     // orderId를 기준으로 내림차순 정렬
     const sortdata = purreq.sort((a, b) => b.orderId - a.orderId);
      setListdata(sortdata.slice(0, 4));
    } catch (e) {
      console.log("Failed to fetch PurchaseRequestlist", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchpurcheslist();
  }, []);

  return (
    <div>
        <div className="p-2 cursor-pointer">
          {listdata.map((order) => (
              <div
                key={order.orderId}
                className="text-white rounded-lg mt-2 card-bg"
                onClick={(e) => navigate(`/getOrderDetail/${order.orderId}`)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "18px 24px",
                  }}
                >
                  <div className="w-full">
                    <div className="w-full flex items-center mb-3">
                      <div className="flex text-sm mr-6 text-[#ffffff59]">
                        <h1 className="mr-2">주문일자 : </h1>
                        <h1>{order.requestDate}</h1>
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <h1 className="text-xl font-bold text-[#A276FF]">
                          {order.username}
                        </h1>
                      <div className="flex items-center">
                        <h1 className="mr-3 text-sm">희망입고일 :</h1>
                        <h1 className="ml-2 text-xl font-bold text-[#A276FF]">
                          {order.releaseDate}
                        </h1>
                      </div>
                    </div>
                  </div>
                </Box>
              </div>
            ))
          }
        </div>
    </div>
  );
}
