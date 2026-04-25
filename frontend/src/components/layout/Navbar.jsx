import { getPrimaryRole } from "../../utils/constants";

const Navbar = ({ title, user, onLogout }) => (
  <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-700">
          {user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
        </p>
        <p className="text-xs text-slate-500">{getPrimaryRole(user)}</p>
      </div>
      <button
        onClick={onLogout}
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        Logout
      </button>
    </div>
  </header>
);

export default Navbar;
