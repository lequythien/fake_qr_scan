import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/home/*" element={<Home />} />
      <Route path="*" element={<Navigate to="/home/register" replace />} />
    </Routes>
  );
};

export default App;