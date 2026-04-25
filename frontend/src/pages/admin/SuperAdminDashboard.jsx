import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import {
  approveUserRequest,
  fetchPendingApprovals,
  fetchUsers,
  rejectUserRequest,
} from "../../features/users/usersSlice";
import { fetchInstitutes } from "../../features/institutes/institutesSlice";

const navItems = [
  { label: "Overview", path: "/super-admin", end: true },
  { label: "Institutes", path: "/super-admin/institutes" },
  { label: "Users", path: "/super-admin/users" },
  { label: "Approvals", path: "/super-admin/approvals" },
];

const Overview = () => (
  <section className="grid gap-4 sm:grid-cols-3">
    {[
      { label: "Institutes", value: "12" },
      { label: "Users", value: "1,240" },
      { label: "Pending Approvals", value: "18" },
    ].map((item) => (
      <article key={item.label} className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">{item.label}</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{item.value}</h3>
      </article>
    ))}
  </section>
);

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const institutes = useSelector((state) => state.institutes.list);
  const users = useSelector((state) => state.users.list);
  const pendingApprovals = useSelector((state) => state.users.pendingApprovals);

  useEffect(() => {
    dispatch(fetchInstitutes());
    dispatch(fetchUsers());
    dispatch(fetchPendingApprovals());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<DashboardLayout navItems={navItems} title="Super Admin" user={user} />}>
        <Route index element={<Overview />} />
        <Route
          path="institutes"
          element={
            <DataTable
              columns={[
                { key: "name", title: "Institute" },
                { key: "code", title: "Code" },
                { key: "active", title: "Active", render: (row) => (row.active ? "Yes" : "No") },
              ]}
              rows={institutes}
            />
          }
        />
        <Route
          path="users"
          element={
            <DataTable
              columns={[
                {
                  key: "name",
                  title: "Name",
                  render: (row) => `${row.firstName || ""} ${row.lastName || ""}`.trim(),
                },
                { key: "email", title: "Email" },
                { key: "isApproved", title: "Approved", render: (row) => (row.isApproved ? "Yes" : "No") },
                { key: "active", title: "Active", render: (row) => (row.active ? "Yes" : "No") },
              ]}
              rows={users}
            />
          }
        />
        <Route
          path="approvals"
          element={
            <DataTable
              columns={[
                {
                  key: "name",
                  title: "Name",
                  render: (row) =>
                    `${row?.userId?.firstName || ""} ${row?.userId?.lastName || ""}`.trim(),
                },
                { key: "email", title: "Email", render: (row) => row?.userId?.email || "-" },
                { key: "status", title: "Status" },
                {
                  key: "actions",
                  title: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await dispatch(approveUserRequest(row._id));
                          dispatch(fetchPendingApprovals());
                          dispatch(fetchUsers());
                        }}
                        className="rounded bg-emerald-600 px-2 py-1 text-xs text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={async () => {
                          await dispatch(rejectUserRequest(row._id));
                          dispatch(fetchPendingApprovals());
                          dispatch(fetchUsers());
                        }}
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                      >
                        Reject
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={pendingApprovals}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default SuperAdminDashboard;
