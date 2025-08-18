import React from "react";
import Header from "../components/header/Header.jsx";
import { Outlet } from "react-router-dom";
import "./MainLayouts.css";
import Footer from "../components/footer/footer.jsx";
import SearchBranch from "../components/search/search.jsx";
const MainLayouts = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="body-container">
        <main>
          <SearchBranch />
          <Outlet />
        </main>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayouts;
