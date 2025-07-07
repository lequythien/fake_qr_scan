import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  QrCode,
  Smartphone,
  CheckCircle,
  XCircle,
  Copy,
  RefreshCw,
} from "lucide-react";

// Utility functions for formatting and parsing numbers
const formatNumber = (value) => {
  if (!value) return "";
  const number = parseNumber(value);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseNumber = (value) => {
  if (!value) return "";
  return parseInt(value.toString().replace(/\./g, ""), 10);
};

// Custom input component for formatted number
const FormattedNumberInput = ({ field, form, ...props }) => {
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/\./g, "");
    if (!isNaN(rawValue) && rawValue !== "") {
      form.setFieldValue(field.name, parseInt(rawValue, 10));
      e.target.value = formatNumber(rawValue);
    } else {
      form.setFieldValue(field.name, "");
      e.target.value = "";
    }
  };

  return (
    <input
      {...field}
      {...props}
      value={formatNumber(field.value) || ""}
      onChange={handleChange}
    />
  );
};

// Validation schema using Yup
const paymentSchema = Yup.object({
  amount: Yup.number()
    .required("Số tiền là bắt buộc")
    .positive("Số tiền phải lớn hơn 0")
    .integer("Số tiền phải là số nguyên"),
  description: Yup.string()
    .required("Mô tả là bắt buộc")
    .min(3, "Mô tả phải có ít nhất 3 ký tự"),
  callbackUrl: Yup.string()
    .url("Callback URL phải là một URL hợp lệ")
    .required("Callback URL là bắt buộc"),
});

