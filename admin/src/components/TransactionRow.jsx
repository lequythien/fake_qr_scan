import React from "react";
import { Link } from "react-router-dom";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const TransactionRow = ({ tx }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="px-4 py-2 whitespace-nowrap font-medium">{tx.id}</td>
    <td className="px-4 py-2 whitespace-nowrap">{tx.clientId}</td>
    <td className="px-4 py-2 text-right whitespace-nowrap">
      {parseInt(tx.amount).toLocaleString("vi-VN")} ₫
    </td>
    <td className="px-4 py-2 whitespace-nowrap">
      <span className={`px-2 py-1 rounded-full text-xs ${statusColor[tx.status]}`}>
        {tx.status}
      </span>
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-right">
      <Link
        to={`/transactions/${tx.id}`}
        className="text-blue-600 hover:underline"
      >
        Xem
      </Link>
    </td>
  </tr>
);

export default TransactionRow;