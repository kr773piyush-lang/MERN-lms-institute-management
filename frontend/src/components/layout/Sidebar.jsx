import { NavLink } from "react-router-dom";

const Sidebar = ({ items }) => (
  <aside className="w-full border-r border-slate-200 bg-slate-900 text-slate-100 md:min-h-screen md:w-64">
    <div className="border-b border-slate-700 px-5 py-4">
      <h1 className="text-lg font-bold">LMS Panel</h1>
    </div>
    <nav className="space-y-1 p-3">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `block rounded-md px-3 py-2 text-sm font-medium transition ${
              isActive ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-slate-800"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
