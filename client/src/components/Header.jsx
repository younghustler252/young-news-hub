// components/Header.jsx
import React from "react";
import TopBar from "./header/TopBar";
import MainHeader from "./header/MainHeader";
import NavBar from "./header/NavBar";

const Header = () => {
  return (
    <header className="relative z-50">
      <TopBar />
      <MainHeader />
      {/* <NavBar /> */}
    </header>
  );
};

export default Header;
