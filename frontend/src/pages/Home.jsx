import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreateQr from "./CreateQr";
import QrDisplay from "../components/QrDisplay";
import Register from "./Register";
import { FiCheckCircle } from "react-icons/fi";
import Complete from "./Complete";
import PendingApproval from "../components/PendingApproval";

// Component to check if clientId exists
const RequireClientId = ({ children }) => {
  const clientId = localStorage.getItem("clientId");
  const location = useLocation();

  if (!clientId) {
    return <Navigate to="/home/register" state={{ from: location }} replace />;
  }

  return children;
};

// Step progress bar component
const ProgressBar = ({ currentStep }) => {
  const steps = [
    { label: "Đăng ký", path: "/home/register" },
    { label: "Tạo QR", path: "/home/create-qr" },
    { label: "Hoàn tất", path: "/home/complete" },
  ];

  return (
    <div className="max-w-2xl mx-auto mb-8 pt-4">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center min-w-[90px]">
              <div
                className={`w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full ${
                  currentStep >= index
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                } transition-colors duration-300`}
              >
                {currentStep > index ? (
                  <FiCheckCircle className="text-sm" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm font-medium text-center ${
                  currentStep >= index ? "text-green-600" : "text-gray-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-12 sm:w-20 mx-2 sm:mx-4 rounded-full ${
                  currentStep > index ? "bg-green-600" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { pathname } = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  // Update current step based on the route
  useEffect(() => {
    if (pathname === "/home/register") {
      setCurrentStep(0);
    } else if (pathname === "/home/create-qr") {
      setCurrentStep(1);
    } else if (pathname === "/home/complete") {
      setCurrentStep(2);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar currentStep={currentStep} />
      <div className="p-4">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/create-qr"
            element={
              <RequireClientId>
                <CreateQr />
              </RequireClientId>
            }
          />
          <Route
            path="/complete"
            element={
              <RequireClientId>
                <Complete />
              </RequireClientId>
            }
          />
          <Route
            path="/qr-display"
            element={
              <RequireClientId>
                <QrDisplay />
              </RequireClientId>
            }
          />
          <Route path="/pending-approval/:paymentId" element={<PendingApproval />} />
          <Route path="*" element={<Navigate to="/home/register" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;