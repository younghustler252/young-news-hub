// components/Header.jsx
import React from "react";
import TopBar from "./header/TopBar";
import MainHeader from "./header/MainHeader";

const Header = () => {
  return (
    <header className="relative z-50">
      <TopBar />
      <MainHeader />
    </header>
  );
};

export default Header;
