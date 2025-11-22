// components/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
