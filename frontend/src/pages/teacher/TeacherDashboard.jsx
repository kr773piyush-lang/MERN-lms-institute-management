import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import { fetchBatches } from "../../features/batches/batchesSlice";

const navItems = [
  { label: "Overview", path: "/teacher", end: true },
  { label: "Assigned Batches", path: "/teacher/batches" },
  { label: "Course Content", path: "/teacher/content" },
];

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const batches = useSelector((state) => state.dashboard.teacherAssignedBatches);

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<DashboardLayout navItems={navItems} title="Teacher Dashboard" user={user} />}>
        <Route
          index
          element={
            <section className="rounded-xl bg-white p-5">
              <h3 className="text-xl font-semibold text-slate-900">Manage teaching workflow</h3>
              <p className="mt-2 text-slate-600">
                You can handle assigned batches and upload content for course modules.
              </p>
            </section>
          }
        />
        <Route
          path="batches"
          element={
            <DataTable
              columns={[{ key: "name", title: "Assigned Batch" }]}
              rows={batches.map((batch) => ({ name: batch }))}
            />
          }
        />
        <Route
          path="content"
          element={
            <div className="rounded-xl bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">Upload Module Content</h3>
              <form className="mt-4 grid gap-3 md:grid-cols-4">
                <input
                  placeholder="Course name"
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Module title"
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <select className="rounded border border-slate-300 px-3 py-2 text-sm">
                  <option>Video</option>
                  <option>PDF</option>
                </select>
                <button className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                  Upload
                </button>
              </form>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default TeacherDashboard;
