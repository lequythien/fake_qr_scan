import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Scan = () => {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Get paymentId from URL query or pathname
    const urlParams = new URLSearchParams(window.location.search);
    let paymentId = urlParams.get('paymentId');
    if (!paymentId) {
      paymentId = window.location.pathname.split('/').pop();
    }

    console.log('📦 Tracking paymentId:', paymentId);

    // Initialize Socket.IO connection
    const socket = io('http://192.168.1.17:8001');
    socket.emit('join-payment-room', paymentId);

    // Listen for payment status updates
    socket.on('payment-status-updated', ({ status }) => {
      console.log('💡 Status updated:', status);
      if (status === 'success' || status === 'failed') {
        setStatus(status);
      }
    });

    // Cleanup socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {status === 'loading' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ⏳ Vui lòng chờ admin xử lý giao dịch...
          </h2>
          <div className="w-16 h-16 border-8 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      )}
      {status === 'success' && (
        <h1 className="text-4xl font-bold text-green-600">
          🎉 Giao dịch thành công!
        </h1>
      )}
      {status === 'failed' && (
        <h1 className="text-4xl font-bold text-red-600">
          ❌ Giao dịch thất bại
        </h1>
      )}
    </div>
  );
};

export default Scan;