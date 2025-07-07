import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

// TransactionRow Component
const TransactionRow = ({ tx, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Thành công";
      case "failed":
        return "Thất bại";
      case "pending":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-2 py-3 sm:px-4 sm:py-4">
        <div className="font-medium text-gray-900 text-sm sm:text-base">
          #{tx.id}
        </div>
      </td>
      <td className="px-2 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
            <span className="text-blue-600 font-medium text-xs sm:text-sm">
              {tx.clientId.split("-")[1]}
            </span>
          </div>
          <div className="text-gray-900 font-medium text-sm sm:text-base">
            {tx.clientId}
          </div>
        </div>
      </td>
      <td className="px-2 py-3 sm:px-4 sm:py-4 text-right">
        <div className="font-semibold text-gray-900 text-sm sm:text-base">
          {formatAmount(tx.amount)}
        </div>
      </td>
      <td className="px-2 py-3 sm:px-4 sm:py-4 text-center">
        <span
          className={`inline-flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(
            tx.status
          )}`}
        >
          {getStatusIcon(tx.status)}
          <span className="ml-1">{getStatusText(tx.status)}</span>
        </span>
      </td>
      <td className="px-2 py-3 sm:px-4 sm:py-4 text-right">
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          <button
            className="p-1 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => onEdit(tx)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Transactions Component
const Transactions = () => {
  const [list, setList] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [formData, setFormData] = useState({
    clientId: "",
    amount: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch mock data
  useEffect(() => {
    setTimeout(() => {
      setList(
        Array.from({ length: 15 }).map((_, i) => ({
          id: 1000 + i,
          clientId: `client-${i % 3}`,
          amount: (Math.random() * 200000).toFixed(0),
          status: ["pending", "success", "failed"][i % 3],
        }))
      );
    }, 400);
  }, []);

  // Handlers
  const handleEdit = (tx) => {
    setEditingTx(tx);
    setFormData({
      clientId: tx.clientId,
      amount: tx.amount,
      status: tx.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setList(
      list.map((tx) => (tx.id === editingTx.id ? { ...tx, ...formData } : tx))
    );
    setIsModalOpen(false);
    setEditingTx(null);
    setFormData({ clientId: "", amount: "", status: "" });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTx(null);
    setFormData({ clientId: "", amount: "", status: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter logic
  const filteredList = list?.filter((tx) => {
    const matchesSearch =
      tx.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = filteredList
    ? Math.ceil(filteredList.length / itemsPerPage)
    : 1;
  const paginatedList = filteredList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusCounts = () => {
    if (!list) return { all: 0, pending: 0, success: 0, failed: 0 };
    return list.reduce(
      (acc, tx) => {
        acc.all += 1;
        acc[tx.status] += 1;
        return acc;
      },
      { all: 0, pending: 0, success: 0, failed: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Danh sách giao dịch
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Quản lý và theo dõi các giao dịch của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Tổng cộng
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {statusCounts.all}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Đang xử lý
                </p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {statusCounts.pending}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Thành công
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {statusCounts.success}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Thất bại
                </p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {statusCounts.failed}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã GD hoặc client..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white w-full sm:w-auto"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Đang xử lý</option>
                  <option value="success">Thành công</option>
                  <option value="failed">Thất bại</option>
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center">
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 px-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Chỉnh sửa giao dịch #{editingTx?.id}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    name="clientId"
                    value={formData.clientId}
                    disabled
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm p-2 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Số tiền
                  </label>
                  <input
                    type="text"
                    name="amount"
                    value={new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(formData.amount)}
                    disabled
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm p-2 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors p-2 text-sm sm:text-base"
                  >
                    <option value="pending">Đang xử lý</option>
                    <option value="success">Thành công</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {!list ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4" />
              <p className="text-gray-600 text-base sm:text-lg">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Mobile View */}
            <div className="block lg:hidden">
              <div className="divide-y divide-gray-200">
                {paginatedList?.map((tx) => (
                  <div key={tx.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        #{tx.id}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          tx.status === "success"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : tx.status === "failed"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        {tx.status === "success"
                          ? "Thành công"
                          : tx.status === "failed"
                          ? "Thất bại"
                          : "Đang xử lý"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-gray-500">
                        Client:
                      </span>
                      <span className="font-medium text-sm sm:text-base">
                        {tx.clientId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs sm:text-sm text-gray-500">
                        Số tiền:
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(tx.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                      <button
                        className="p-1 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(tx)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                      Mã GD
                    </th>
                    <th className="px-2 py-3 sm:px-4 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900">
                      Client
                    </th>
                    <th className="px-2 py-3 sm:px-4 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-900">
                      Số tiền
                    </th>
                    <th className="px-2 py-3 sm:px-4 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900">
                      Trạng thái
                    </th>
                    <th className="px-2 py-3 sm:px-4 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-900">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedList?.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} onEdit={handleEdit} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {paginatedList?.length === 0 && (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy giao dịch
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredList && filteredList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-xs sm:text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">{paginatedList.length}</span> trong{" "}
              <span className="font-medium">{filteredList.length}</span> kết quả
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                      currentPage === page ? "bg-blue-600 text-white" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Transactions;
