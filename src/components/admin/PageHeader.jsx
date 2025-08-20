import React from 'react';

const AdminPageHeader = ({ title, rightContent, children }) => {
  return (
    <div className="admin-product-header">
      <h2>{title}</h2>
      {rightContent || children}
    </div>
  );
};

export default AdminPageHeader;
