import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { logout } from "../../features/auth/authSlice";

const DashboardLayout = ({ navItems, title, user }) => {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar items={navItems} />
      <div className="flex-1">
        <Navbar title={title} user={user} onLogout={() => dispatch(logout())} />
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
