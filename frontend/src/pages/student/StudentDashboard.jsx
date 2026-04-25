import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProgressBar from "../../components/common/ProgressBar";
import { fetchStudentProgress } from "../../features/dashboard/dashboardSlice";

const navItems = [
  { label: "Courses", path: "/student", end: true },
  { label: "Module Viewer", path: "/student/module-viewer" },
  { label: "Progress", path: "/student/progress" },
];

const ModuleCard = ({ title, type, description }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-xs font-semibold uppercase text-blue-600">{type}</p>
    <h4 className="mt-1 text-base font-semibold text-slate-900">{title}</h4>
    <p className="mt-2 text-sm text-slate-600">{description}</p>
  </article>
);

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const progressData = useSelector((state) => state.dashboard.studentProgress);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchStudentProgress(user._id));
    }
  }, [dispatch, user?._id]);

  return (
    <Routes>
      <Route element={<DashboardLayout navItems={navItems} title="Student Dashboard" user={user} />}>
        <Route
          index
          element={
            <section className="grid gap-4 md:grid-cols-2">
              {progressData.map((item) => (
                <article key={item.courseId} className="rounded-xl bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.courseName || item.course || "Course"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Current: {item.currentModuleName || item.activeModule || "N/A"}
                  </p>
                  <div className="mt-4">
                    <ProgressBar value={item.progressPercentage || item.progress || 0} />
                  </div>
                </article>
              ))}
            </section>
          }
        />
        <Route
          path="module-viewer"
          element={
            <section className="space-y-4">
              <ModuleCard
                type="Video"
                title="Redux Toolkit Crash Course"
                description="Watch instructor-led lessons and complete checkpoints."
              />
              <ModuleCard
                type="PDF"
                title="REST API Notes"
                description="Detailed study material with examples and practice tasks."
              />
            </section>
          }
        />
        <Route
          path="progress"
          element={
            <section className="rounded-xl bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">Course Progress Tracker</h3>
              <div className="mt-4 space-y-4">
                {progressData.map((item) => (
                  <div key={item.courseId}>
                    <p className="mb-2 text-sm font-medium text-slate-700">
                      {item.courseName || item.course || "Course"}
                    </p>
                    <ProgressBar value={item.progressPercentage || item.progress || 0} />
                  </div>
                ))}
              </div>
            </section>
          }
        />
      </Route>
    </Routes>
  );
};

export default StudentDashboard;
