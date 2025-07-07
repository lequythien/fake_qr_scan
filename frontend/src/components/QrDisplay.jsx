import React from "react";
import { FiDownload } from "react-icons/fi";

const QrDisplay = ({ qrUrl }) => {
  const handleDownload = () => {
    if (!qrUrl) return;

    const downloadLink = document.createElement("a");
    downloadLink.href = qrUrl;
    downloadLink.download = "payment-qr.png";
    downloadLink.click();
  };

  return (
    <div className="bg-white rounded-2xl p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Mã QR thanh toán
      </h3>
      <div className="inline-block border-4 border-blue-100 rounded-xl bg-white">
        {qrUrl ? (
          <img
            src={qrUrl}
            alt="Mã QR thanh toán"
            className="w-64 h-64 object-contain"
          />
        ) : (
          <p className="text-gray-500 text-sm">Không có mã QR để hiển thị</p>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-500 break-all max-w-xs mx-auto">
        {qrUrl ? "Quét mã này để thanh toán" : "Chưa có mã QR"}
      </p>
      <button
        onClick={handleDownload}
        disabled={!qrUrl}
        className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
        aria-label="Tải mã QR"
      >
        <FiDownload className="text-lg" />
        Tải QR
      </button>
    </div>
  );
};

export default QrDisplay;