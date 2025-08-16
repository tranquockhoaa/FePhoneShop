import React, { useEffect, useState } from 'react';
import adminAxios from '../../pages/admin/adminAxios';
import { Outlet } from 'react-router-dom';

import {
  FaHome,
  FaUserFriends,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaChartBar,
  FaBoxOpen,
  FaMoneyBillWave,
  FaChartLine,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaExclamationTriangle,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import '../../pages/admin/AdminDashboard.css';
import AdminHeader from '../../pages/admin/AdminHeader';
import LogoutPopup from '../../pages/manageAccount/LogoutPopup';

const Sidebar = ({ active, onSelect }) => {
  const [openProduct, setOpenProduct] = useState(false);
  const [showLogoutPopup, setLogoutPopup] = useState(false);

  return (
    <div className="admin-sidebar admin-template-sidebar">
      <div className="sidebar-logo">Dreams POS</div>
      <div
        className={`sidebar-item${active === 'dashboard' ? ' active' : ''}`}
        onClick={() => onSelect('dashboard')}
      >
        <FaHome /> Dashboard
      </div>
      <div
        className={`sidebar-item${
          active.startsWith('product') ? ' active' : ''
        }`}
        onClick={() => setOpenProduct((v) => !v)}
        style={{ justifyContent: 'space-between' }}
      >
        <span>
          <FaBoxOpen /> Sản phẩm
        </span>
        {openProduct ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {openProduct && (
        <div className="sidebar-submenu">
          <div
            className={`sidebar-item${
              active === 'product-list' ? ' active' : ''
            }`}
            onClick={() => onSelect('product-list')}
          >
            Danh sách sản phẩm
          </div>
          <div
            className={`sidebar-item${
              active === 'product-detail' ? ' active' : ''
            }`}
            onClick={() => onSelect('product-detail')}
          >
            Chi tiết sản phẩm
          </div>
        </div>
      )}
      <div
        className={`sidebar-item${active === 'orders' ? ' active' : ''}`}
        onClick={() => onSelect('orders')}
      >
        <FaClipboardList /> Đơn hàng
      </div>
      <div
        className={`sidebar-item${active === 'sales' ? ' active' : ''}`}
        onClick={() => onSelect('sales')}
      >
        <FaChartBar /> Doanh thu
      </div>
      <div
        className={`sidebar-item${active === 'customers' ? ' active' : ''}`}
        onClick={() => onSelect('customers')}
      >
        <FaUserFriends /> Khách hàng
      </div>
      <div
        className={`sidebar-item${active === 'settings' ? ' active' : ''}`}
        onClick={() => onSelect('settings')}
      >
        <FaCog /> Cài đặt
      </div>
      <div
        className="sidebar-item signout"
        onClick={() => {
          setLogoutPopup(true);
        }}
      >
        <FaSignOutAlt /> Đăng xuất
      </div>
      {showLogoutPopup && (
        <LogoutPopup clickLogoutPopup={() => setLogoutPopup(false)} />
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div
    className="stat-card admin-template-stat-card"
    style={{ '--stat-bg': color }}
  >
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const TopProductsTable = ({ data }) => (
  <div className="recent-table admin-template-products">
    <div className="recent-title">
      <FaTrophy style={{ color: '#ff9800', marginRight: 6 }} />
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
            <td
              colSpan={4}
              style={{ textAlign: 'center', color: '#888' }}
            >
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={row.product_id || idx}>
              <td>{idx + 1}</td>
              <td>{row.product_id}</td>
              <td>{row.name}</td>
              <td style={{ fontWeight: 600, color: '#1976d2' }}>
                {row.totalSold}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const LowStockTable = ({ data }) => (
  <div className="recent-table admin-template-products">
    <div className="recent-title">
      <FaExclamationTriangle style={{ color: '#e53935', marginRight: 6 }} />
      Sản phẩm sắp hết hàng
    </div>
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Mã sản phẩm</th>
          <th>Tên sản phẩm</th>
          <th>Tồn kho</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              style={{ textAlign: 'center', color: '#888' }}
            >
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={row.id || idx}>
              <td>{idx + 1}</td>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td style={{ fontWeight: 600, color: '#e53935' }}>
                {row.quantity}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const RecentOrdersTable = ({ data }) => (
  <div className="recent-table admin-template-products">
    <div className="recent-title">
      <FaClipboardList style={{ color: '#1976d2', marginRight: 6 }} />
      Đơn hàng mới nhất
    </div>
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Khách hàng</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              style={{ textAlign: 'center', color: '#888' }}
            >
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={row.id || idx}>
              <td>{idx + 1}</td>
              <td>{row.customerName || row.userName || 'Không rõ'}</td>
              <td style={{ fontWeight: 600, color: '#1976d2' }}>
                {row.total_price?.toLocaleString() || ''}
              </td>
              <td>{row.status}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const LayoutAdmin = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [orderCountByMonth, setOrderCountByMonth] = useState([]);

  useEffect(() => {
    adminAxios.get('/overview').then((res) => {
      setStats(res.data.data || {});
    });
    adminAxios.get('/products/top-selling').then((res) => {
      const topProducts = (res.data.topSelling || []).map((item) => ({
        ...item,
        totalSold: Number(item.totalsold),
      }));
      setTopProducts(topProducts);
    });
    adminAxios.get('/products/low-stock').then((res) => {
      const lowStock = (res.data.lowStock || []).map((item) => ({
        id: item.product_detail_id,
        code: item.product?.code || '',
        name: item.product?.name || '',
        quantity: item.quantity,
      }));
      setLowStock(lowStock);
    });
    adminAxios.get('/orders?limit=5').then((res) => {
      setRecentOrders(res.data.data || []);
    });
    adminAxios.get('/orders/revenue-by-month').then((res) => {
      setRevenueByMonth(res.data.revenueByMonth || []);
    });
    adminAxios.get('/orders/count-by-month').then((res) => {
      setOrderCountByMonth(res.data.orderCountByMonth || []);
    });
  }, []);

  const adminName = (() => {
    const stored = window.localStorage.getItem('account');
    if (stored) {
      try {
        const acc = JSON.parse(stored);
        if (acc.role === 'admin') return acc.full_name;
      } catch {}
    }
    return 'Admin';
  })();

  return (
    <div className="admin-layout admin-template-layout">
      <Sidebar
        active={activeMenu}
        onSelect={setActiveMenu}
      />
      <div className="admin-content admin-template-content">
        <AdminHeader adminName={adminName} />

        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAdmin;
