import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Mock fetch stats
    setTimeout(() => {
      setStats({ total: 128, success: 90, failed: 10, pending: 28 });
    }, 300);
  }, []);

  if (!stats) return <p className="text-center mt-10">Đang tải...</p>;

  const Card = ({ title, value, color }) => (
    <div className="bg-white rounded-xl shadow p-6 flex-1 text-center">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <>
      <main className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-4">
        <Card
          title="Tổng giao dịch"
          value={stats.total}
          color="text-blue-600"
        />
        <Card title="Thành công" value={stats.success} color="text-green-600" />
        <Card title="Thất bại" value={stats.failed} color="text-red-600" />
        <Card title="Đang chờ" value={stats.pending} color="text-yellow-600" />
      </main>
    </>
  );
};

export default Dashboard;
