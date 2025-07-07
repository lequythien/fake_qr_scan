import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const Complete = () => {
  const navigate = useNavigate();
  const clientId = localStorage.getItem("clientId");

  const handleStartOver = () => {
    localStorage.removeItem("clientId");
    navigate("/home/register");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <FiCheckCircle className="text-5xl text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hoàn tất!</h2>
        <p className="text-gray-600 mb-6">
          Quy trình thanh toán của bạn đã hoàn tất.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStartOver}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
          >
            Làm mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default Complete;
