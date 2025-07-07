import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  FileText,
  Calendar,
} from "lucide-react";

const TransactionDetail = () => {
  const id = "TX-2024-001";
  const [tx, setTx] = useState(null);
  const [updating, setUpdating] = useState(false);

  /* ---------------------- MOCK FETCH DETAIL ---------------------- */
  useEffect(() => {
    setTimeout(() => {
      setTx({
        id,
        clientId: "client-1",
        clientName: "Nguyễn Văn A",
        amount: 150000,
        status: "pending",
        description: "Thanh toán đơn #1234",
        createdAt: "2024-07-04T10:30:00Z",
        paymentMethod: "Chuyển khoản ngân hàng",
        reference: "REF123456789",
      });
    }, 300);
  }, [id]);

  /* ---------------------- UPDATE STATUS ---------------------- */
  const updateStatus = async (status) => {
    setUpdating(true);
    await new Promise((r) => setTimeout(r, 1000)); // mock API
    setTx((prev) => ({ ...prev, status }));
    setUpdating(false);
  };

  /* ---------------------- LOADING STATE ---------------------- */
  if (!tx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Đang tải chi tiết giao dịch...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------- UI HELPERS ---------------------- */
  const StatusBadge = ({ children, color, icon: Icon }) => (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${color}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-1.5" />}
      {children}
    </span>
  );

  const statusConfig = {
    pending: {
      badge: (
        <StatusBadge
          color="bg-amber-100 text-amber-800 border-amber-200"
          icon={Clock}
        >
          Đang chờ
        </StatusBadge>
      ),
      bgPanel: "bg-amber-50",
      borderPanel: "border-amber-200",
    },
    success: {
      badge: (
        <StatusBadge
          color="bg-green-100 text-green-800 border-green-200"
          icon={CheckCircle}
        >
          Thành công
        </StatusBadge>
      ),
      bgPanel: "bg-green-50",
      borderPanel: "border-green-200",
    },
    failed: {
      badge: (
        <StatusBadge
          color="bg-red-100 text-red-800 border-red-200"
          icon={XCircle}
        >
          Thất bại
        </StatusBadge>
      ),
      bgPanel: "bg-red-50",
      borderPanel: "border-red-200",
    },
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const DetailRow = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-start gap-4 py-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p
          className={`${
            highlight
              ? "text-2xl font-bold text-blue-700"
              : "text-gray-900 font-medium"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  /* ---------------------- RENDER ---------------------- */
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto p-8">
        {/* Breadcrumb / Back */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-blue-600 hover:underline font-medium mb-6 text-xl"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Quay lại
        </button>

        {/* Title */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Chi tiết giao dịch
            </h1>
            <p className="text-gray-500">Mã giao dịch: {tx.id}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* MAIN CARD */}
          <article className="lg:col-span-2 space-y-4">
            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tổng quan
                </h2>
                <span className="sm:hidden">
                  {statusConfig[tx.status].badge}
                </span>

                {/* Status badge on the right (desktop) */}
                <div className="hidden sm:block">
                  {statusConfig[tx.status].badge}
                </div>
              </div>

              <DetailRow
                icon={DollarSign}
                label="Số tiền"
                value={`${tx.amount.toLocaleString("vi-VN")} ₫`}
                highlight
              />
              <DetailRow
                icon={User}
                label="Khách hàng"
                value={`${tx.clientName} (${tx.clientId})`}
              />
              <DetailRow
                icon={Calendar}
                label="Thời gian tạo"
                value={formatDate(tx.createdAt)}
              />
            </div>

            {/* Extra information card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Thông tin chi tiết
              </h2>
              <DetailRow
                icon={FileText}
                label="Nội dung giao dịch"
                value={tx.description}
              />
              <DetailRow
                icon={FileText}
                label="Phương thức thanh toán"
                value={tx.paymentMethod}
              />
              <DetailRow
                icon={FileText}
                label="Mã tham chiếu"
                value={<span className="font-mono">{tx.reference}</span>}
              />
            </div>
          </article>

          {/* ACTION PANEL */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác
              </h3>

              {/* Buttons when status is pending */}
              {tx.status === "pending" ? (
                <div className="space-y-3">
                  {/* Approve */}
                  <button
                    onClick={() => updateStatus("success")}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Duyệt thành công
                  </button>
                  {/* Reject */}
                  <button
                    onClick={() => updateStatus("failed")}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    Từ chối
                  </button>
                </div>
              ) : (
                /* Status panel when not pending */
                <div
                  className={`p-4 rounded-lg border ${
                    statusConfig[tx.status].bgPanel
                  } ${statusConfig[tx.status].borderPanel}`}
                >
                  <p className="text-sm text-gray-600 mb-2">
                    Trạng thái hiện tại
                  </p>
                  {statusConfig[tx.status].badge}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default TransactionDetail;
