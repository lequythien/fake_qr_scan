import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

const QrScan = () => {
  const { paymentId } = useParams();
  const [status, setStatus] = useState("scanned"); // scanned | success | failed

  useEffect(() => {
    // Polling API every 3s until status !== pending
    let interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment-status/${paymentId}`);
        const data = await res.json();
        if (data.status && data.status !== "pending") {
          setStatus(data.status);
          clearInterval(interval);
        }
      } catch (e) {
        console.error(e);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [paymentId]);

  return (
    <section className="flex flex-col items-center justify-center text-center h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100 animate-fade-in">
      {status === "scanned" && (
        <>
          <FiLoader className="animate-spin text-blue-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Đang xử lý giao dịch...
          </h2>
          <p className="text-gray-600">Mã giao dịch: {paymentId}</p>
        </>
      )}
      {status === "success" && (
        <>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ.</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h2 className="text-3xl font-bold text-red-600 mb-2">Thanh toán thất bại!</h2>
          <p className="text-gray-600">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </>
      )}
    </section>
  );
};

export default QrScan;