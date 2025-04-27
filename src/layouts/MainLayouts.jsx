import React from 'react';
import Header from '../components/Header.jsx';
import { Outlet } from 'react-router-dom';
import './MainLayouts.css';
const MainLayouts = () => {
  return (
    <div>
      <Header />

      <div className="body-container">
        <main>
          <Outlet />
        </main>
      </div>
    




    </div>
  );
};

export default MainLayouts;