const PayOSInterface = () => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    description: "",
    orderCode: "",
    keyId: "demo_key_123",
    callbackUrl: "https://yoursite.com/callback",
  });
  const [qrData, setQrData] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [pendingPayment, setPendingPayment] = useState(null);

  // Mô phỏng tạo QR code
  const generateQRCode = (values) => {
    const orderCode = `ORDER_${Date.now()}`;
    const qrContent = `payos://payment?amount=${
      values.amount
    }&desc=${encodeURIComponent(values.description)}&order=${orderCode}`;

    setPaymentData((prev) => ({ ...prev, orderCode, ...values }));
    setQrData(qrContent);

    // Tạo pending payment trên "server"
    const newPendingPayment = {
      id: orderCode,
      amount: values.amount,
      description: values.description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setPendingPayment(newPendingPayment);

    setStep(2);
  };

  // Mô phỏng quét QR và mở link
  const simulateQRScan = () => {
    setStep(3);
    // Mô phỏng thời gian xử lý thanh toán
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% thành công
      setPaymentStatus(isSuccess ? "success" : "failed");
      setStep(4);

      // Mô phỏng callback
      if (isSuccess) {
        simulateCallback(true);
      } else {
        simulateCallback(false);
      }
    }, 3000);
  };

  // Mô phỏng callback từ server
  const simulateCallback = (success) => {
    console.log("Callback received:", {
      orderCode: paymentData.orderCode,
      status: success ? "success" : "failed",
      amount: paymentData.amount,
      timestamp: new Date().toISOString(),
    });
  };

  const resetPayment = () => {
    setStep(1);
    setPaymentData({
      amount: "",
      description: "",
      orderCode: "",
      keyId: "demo_key_123",
      callbackUrl: "https://yoursite.com/callback",
    });
    setQrData("");
    setPaymentStatus("pending");
    setPendingPayment(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Đã copy vào clipboard!");
  };

  // Render QR Code (simplified version)
  const QRCodeDisplay = ({ data }) => (
    <div className="bg-white p-4 rounded-lg shadow-inner">
      <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <QrCode size={64} className="mx-auto mb-2 text-gray-400" />
          <p className="text-xs text-gray-500">QR Code cho thanh toán</p>
          <p className="text-xs text-gray-400 mt-1 break-all">
            {data.substring(0, 20)}...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Fake QR Scan Payment System
          </h1>
          <p className="text-gray-600">Hệ thống thanh toán QR Code</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((i, idx, arr) => (
                <React.Fragment key={i}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= i
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i}
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="mx-2 text-gray-400 font-bold text-xl select-none">
                      ---
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Step subtitles */}
            <div className="flex items-center mt-2">
              {["Tạo thanh toán", "Quét QR", "Đang xử lý", "Kết quả"].map(
                (label, idx) => (
                  <React.Fragment key={label}>
                    <div className="w-8 text-xs text-center text-gray-700 font-medium">
                      {label}
                    </div>
                    {idx < 3 && <div className="w-full" />}
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Step 1: Tạo thanh toán */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Bước 1: Tạo thanh toán
              </h2>
              <Formik
                initialValues={{
                  amount: "",
                  description: "",
                  callbackUrl: "https://yoursite.com/callback",
                }}
                validationSchema={paymentSchema}
                onSubmit={(values) => generateQRCode(values)}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số tiền (VNĐ)
                      </label>
                      <Field
                        name="amount"
                        component={FormattedNumberInput}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="100.000"
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <Field
                        type="text"
                        name="description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Thanh toán đơn hàng"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Key ID
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            value={paymentData.keyId}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard(paymentData.keyId)}
                            className="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Callback URL
                        </label>
                        <div className="flex">
                          <Field
                            type="text"
                            name="callbackUrl"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                document.querySelector(
                                  'input[name="callbackUrl"]'
                                ).value
                              )
                            }
                            className="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <ErrorMessage
                          name="callbackUrl"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 font-semibold disabled:bg-blue-300"
                    >
                      Tạo QR Code
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {/* Step 2: Hiển thị QR Code */}
          {step === 2 && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Bước 2: Quét QR Code
              </h2>
              <div className="flex justify-center mb-4">
                <QRCodeDisplay data={qrData} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Thông tin thanh toán:
                </p>
                <p className="font-semibold">
                  Số tiền:{" "}
                  {parseInt(paymentData.amount).toLocaleString("vi-VN")} VNĐ
                </p>
                <p className="text-sm text-gray-600">
                  Mã đơn: {paymentData.orderCode}
                </p>
                <p className="text-sm text-gray-600">
                  Mô tả: {paymentData.description}
                </p>
              </div>
              <button
                onClick={simulateQRScan}
                className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 font-semibold flex items-center gap-2 mx-auto"
              >
                <Smartphone size={20} />
                Mô phỏng quét QR
              </button>
            </div>
          )}

          {/* Step 3: Đang xử lý */}
          {step === 3 && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Bước 3: Đang xử lý thanh toán
              </h2>
              <div className="flex justify-center mb-4">
                <RefreshCw size={48} className="animate-spin text-blue-500" />
              </div>
              <p className="text-gray-600 mb-2">Đang xử lý giao dịch...</p>
              <p className="text-sm text-gray-500">
                Vui lòng chờ trong giây lát
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-800">
                  Pending Payment đã được tạo trên server với ID:{" "}
                  {paymentData.orderCode}
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Kết quả */}
          {step === 4 && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Bước 4: Kết quả thanh toán
              </h2>
              <div className="flex justify-center mb-4">
                {paymentStatus === "success" ? (
                  <CheckCircle size={64} className="text-green-500" />
                ) : (
                  <XCircle size={64} className="text-red-500" />
                )}
              </div>
              <div
                className={`p-4 rounded-lg mb-4 ${
                  paymentStatus === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p
                  className={`font-semibold ${
                    paymentStatus === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {paymentStatus === "success"
                    ? "Thanh toán thành công!"
                    : "Thanh toán thất bại!"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Mã đơn: {paymentData.orderCode}
                </p>
                <p className="text-sm text-gray-600">
                  Số tiền:{" "}
                  {parseInt(paymentData.amount).toLocaleString("vi-VN")} VNĐ
                </p>
                {paymentStatus === "success" && (
                  <p className="text-xs text-green-600 mt-2">
                    Callback đã được gửi về server của bạn
                  </p>
                )}
              </div>
              <button
                onClick={resetPayment}
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 font-semibold"
              >
                Tạo thanh toán mới
              </button>
            </div>
          )}
        </div>

        {/* Client Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Thông tin Client cần thiết:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">1. Key ID</h4>
              <p className="text-sm text-gray-600 font-mono bg-white p-2 rounded border">
                {paymentData.keyId}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">
                2. Link Callback
              </h4>
              <p className="text-sm text-gray-600 font-mono bg-white p-2 rounded border break-all">
                {paymentData.callbackUrl}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayOSInterface;
