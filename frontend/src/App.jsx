import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateQr from "./pages/CreateQr";
import QrScan from "./pages/QrScan";
import QrDisplay from "./components/QrDisplay";
import CallbackSimulation from "./pages/CallbackSimulation";
import Register from "./pages/Register";

// Component kiểm tra xem clientId đã đăng ký chưa
const RequireClientId = ({ children }) => {
  const clientId = localStorage.getItem("clientId");
  const location = useLocation();

  if (!clientId) {
    // Nếu chưa có clientId, chuyển về /register và lưu lại đường dẫn hiện tại
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/register" element={<Register />} />

          {/* Các route yêu cầu đã đăng ký clientId */}
          <Route
            path="/create-qr"
            element={
              <RequireClientId>
                <CreateQr />
              </RequireClientId>
            }
          />
          <Route
            path="/callback-simulation"
            element={
              <RequireClientId>
                <CallbackSimulation />
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
          <Route path="/qr-scan/:paymentId" element={<QrScan />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
