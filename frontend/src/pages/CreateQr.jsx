import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GrLinkPrevious } from "react-icons/gr";

const CreateQr = () => {
  const [qrUrl, setQrUrl] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SERVER_BASE = "http://192.168.1.17:8001";

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required("Vui lòng nhập số tiền")
      .test("min-amount", "Số tiền tối thiểu là 1.000", (value) => {
        const raw = value?.replace(/\D/g, "") || "0";
        return parseInt(raw, 10) >= 1000;
      }),
  });

  const handleCreate = async (values, { setErrors }) => {
    const numericAmount = parseInt(values.amount.replace(/\D/g, ""), 10);
    const clientId = localStorage.getItem("clientId");

    if (!clientId) {
      setErrors({ amount: "Thiếu clientId! Vui lòng đăng ký trước." });
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrors({ amount: "Vui lòng nhập số tiền hợp lệ." });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVER_BASE}/api/qrcode/generate/${clientId}`,
        { amount: numericAmount }
      );

      const data = response.data;
      setQrUrl(data.qrCode);
      setPaymentInfo({
        id: data.paymentId,
        amount: numericAmount,
        clientId,
        status: data.status,
      });

      // Kết nối socket để theo dõi trạng thái thanh toán
      const socket = io(SERVER_BASE);
      socket.emit("join-payment-room", data.paymentId);

      socket.on("payment-status-updated", ({ status }) => {
        console.log("💡 Status from server (CreateQr):", status);
        localStorage.setItem("finalStatus", status);
        localStorage.setItem("clientId", clientId);
        navigate("/home/complete");
        socket.disconnect();
      });
    } catch (err) {
      console.error("❌ Lỗi tạo mã QR:", err);
      setErrors({ amount: err.response?.data?.message || "Đã xảy ra lỗi khi tạo mã QR." });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    const numeric = value.replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleBack = () => {
    navigate("/home/register");
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <div
        className="flex items-center gap-2 mb-4 text-blue-600 cursor-pointer hover:underline text-lg font-medium"
        onClick={handleBack}
      >
        <GrLinkPrevious />
        Quay lại
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">Tạo mã QR</h2>
      <Formik
        initialValues={{ amount: "" }}
        validationSchema={validationSchema}
        onSubmit={handleCreate}
      >
        {({ values, setFieldValue }) => (
          <Form className="mb-4">
            <label className="block text-gray-700 mb-2">Số tiền:</label>
            <Field name="amount">
              {({ field }) => (
                <input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  value={values.amount}
                  onChange={(e) =>
                    setFieldValue("amount", formatNumber(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="100.000"
                  aria-label="Số tiền (VND)"
                />
              )}
            </Field>
            <ErrorMessage
              name="amount"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              aria-label={loading ? "Đang tạo mã QR" : "Tạo mã QR"}
            >
              {loading ? "Đang tạo..." : "Tạo mã QR"}
            </button>
          </Form>
        )}
      </Formik>

      {qrUrl && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Quét mã QR để thanh toán:</h3>
          <img src={qrUrl} alt="QR Code" className="mx-auto w-56 h-56" />
          <p className="text-sm text-gray-500 mt-2">ID giao dịch: {paymentInfo?.id}</p>
        </div>
      )}
    </div>
  );
};

export default CreateQr;