import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCreditCard } from "react-icons/fi";

const navItems = [
  { label: "Đăng ký", to: "/register" },
  { label: "Tạo QR", to: "/create-qr" },
  { label: "Callback", to: "/callback-simulation" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link
          to="/register"
          className="flex items-center gap-2 text-blue-600 font-bold text-xl"
        >
          <FiCreditCard className="text-2xl" /> Fake QR Pay
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          {navItems.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`${
                pathname === to
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              } transition-colors`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
