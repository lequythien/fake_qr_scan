import React from "react";
import { FiInfo } from "react-icons/fi";

const CallbackSimulation = () => (
  <section className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-6 animate-fade-in">
    <h1 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
      <FiInfo /> Mô phỏng Callback
    </h1>
    <p className="text-gray-700 leading-relaxed">
      Trang này mô phỏng cách hệ thống gửi callback (webhook) tới URL bạn đã
      đăng ký. Hãy lắng nghe sự kiện <code>POST</code> tại <strong>callbackUrl</strong> của
      bạn để nhận thông tin thanh toán <code>{"{ paymentId, status }"}</code>.
    </p>
    <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
      <p>
        <strong>Lưu ý:</strong> Đây chỉ là trang mô phỏng phía client. Việc gửi
        callback thực sự sẽ do backend thực hiện.
      </p>
    </div>
  </section>
);

export default CallbackSimulation;