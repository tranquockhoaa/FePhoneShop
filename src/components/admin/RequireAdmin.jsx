import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getUserProfileRequest } from '../../store/profile/profile.action';

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);

  const token = (() => {
    try {
      return window.localStorage.getItem('token');
    } catch {
      return '';
    }
  })();

  useEffect(() => {
    if (token && !profile && !loading) {
      dispatch(getUserProfileRequest());
    }
  }, [token, profile, loading, dispatch]);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (loading || (token && !profile)) {
    return null;
  }

  if (profile?.role !== 'admin') {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children ? children : <Outlet />;
};

export default RequireAdmin;
