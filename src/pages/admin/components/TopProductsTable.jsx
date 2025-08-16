import { FaTrophy } from "react-icons/fa";

const TopProductsTable = ({ data }) => (
  <div className="recent-table admin-template-products">
    <div className="recent-title">
      <FaTrophy style={{ color: "#ff9800", marginRight: 6 }} />
      Sản phẩm bán chạy nhất
    </div>
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Mã sản phẩm</th>
          <th>Tên sản phẩm</th>
          <th>Số lượng đã bán</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={row.product_id || idx}>
              <td>{idx + 1}</td>
              <td>{row.product_id}</td>
              <td>{row.name}</td>
              <td style={{ fontWeight: 600, color: "#1976d2" }}>
                {row.totalSold}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TopProductsTable;
