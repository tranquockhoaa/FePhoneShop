import React, { useEffect, useState } from 'react';
import adminAxios from '../admin/adminAxios';
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
import './AdminDashboard.css';
import AdminHeader from './AdminHeader';
import AdminProductList from './AdminProductList';
import AdminProductDetail from './AdminProductDetail';
import AdminOrderList from './AdminOrderList';
import AdminManageBrand from './pages/manage-brand';
import StatCard from './components/StatCard';
import TopProductsTable from './components/TopProductsTable';
import Sidebar from './components/SideBar';

import './AdminDashboard.css';
import LogoutPopup from '../manageAccount/LogoutPopup';

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

const AdminDashboard = () => {
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
      <div className="admin-template-content">
        {activeMenu === 'dashboard' && (
          <>
            <div className="admin-template-stat-row">
              <StatCard
                label="Tổng doanh thu"
                value={stats.totalRevenue?.toLocaleString() || 0}
                icon={<FaChartLine size={32} />}
                color="#1976d2"
              />
              <StatCard
                label="Tổng đơn hàng"
                value={stats.totalOrders || 0}
                icon={<FaClipboardList size={32} />}
                color="#4caf50"
              />
              <StatCard
                label="Tổng sản phẩm"
                value={stats.totalProducts || 0}
                icon={<FaBox size={32} />}
                color="#ff9800"
              />
              <StatCard
                label="Tổng khách hàng"
                value={stats.totalUsers || 0}
                icon={<FaUsers size={32} />}
                color="#e53935"
              />
            </div>
            <div className="admin-template-main-row">
              <div className="admin-template-main-left">
                <div className="admin-template-chart-card">
                  <div className="admin-template-chart-title">
                    Doanh thu theo tháng
                  </div>
                  <div className="admin-template-chart-real">
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <BarChart
                        data={revenueByMonth.map((item) => ({
                          ...item,
                          month: new Date(item.month).toLocaleString(
                            'default',
                            { month: 'short', year: '2-digit' }
                          ),
                          revenue: Number(item.revenue),
                        }))}
                        margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="month"
                          stroke="#888"
                        />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="revenue"
                          fill="#1976d2"
                          name="Doanh thu"
                          radius={[6, 6, 0, 0]}
                          barSize={28}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="admin-template-chart-card">
                  <div className="admin-template-chart-title">
                    Số đơn hàng theo tháng
                  </div>
                  <div className="admin-template-chart-real">
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <BarChart
                        data={orderCountByMonth.map((item) => ({
                          ...item,
                          month: new Date(item.month).toLocaleString(
                            'default',
                            { month: 'short', year: '2-digit' }
                          ),
                          orderCount: Number(item.orderCount),
                        }))}
                        margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="month"
                          stroke="#888"
                        />
                        <YAxis
                          stroke="#888"
                          allowDecimals={false}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="orderCount"
                          fill="#4caf50"
                          name="Đơn hàng"
                          radius={[6, 6, 0, 0]}
                          barSize={28}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <TopProductsTable data={topProducts} />
                <LowStockTable data={lowStock} />
              </div>
              <div className="admin-template-main-right">
                <RecentOrdersTable data={recentOrders} />
              </div>
            </div>
          </>
        )}
        {activeMenu === 'product-list' && <AdminProductList />}
        {activeMenu === 'product-detail' && <AdminProductDetail />}
        {activeMenu === 'orders' && <AdminOrderList />}
        {activeMenu === 'manage-brand' && <AdminManageBrand />}
        {/* Các tab khác có thể bổ sung sau */}
      </div>
    </div>
  );
};

export default AdminDashboard;
