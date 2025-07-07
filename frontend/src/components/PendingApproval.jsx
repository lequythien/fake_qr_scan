import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { FiClock } from 'react-icons/fi';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const socket = io('http://192.168.1.24:8001');

    console.log('📦 Tracking paymentId:', paymentId);
    socket.emit('join-payment-room', paymentId);

    socket.on('payment-status-updated', ({ status }) => {
      console.log('💡 Status updated:', status);
      if (status === 'success') {
        setStatus('success');
        setTimeout(() => navigate('/home/complete'), 1000);
      } else if (status === 'failed') {
        setStatus('failed');
        localStorage.removeItem('clientId');
        setTimeout(() => navigate('/home/register'), 1000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [paymentId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-6">
              <FiClock className="text-6xl text-green-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              ⏳ Đang chờ admin xác nhận...
            </h2>
            <p className="text-gray-600 mb-6">
              Giao dịch của bạn đã được gửi. Vui lòng chờ quản trị viên xử lý.
            </p>
            <div className="w-16 h-16 border-8 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          </>
        )}
        {status === 'success' && (
          <div>
            <h2 className="text-3xl font-extrabold text-green-600 mb-4">
              🎉 Giao dịch thành công!
            </h2>
            <p className="text-gray-600 mb-6">Đang chuyển hướng đến trang hoàn tất...</p>
          </div>
        )}
        {status === 'failed' && (
          <div>
            <h2 className="text-3xl font-extrabold text-red-600 mb-4">
              ❌ Giao dịch thất bại
            </h2>
            <p className="text-gray-600 mb-6">Đang chuyển hướng đến trang đăng ký...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApproval;