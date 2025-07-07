import React, { useState } from "react";
import QrDisplay from "../components/QrDisplay";
import { FiPlusCircle } from "react-icons/fi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CreateQr = () => {
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required("Vui lòng nhập số tiền")
      .test("min-amount", "Số tiền tối thiểu là 1.000", (value) => {
        const raw = value?.replaceAll(".", "") || "0";
        return parseInt(raw, 10) >= 1000;
      }),
  });

  const handleCreate = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const clientId = localStorage.getItem("clientId");
      if (!clientId) {
        throw new Error("Bạn chưa đăng ký clientId");
      }

      const numericAmount = parseInt(values.amount.replaceAll(".", ""), 10);
      
      const res = await fetch(
        `http://localhost:8001/api/qrcode/generate/${clientId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: numericAmount }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Tạo QR thất bại");
      }

      setQrUrl(data.qrCode);
      setPaymentInfo({
        id: data.paymentId,
        amount: numericAmount,
        clientId,
        status: data.status,
      });
      console.log("QR Code created successfully:", clientId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    const numeric = value.replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <section className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8 animate-fade-in">
      <header className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
          <FiPlusCircle className="text-xl" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-blue-700">
          Tạo mã QR thanh toán
        </h1>
      </header>

      <Formik
        initialValues={{ amount: "" }}
        validationSchema={validationSchema}
        onSubmit={handleCreate}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Số tiền (VND)
              </label>
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
                    placeholder="100.000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </Field>
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Tạo QR Code"}
            </button>
          </Form>
        )}
      </Formik>

      {qrUrl && paymentInfo && (
        <div className="mt-10 border-t pt-6 space-y-6">
          <QrDisplay qrUrl={qrUrl} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl shadow-inner">
            <InfoItem label="Mã đơn hàng" value={paymentInfo.id} />
            <InfoItem
              label="Số tiền"
              value={`${parseInt(paymentInfo.amount).toLocaleString(
                "vi-VN"
              )} VNĐ`}
            />
            <InfoItem label="Client ID" value={paymentInfo.clientId} />
            <InfoItem label="Trạng thái" value={paymentInfo.status} />
          </div>
        </div>
      )}
    </section>
  );
};

const InfoItem = ({ label, value, full }) => (
  <div className={full ? "col-span-full" : ""}>
    <span className="font-medium text-gray-600 mr-1">{label}:</span>
    <span className="text-gray-800 break-all">{value}</span>
  </div>
);

export default CreateQr;