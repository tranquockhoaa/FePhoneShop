import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import {
  FaHome,
  FaSignOutAlt,
  FaUserFriends,
  FaAlignJustify,
  FaAddressBook,
  FaTruck,
} from 'react-icons/fa';

import { CiMobile1 } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import '../../pages/admin/AdminDashboard.css';
import AdminHeader from '../../pages/admin/AdminHeader';
import '../../pages/admin/AdminProduct.css';
import LogoutPopup from '../../pages/manageAccount/LogoutPopup';
import { getAllAdminBrandApiRq } from '../../store/brands/brands.action';

const Sidebar = ({ active, onSelect }) => {
  // const [openProduct, setOpenProduct] = useState(false);
  const [showLogoutPopup, setLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllAdminBrandApiRq());
  }, []);

  // const listBrands = useSelector((state) => state.listBrands.listBrand?.data);

  return (
    <div className="admin-sidebar admin-template-sidebar">
      <div className="sidebar-logo">Dreams POS</div>
      <div
        className={`sidebar-item${active === 'dashboard' ? ' active' : ''}`}
        onClick={() => navigate('/admin')}
      >
        <FaHome /> Dashboard
      </div>
      {/* <div
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
      </div> */}
      <div
        className={`sidebar-item${active === 'product-list' ? ' active' : ''}`}
        onClick={() => navigate('/admin/products')}
      >
        <FaAlignJustify /> Danh sách sản phẩm
      </div>
      <div
        className={`sidebar-item${
          active === 'product-detail' ? ' active' : ''
        }`}
        onClick={() => navigate('/admin/product-detail')}
      >
        <FaAddressBook /> Chi tiết sản phẩm
      </div>

      {/* {openProduct && (
        <div className="sidebar-submenu">
          <div
            className={`sidebar-item${
              active === 'product-list' ? ' active' : ''
            }`}
            onClick={() => navigate('/admin/products')}
          >
            Danh sách sản phẩm
          </div>
          <div
            className={`sidebar-item${
              active === 'product-detail' ? ' active' : ''
            }`}
            onClick={() => navigate('/admin/product-detail')}
          >
            Chi tiết sản phẩm
          </div>
        </div>
      )} */}
      <div
        className={`sidebar-item${active === 'brands' ? ' active' : ''}`}
        onClick={() => navigate('/admin/manage-brands')}
      >
        <CiMobile1 /> Quản lí thương hiệu
      </div>
      <div
        className={`sidebar-item${active === 'orders' ? ' active' : ''}`}
        onClick={() => navigate('/admin/orders')}
      >
        <FaTruck /> Đơn hàng
      </div>
      {/* <div
        className={`sidebar-item${active === 'sales' ? ' active' : ''}`}
        onClick={() => onSelect('sales')}
      >
        <FaChartBar /> Doanh thu
      </div> */}
      <div
        className={`sidebar-item${active === 'customers' ? ' active' : ''}`}
        onClick={() => navigate('/admin/users')}
      >
        <FaUserFriends /> Khách hàng
      </div>
      {/* <div
        className={`sidebar-item${active === 'settings' ? ' active' : ''}`}
        onClick={() => onSelect('settings')}
      >
        <FaCog /> Cài đặt
      </div> */}
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

const LayoutAdmin = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('dashboard');

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

  // Compute active menu key based on current pathname
  const resolvedActive = (() => {
    const path = location.pathname || '';
    if (path.startsWith('/admin/products')) return 'product-list';
    if (path.startsWith('/admin/product-detail')) return 'product-detail';
    if (path.startsWith('/admin/manage-brands')) return 'brands';
    if (path.startsWith('/admin/orders')) return 'orders';
    if (path.startsWith('/admin/users')) return 'customers';
    if (path === '/admin' || path.startsWith('/admin')) return 'dashboard';
    return activeMenu;
  })();

  return (
    <div className="admin-layout admin-template-layout">
      <Sidebar
        active={resolvedActive}
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
