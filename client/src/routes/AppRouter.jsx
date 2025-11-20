import { Routes, Route } from "react-router-dom";
import { ROUTE } from "./route";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import AdminLayout from "../components/layout/AdminLayout";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Verify from "../pages/auth/Verify";
import CompleteProfile from "../pages/auth/CompleteProfile";

import Search from "../pages/Search";
import ProtectedRoute from "./protectedRoutes";
import CreatePost from "../pages/CreatePost";
import PostDetails from "../pages/PostDetails";
import MyProfile from "../pages/MyProfile";
import UserProfile from "../pages/UserProfile";
import Notification from "../pages/Notification";
import Messages from "../pages/Messages";

// 🧑‍💼 Admin pages
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import PostManagement from "../pages/admin/PostManagement";
import AdminNotifications from "../pages/admin/AdminNotifications";

const AppRouter = () => {
  return (
    <Routes>
      {/* 🌍 Public routes with header */}
      <Route element={<MainLayout />}>
        <Route path={ROUTE.home} element={<Home />} />
        <Route path={ROUTE.userProfile()} element={<UserProfile />} />
        <Route path={ROUTE.search} element={<Search />} />
      </Route>

      {/* 🔐 Auth routes without header */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path={ROUTE.login} element={<Login />} />
        <Route path={ROUTE.register} element={<Register />} />
        <Route path={ROUTE.verify} element={<Verify />} />
        <Route path="/auth/complete-profile" element={<CompleteProfile />} />
      </Route>

      {/* 🛡️ Protected user routes (header visible) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTE.myProfile} element={<MyProfile />} />
        <Route path={ROUTE.createPost} element={<CreatePost />} />
        <Route path={ROUTE.postDetails()} element={<PostDetails />} />
        <Route path={ROUTE.messageList} element={<Messages />} />
        <Route path={ROUTE.message()} element={<Messages />} />
        <Route path={ROUTE.notifications} element={<Notification />} />
      </Route>

      {/* 🧑‍💼 Admin-only routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="posts" element={<PostManagement />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
